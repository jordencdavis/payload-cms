import { Product, Category, PageBlock, MediaAsset, SiteSettings, Order } from '../types/cms';

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    title: 'Home Decor',
    slug: 'home-decor',
    description: 'Sculptural objects, ambient lighting, and artisanal ceramics for living spaces.',
    updatedAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'cat-2',
    title: 'Kitchen & Living',
    slug: 'kitchen-living',
    description: 'Handcrafted tableware, brass accents, and daily ritual essentials.',
    updatedAt: '2026-10-18T10:30:00Z',
  },
  {
    id: 'cat-3',
    title: 'Office & Study',
    slug: 'office-study',
    description: 'Ergonomic organization, solid walnut desk accessories, and notebooks.',
    updatedAt: '2026-10-18T11:00:00Z',
  },
  {
    id: 'cat-4',
    title: 'Apparel & Accessories',
    slug: 'apparel-accessories',
    description: 'Heavy cotton garments, organic linen throws, and everyday carry goods.',
    updatedAt: '2026-10-18T11:30:00Z',
  },
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Ceramic Table Lamp in Sand',
    slug: 'ceramic-table-lamp-sand',
    price: 245,
    compareAtPrice: 280,
    category: 'Home Decor',
    stock: 14,
    description: 'Thrown by hand in our studio using textured stoneware clay with a warm sand glaze. Emits a soft, diffused glow suited for bedside tables or reading corners.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80'
    ],
    status: 'published',
    featured: true,
    specs: [
      { label: 'Material', value: 'Stoneware Ceramic & Linen Shade' },
      { label: 'Dimensions', value: '32cm H x 20cm Dia' },
      { label: 'Cord Length', value: '2.5m Braided Fabric' },
      { label: 'Voltage', value: '110V - 240V' }
    ],
    updatedAt: '2026-10-19T09:15:00Z',
  },
  {
    id: 'prod-2',
    title: 'Solid Walnut Desk Organizer',
    slug: 'solid-walnut-desk-organizer',
    price: 128,
    category: 'Office & Study',
    stock: 22,
    description: 'Milled from a single piece of American black walnut with carved channels for pens, phone, and small stationery items. Finished with natural beeswax.',
    images: [
      'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80'
    ],
    status: 'published',
    featured: true,
    specs: [
      { label: 'Wood', value: 'American Black Walnut' },
      { label: 'Dimensions', value: '38cm L x 14cm W x 3cm H' },
      { label: 'Finish', value: 'Organic Organic Beeswax' }
    ],
    updatedAt: '2026-10-19T09:20:00Z',
  },
  {
    id: 'prod-3',
    title: 'Washed Linen Throw Blanket',
    slug: 'washed-linen-throw-blanket',
    price: 165,
    compareAtPrice: 195,
    category: 'Apparel & Accessories',
    stock: 9,
    description: 'Woven from 100% organic flax linen and stonewashed for an exceptionally soft hand-feel. Lightweight yet warm, designed to soften gracefully over time.',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80'
    ],
    status: 'published',
    featured: true,
    specs: [
      { label: 'Fabric', value: '100% Belgian Flax Linen' },
      { label: 'Dimensions', value: '140cm x 200cm' },
      { label: 'Care', value: 'Machine wash gentle, tumble dry low' }
    ],
    updatedAt: '2026-10-19T09:25:00Z',
  },
  {
    id: 'prod-4',
    title: 'Solid Brass Espresso Tamper',
    slug: 'solid-brass-espresso-tamper',
    price: 92,
    category: 'Kitchen & Living',
    stock: 31,
    description: 'Precision-machined from solid naval brass with an ergonomic turned walnut handle. Weighted perfectly for consistent coffee bed extraction.',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80'
    ],
    status: 'published',
    featured: false,
    specs: [
      { label: 'Base', value: '58.5mm Precision Machined Brass' },
      { label: 'Handle', value: 'Turned Black Walnut' },
      { label: 'Weight', value: '450g' }
    ],
    updatedAt: '2026-10-19T09:30:00Z',
  },
  {
    id: 'prod-5',
    title: 'Speckled Ceramic Mug Duo',
    slug: 'speckled-ceramic-mug-duo',
    price: 58,
    category: 'Kitchen & Living',
    stock: 18,
    description: 'Set of two matching handmade mugs featuring raw unglazed bases and a speckled cream glaze inside. Comfortable pulled handle for your morning brew.',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1000&q=80'
    ],
    status: 'published',
    featured: true,
    specs: [
      { label: 'Capacity', value: '350ml each' },
      { label: 'Safety', value: 'Microwave and dishwasher safe' }
    ],
    updatedAt: '2026-10-19T09:35:00Z',
  },
  {
    id: 'prod-6',
    title: 'Minimalist Leather Notebook',
    slug: 'minimalist-leather-notebook',
    price: 44,
    category: 'Office & Study',
    stock: 40,
    description: 'Hand-bound with vegetable-tanned full grain leather that patinas beautifully. Contains 192 pages of heavyweight, fountain-pen friendly cream paper.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
    ],
    status: 'published',
    featured: false,
    specs: [
      { label: 'Cover', value: 'Italian Veg-Tan Leather' },
      { label: 'Paper', value: '120gsm Acid-Free Ruled' },
      { label: 'Binding', value: 'Coptic Stitch Lay-Flat' }
    ],
    updatedAt: '2026-10-19T09:40:00Z',
  },
];

