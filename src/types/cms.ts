export type DocumentStatus = 'published' | 'draft';

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  stock: number;
  description: string;
  images: string[];
  status: DocumentStatus;
  featured?: boolean;
  specs?: { label: string; value: string }[];
  updatedAt: string;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description: string;
  updatedAt: string;
}

export type BlockType = 'hero' | 'product_grid' | 'editorial' | 'testimonials' | 'faq';

export interface PageBlock {
  id: string;
  type: BlockType;
  title: string;
  subtitle: string;
  enabled: boolean;
  settings: {
    limit?: number;
    categoryId?: string;
    buttonText?: string;
    buttonLink?: string;
    imagePosition?: 'left' | 'right';
    accentText?: string;
  };
  order?: number;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  alt: string;
  size: string;
  dimensions: string;
  uploadedAt: string;
}

export interface SiteSettings {
  siteName: string;
  announcementText: string;
  announcementActive: boolean;
  footerText: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: { productId: string; title: string; price: number; quantity: number }[];
  total: number;
  paymentMethod: 'cod' | 'card';
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}
