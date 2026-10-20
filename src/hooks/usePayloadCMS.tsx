import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Product, Category, PageBlock, MediaAsset, SiteSettings, Order } from '../types/cms';
import { 
  initialProducts, 
  initialCategories, 
  initialBlocks, 
  initialMedia, 
  initialSiteSettings, 
  initialOrders 
} from '../data/initialData';
import { db } from '../services/firebase';
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  deleteDoc, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';

interface PayloadCMSContextType {
  products: Product[];
  categories: Category[];
  blocks: PageBlock[];
  media: MediaAsset[];
  settings: SiteSettings;
  orders: Order[];
  addProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'updatedAt'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateBlock: (id: string, settings: Partial<PageBlock>) => Promise<void>;
  toggleBlock: (id: string) => Promise<void>;
  reorderBlocks: (newBlocks: PageBlock[]) => Promise<void>;
  addMedia: (media: Omit<MediaAsset, 'id' | 'uploadedAt'>) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isFirebaseSynced: boolean;
  syncError: string | null;
}

const PayloadCMSContext = createContext<PayloadCMSContextType | undefined>(undefined);

export function PayloadCMSProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('payload_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('payload_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [blocks, setBlocks] = useState<PageBlock[]>(() => {
    const saved = localStorage.getItem('payload_blocks');
    return saved ? JSON.parse(saved) : initialBlocks;
  });

  const [media, setMedia] = useState<MediaAsset[]>(() => {
    const saved = localStorage.getItem('payload_media');
    return saved ? JSON.parse(saved) : initialMedia;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('payload_settings');
    return saved ? JSON.parse(saved) : initialSiteSettings;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('payload_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [isFirebaseSynced, setIsFirebaseSynced] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Real-time Firestore synchronization across all browsers
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    async function initFirestoreSync() {
      try {
        // 1. Initial check & seed if Firestore is brand new
        const prodCheck = await getDocs(collection(db, 'products'));
        if (prodCheck.empty) {
          const batch = writeBatch(db);
          for (const p of initialProducts) {
            batch.set(doc(db, 'products', p.id), p);
          }
          for (const c of initialCategories) {
            batch.set(doc(db, 'categories', c.id), c);
          }
          initialBlocks.forEach((b, index) => {
            batch.set(doc(db, 'blocks', b.id), { ...b, order: index });
          });
          batch.set(doc(db, 'settings', 'global'), initialSiteSettings);
          for (const m of initialMedia) {
            batch.set(doc(db, 'media', m.id), m);
          }
          await batch.commit();
        }

        // 2. Real-time listener for Products
        const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
          if (!snapshot.empty) {
            const remote = snapshot.docs.map(d => d.data() as Product);
            setProducts(remote);
            localStorage.setItem('payload_products', JSON.stringify(remote));
          }
        }, (err) => {
          console.error('Products onSnapshot error:', err);
          setSyncError(err.message);
        });
        unsubs.push(unsubProducts);

        // 3. Real-time listener for Categories
        const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
          if (!snapshot.empty) {
            const remote = snapshot.docs.map(d => d.data() as Category);
            setCategories(remote);
            localStorage.setItem('payload_categories', JSON.stringify(remote));
          }
        }, (err) => {
          console.error('Categories onSnapshot error:', err);
        });
        unsubs.push(unsubCategories);

        // 4. Real-time listener for Page Blocks (Text, Headings, Layout)
        const unsubBlocks = onSnapshot(collection(db, 'blocks'), (snapshot) => {
          if (!snapshot.empty) {
            const remote = snapshot.docs.map(d => d.data() as PageBlock);
            // Sort by order index if present
            remote.sort((a, b) => ((a.order ?? 0) - (b.order ?? 0)));
            setBlocks(remote);
            localStorage.setItem('payload_blocks', JSON.stringify(remote));
          }
        }, (err) => {
          console.error('Blocks onSnapshot error:', err);
        });
        unsubs.push(unsubBlocks);

        // 5. Real-time listener for Site Settings (Globals, Announcement, Branding)
        const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
          if (snapshot.exists()) {
            const remote = snapshot.data() as SiteSettings;
            setSettings(remote);
            localStorage.setItem('payload_settings', JSON.stringify(remote));
          }
        }, (err) => {
          console.error('Settings onSnapshot error:', err);
        });
        unsubs.push(unsubSettings);

        // 6. Real-time listener for Media
        const unsubMedia = onSnapshot(collection(db, 'media'), (snapshot) => {
          if (!snapshot.empty) {
            const remote = snapshot.docs.map(d => d.data() as MediaAsset);
            setMedia(remote);
            localStorage.setItem('payload_media', JSON.stringify(remote));
          }
        }, (err) => {
          console.error('Media onSnapshot error:', err);
        });
        unsubs.push(unsubMedia);

        // 7. Real-time listener for Orders
        const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
          if (!snapshot.empty) {
            const remote = snapshot.docs.map(d => d.data() as Order);
            setOrders(remote);
            localStorage.setItem('payload_orders', JSON.stringify(remote));
          }
        }, (err) => {
          console.error('Orders onSnapshot error:', err);
        });
        unsubs.push(unsubOrders);

        setIsFirebaseSynced(true);
        setSyncError(null);
      } catch (err: any) {
        console.warn('Firestore real-time connection error, using local fallback:', err);
        setSyncError(err?.message || 'Connection failed');
      }
    }

    initFirestoreSync();

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  // Update actions that write to both Firestore and local state
  const addProduct = async (productData: Omit<Product, 'id' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
    localStorage.setItem('payload_products', JSON.stringify([newProduct, ...products]));
    try {
      await setDoc(doc(db, 'products', newProduct.id), newProduct);
    } catch (e: any) {
      console.error('Error saving product to Firestore:', e);
      setSyncError(`Failed to sync product: ${e.message}`);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p);
    setProducts(updated);
    localStorage.setItem('payload_products', JSON.stringify(updated));
    const target = updated.find(p => p.id === id);
    if (target) {
      try {
        await setDoc(doc(db, 'products', id), target, { merge: true });
      } catch (e: any) {
        console.error('Error updating product in Firestore:', e);
        setSyncError(`Failed to update product: ${e.message}`);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    const filtered = products.filter(p => p.id !== id);
    setProducts(filtered);
    localStorage.setItem('payload_products', JSON.stringify(filtered));
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e: any) {
      console.error('Error deleting product from Firestore:', e);
      setSyncError(`Failed to delete product: ${e.message}`);
    }
  };

  const addCategory = async (catData: Omit<Category, 'id' | 'updatedAt'>) => {
    const newCategory: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    const updated = [...categories, newCategory];
    setCategories(updated);
    localStorage.setItem('payload_categories', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'categories', newCategory.id), newCategory);
    } catch (e: any) {
      console.error('Error saving category to Firestore:', e);
      setSyncError(`Failed to sync category: ${e.message}`);
    }
  };

  const updateCategory = async (id: string, catData: Partial<Category>) => {
    const updated = categories.map(c => c.id === id ? { ...c, ...catData, updatedAt: new Date().toISOString() } : c);
    setCategories(updated);
    localStorage.setItem('payload_categories', JSON.stringify(updated));
    const target = updated.find(c => c.id === id);
    if (target) {
      try {
        await setDoc(doc(db, 'categories', id), target, { merge: true });
      } catch (e: any) {
        console.error('Error updating category in Firestore:', e);
        setSyncError(`Failed to update category: ${e.message}`);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    const filtered = categories.filter(c => c.id !== id);
    setCategories(filtered);
    localStorage.setItem('payload_categories', JSON.stringify(filtered));
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e: any) {
      console.error('Error deleting category from Firestore:', e);
      setSyncError(`Failed to delete category: ${e.message}`);
    }
  };

  const updateBlock = async (id: string, blockData: Partial<PageBlock>) => {
    const updated = blocks.map(b => b.id === id ? { ...b, ...blockData, updatedAt: new Date().toISOString() } : b);
    setBlocks(updated);
    localStorage.setItem('payload_blocks', JSON.stringify(updated));
    const target = updated.find(b => b.id === id);
    if (target) {
      try {
        await setDoc(doc(db, 'blocks', id), target, { merge: true });
      } catch (e: any) {
        console.error('Error saving block text to Firestore:', e);
        setSyncError(`Failed to sync block: ${e.message}`);
      }
    }
  };

  const toggleBlock = async (id: string) => {
    const updated = blocks.map(b => b.id === id ? { ...b, enabled: !b.enabled, updatedAt: new Date().toISOString() } : b);
    setBlocks(updated);
    localStorage.setItem('payload_blocks', JSON.stringify(updated));
    const target = updated.find(b => b.id === id);
    if (target) {
      try {
        await setDoc(doc(db, 'blocks', id), target, { merge: true });
      } catch (e: any) {
        console.error('Error updating block state in Firestore:', e);
      }
    }
  };

  const reorderBlocks = async (newBlocks: PageBlock[]) => {
    const ordered = newBlocks.map((b, index) => ({ ...b, order: index }));
    setBlocks(ordered);
    localStorage.setItem('payload_blocks', JSON.stringify(ordered));
    try {
      const batch = writeBatch(db);
      ordered.forEach(b => {
        batch.set(doc(db, 'blocks', b.id), b, { merge: true });
      });
      await batch.commit();
    } catch (e: any) {
      console.error('Error saving block order to Firestore:', e);
    }
  };

  const addMedia = async (mediaData: Omit<MediaAsset, 'id' | 'uploadedAt'>) => {
    const newMedia: MediaAsset = {
      ...mediaData,
      id: `media-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    const updated = [newMedia, ...media];
    setMedia(updated);
    localStorage.setItem('payload_media', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'media', newMedia.id), newMedia);
    } catch (e: any) {
      console.error('Error saving media to Firestore:', e);
    }
  };

  const deleteMedia = async (id: string) => {
    const filtered = media.filter(m => m.id !== id);
    setMedia(filtered);
    localStorage.setItem('payload_media', JSON.stringify(filtered));
    try {
      await deleteDoc(doc(db, 'media', id));
    } catch (e: any) {
      console.error('Error deleting media from Firestore:', e);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    localStorage.setItem('payload_settings', JSON.stringify(merged));
    try {
      await setDoc(doc(db, 'settings', 'global'), merged, { merge: true });
    } catch (e: any) {
      console.error('Error saving globals to Firestore:', e);
      setSyncError(`Failed to save globals: ${e.message}`);
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'processing',
      createdAt: new Date().toISOString(),
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('payload_orders', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (e: any) {
      console.error('Error saving order to Firestore:', e);
    }
    return newOrder;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('payload_orders', JSON.stringify(updated));
    const target = updated.find(o => o.id === id);
    if (target) {
      try {
        await setDoc(doc(db, 'orders', id), target, { merge: true });
      } catch (e: any) {
        console.error('Error updating order in Firestore:', e);
      }
    }
  };

  const resetToDefaults = async () => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setBlocks(initialBlocks);
    setMedia(initialMedia);
    setSettings(initialSiteSettings);
    setOrders(initialOrders);
    localStorage.clear();
    try {
      const batch = writeBatch(db);
      for (const p of initialProducts) {
        batch.set(doc(db, 'products', p.id), p);
      }
      for (const c of initialCategories) {
        batch.set(doc(db, 'categories', c.id), c);
      }
      initialBlocks.forEach((b, index) => {
        batch.set(doc(db, 'blocks', b.id), { ...b, order: index });
      });
      batch.set(doc(db, 'settings', 'global'), initialSiteSettings);
      for (const m of initialMedia) {
        batch.set(doc(db, 'media', m.id), m);
      }
      await batch.commit();
    } catch (e) {
      console.error('Error resetting Firestore defaults:', e);
    }
  };

  return (
    <PayloadCMSContext.Provider
      value={{
        products,
        categories,
        blocks,
        media,
        settings,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateBlock,
        toggleBlock,
        reorderBlocks,
        addMedia,
        deleteMedia,
        updateSettings,
        addOrder,
        updateOrderStatus,
        resetToDefaults,
        isFirebaseSynced,
        syncError,
      }}
    >
      {children}
    </PayloadCMSContext.Provider>
  );
}

export function usePayloadCMS() {
  const context = useContext(PayloadCMSContext);
  if (!context) throw new Error('usePayloadCMS must be used within a PayloadCMSProvider');
  return context;
}