export const initialBlocks: PageBlock[] = [
  {
    id: 'block-1',
    type: 'hero',
    title: 'Objects for Mindful Living',
    subtitle: 'Explore our curated collection of architectural homewares, artisanal ceramics, and daily essentials designed to age with grace.',
    enabled: true,
    settings: {
      buttonText: 'Explore Catalog',
      buttonLink: '#catalog',
      accentText: 'Payload CMS Powered Storefront',
    },
    updatedAt: '2026-10-18T12:00:00Z',
  },
  {
    id: 'block-2',
    type: 'product_grid',
    title: 'Featured Collection',
    subtitle: 'Hand-selected arrivals from our autumn production run.',
    enabled: true,
    settings: {
      limit: 4,
      buttonText: 'View All Products',
    },
    updatedAt: '2026-10-18T12:05:00Z',
  },
  {
    id: 'block-3',
    type: 'editorial',
    title: 'Crafted Without Compromise',
    subtitle: 'Every object in our catalog is sourced directly from independent makers and multigenerational workshops across Scandinavia and Japan. We prioritize sustainable materials, repairable construction, and timeless utility over fleeting trends.',
    enabled: true,
    settings: {
      imagePosition: 'right',
      buttonText: 'Read Our Journal',
    },
    updatedAt: '2026-10-18T12:10:00Z',
  },
  {
    id: 'block-4',
    type: 'testimonials',
    title: 'From Our Community',
    subtitle: 'Words from architects, designers, and collectors who live with our objects daily.',
    enabled: true,
    settings: {},
    updatedAt: '2026-10-18T12:15:00Z',
  },
  {
    id: 'block-5',
    type: 'faq',
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about shipping, materials, and our maker partnerships.',
    enabled: true,
    settings: {},
    updatedAt: '2026-10-18T12:20:00Z',
  },
];

export const initialMedia: MediaAsset[] = [
  {
    id: 'media-1',
    filename: 'ceramic_lamp_sand.jpg',
    url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
    alt: 'Ceramic Table Lamp in Sand',
    size: '1.4 MB',
    dimensions: '1920 x 1280',
    uploadedAt: '2026-10-18T08:00:00Z',
  },
  {
    id: 'media-2',
    filename: 'walnut_desk_organizer.jpg',
    url: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1000&q=80',
    alt: 'Solid Walnut Desk Organizer',
    size: '950 KB',
    dimensions: '1600 x 1200',
    uploadedAt: '2026-10-18T08:15:00Z',
  },
  {
    id: 'media-3',
    filename: 'linen_throw_blanket.jpg',
    url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
    alt: 'Washed Linen Throw Blanket',
    size: '1.1 MB',
    dimensions: '1800 x 1200',
    uploadedAt: '2026-10-18T08:30:00Z',
  },
];

export const initialSiteSettings: SiteSettings = {
  siteName: 'Atelier & Co.',
  announcementText: 'Complimentary shipping on all international orders over $150.',
  announcementActive: true,
  footerText: '© 2026 Atelier & Co. Powered by Integrated Payload CMS.',
  currency: 'USD ($)',
  taxRate: 0.08,
  shippingFee: 15,
};

export const initialOrders: Order[] = [
  {
    id: 'ORD-8921',
    customerName: 'Eleanor Vance',
    email: 'eleanor@vancedesign.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield, OR 97477',
    items: [
      { productId: 'prod-1', title: 'Ceramic Table Lamp in Sand', price: 245, quantity: 1 }
    ],
    total: 260,
    paymentMethod: 'card',
    status: 'shipped',
    createdAt: '2026-10-18T14:30:00Z'
  },
  {
    id: 'ORD-8922',
    customerName: 'Marcus Sterling',
    email: 'm.sterling@architects.io',
    phone: '+1 (555) 890-1234',
    address: '10880 Wilshire Blvd, Los Angeles, CA 90024',
    items: [
      { productId: 'prod-2', title: 'Solid Walnut Desk Organizer', price: 128, quantity: 2 }
    ],
    total: 271,
    paymentMethod: 'cod',
    status: 'processing',
    createdAt: '2026-10-19T10:15:00Z'
  }
];
