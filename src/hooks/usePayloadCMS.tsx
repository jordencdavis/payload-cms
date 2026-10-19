import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Product, Category, PageBlock, MediaAsset, SiteSettings, Order } from '../types/cms';
import { initialProducts, initialCategories, initialBlocks, initialMedia, initialSiteSettings, initialOrders } from '../data/initialData';

interface PayloadCMSContextType {
  products: Product[];
  categories: Category[];
  blocks: PageBlock[];
  media: MediaAsset[];
  settings: SiteSettings;
  orders: Order[];
  addProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'updatedAt'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  updateBlock: (id: string, settings: Partial<PageBlock>) => void;
  toggleBlock: (id: string) => void;
  reorderBlocks: (newBlocks: PageBlock[]) => void;
  addMedia: (media: Omit<MediaAsset, 'id' | 'uploadedAt'>) => void;
  deleteMedia: (id: string) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  resetToDefaults: () => void;
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

  const addProduct = (productData: Omit<Product, 'id' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setProducts([newProduct, ...products]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addCategory = (catData: Omit<Category, 'id' | 'updatedAt'>) => {
    const newCategory: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, catData: Partial<Category>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...catData, updatedAt: new Date().toISOString() } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const updateBlock = (id: string, blockData: Partial<PageBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...blockData, updatedAt: new Date().toISOString() } : b));
  };

  const toggleBlock = (id: string) => {
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

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'processing',
      createdAt: new Date().toISOString(),
    };
    setOrders([newOrder, ...orders]);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
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
