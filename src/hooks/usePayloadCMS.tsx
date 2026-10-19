import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Product, Category, PageBlock, MediaAsset, SiteSettings, Order } from '../types/cms';
import { initialProducts, initialCategories, initialBlocks, initialMedia, initialSiteSettings, initialOrders } from '../data/initialData';
import { db } from '../services/firebase';
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';

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
  reorderBlocks: (newBlocks: PageBlock[]) => void;
  addMedia: (media: Omit<MediaAsset, 'id' | 'uploadedAt'>) => void;
  deleteMedia: (id: string) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  resetToDefaults: () => void;
  isFirebaseSynced: boolean;
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

  // Sync with Firestore on mount
  useEffect(() => {
    async function fetchFromFirestore() {
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        if (!prodSnap.empty) {
          const remoteProducts = prodSnap.docs.map(d => d.data() as Product);
          setProducts(remoteProducts);
        } else {
          // Seed Firestore with initial products
          for (const p of initialProducts) {
            await setDoc(doc(db, 'products', p.id), p);
          }
        }

        const catSnap = await getDocs(collection(db, 'categories'));
        if (!catSnap.empty) {
          const remoteCats = catSnap.docs.map(d => d.data() as Category);
          setCategories(remoteCats);
        } else {
          for (const c of initialCategories) {
            await setDoc(doc(db, 'categories', c.id), c);
          }
        }

        const orderSnap = await getDocs(collection(db, 'orders'));
        if (!orderSnap.empty) {
          const remoteOrders = orderSnap.docs.map(d => d.data() as Order);
          setOrders(remoteOrders);
        }

        setIsFirebaseSynced(true);
      } catch (err) {
        console.warn('Firestore sync fallback to localStorage:', err);
      }
    }
    fetchFromFirestore();
  }, []);

  useEffect(() => {
    localStorage.setItem('payload_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('payload_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('payload_blocks', JSON.stringify(blocks));
  }, [blocks]);

  useEffect(() => {
    localStorage.setItem('payload_media', JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem('payload_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('payload_orders', JSON.stringify(orders));
  }, [orders]);

  const addProduct = async (productData: Omit<Product, 'id' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    try {
      await setDoc(doc(db, 'products', newProduct.id), newProduct);
    } catch (e) {
      console.error(e);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p);
    setProducts(updated);
    const target = updated.find(p => p.id === id);
    if (target) {
      try {
        await setDoc(doc(db, 'products', id), target, { merge: true });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.error(e);
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
    try {
      await setDoc(doc(db, 'categories', newCategory.id), newCategory);
    } catch (e) {
      console.error(e);
    }
  };

  const updateCategory = async (id: string, catData: Partial<Category>) => {
    const updated = categories.map(c => c.id === id ? { ...c, ...catData, updatedAt: new Date().toISOString() } : c);
    setCategories(updated);
    const target = updated.find(c => c.id === id);
    if (target) {
      try {
        await setDoc(doc(db, 'categories', id), target, { merge: true });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {
      console.error(e);
    }
  };

  const updateBlock = async (id: string, blockData: Partial<PageBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...blockData, updatedAt: new Date().toISOString() } : b));
  };

  const toggleBlock = async (id: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, enabled: !b.enabled, updatedAt: new Date().toISOString() } : b));
  };

  const reorderBlocks = (newBlocks: PageBlock[]) => {
    setBlocks(newBlocks);
  };

  const addMedia = (mediaData: Omit<MediaAsset, 'id' | 'uploadedAt'>) => {
    const newMedia: MediaAsset = {
      ...mediaData,
      id: `media-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setMedia([newMedia, ...media]);
  };

  const deleteMedia = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
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
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (e) {
      console.error(e);
    }
    return newOrder;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    const target = updated.find(o => o.id === id);
    if (target) {
      try {
        await setDoc(doc(db, 'orders', id), target, { merge: true });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const resetToDefaults = () => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setBlocks(initialBlocks);
    setMedia(initialMedia);
    setSettings(initialSiteSettings);
    setOrders(initialOrders);
    localStorage.clear();
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
