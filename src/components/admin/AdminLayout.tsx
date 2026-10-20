import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  Code, 
  ShoppingBag, 
  ExternalLink, 
  RotateCcw,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  Eye,
  Menu,
  X,
  DollarSign
} from 'lucide-react';
import { usePayloadCMS } from '../../hooks/usePayloadCMS';
import { Product, Category, PageBlock, Order } from '../../types/cms';

interface AdminLayoutProps {
  onSwitchToStore: () => void;
}

type AdminTab = 'dashboard' | 'products' | 'categories' | 'blocks' | 'media' | 'globals' | 'orders' | 'api';

export function AdminLayout({ onSwitchToStore }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resetToDefaults, isFirebaseSynced, syncError } = usePayloadCMS();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#1C1917] text-[#E7E5E4] flex flex-col border-r border-[#292524] transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Brand header */}
        <div className="p-6 border-b border-[#292524] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#B45309] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-inner">
              P
            </div>
            <div>
              <div className="font-bold text-white tracking-tight">Payload CMS</div>
              <div className="text-xs text-stone-400">Enterprise Admin v3.2</div>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-stone-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            Collections
          </div>
          <SidebarItem 
            icon={<LayoutDashboard className="w-4 h-4" />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} 
          />
          <SidebarItem 
            icon={<Package className="w-4 h-4" />} 
            label="Products" 
            active={activeTab === 'products'} 
            onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }} 
          />
          <SidebarItem 
            icon={<FolderTree className="w-4 h-4" />} 
            label="Categories" 
            active={activeTab === 'categories'} 
            onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }} 
          />
          <SidebarItem 
            icon={<ShoppingBag className="w-4 h-4" />} 
            label="Customer Orders" 
            active={activeTab === 'orders'} 
            onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }} 
          />

          <div className="pt-6 px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            Globals & Content
          </div>
          <SidebarItem 
            icon={<FileText className="w-4 h-4" />} 
            label="Page Block Builder" 
            active={activeTab === 'blocks'} 
            onClick={() => { setActiveTab('blocks'); setMobileMenuOpen(false); }} 
          />
          <SidebarItem 
            icon={<ImageIcon className="w-4 h-4" />} 
            label="Media Library" 
            active={activeTab === 'media'} 
            onClick={() => { setActiveTab('media'); setMobileMenuOpen(false); }} 
          />
          <SidebarItem 
            icon={<Settings className="w-4 h-4" />} 
            label="Site Globals" 
            active={activeTab === 'globals'} 
            onClick={() => { setActiveTab('globals'); setMobileMenuOpen(false); }} 
          />

          <div className="pt-6 px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
            Developer
          </div>
          <SidebarItem 
            icon={<Code className="w-4 h-4" />} 
            label="REST API Explorer" 
            active={activeTab === 'api'} 
            onClick={() => { setActiveTab('api'); setMobileMenuOpen(false); }} 
          />
        </nav>

        {/* Footer actions inside sidebar */}
        <div className="p-4 border-t border-[#292524] space-y-2">
          <button
            onClick={onSwitchToStore}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-[#B45309] hover:bg-[#D97706] text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Live Storefront
            </span>
            <span className="text-[10px] bg-amber-900 px-1.5 py-0.5 rounded text-amber-200">Sync Active</span>
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('Reset all CMS collections and data back to factory defaults?')) {
                resetToDefaults();
                showToast('CMS database reset to initial defaults.');
              }
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-stone-400 hover:text-stone-200 hover:bg-[#292524] rounded-lg text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset CMS Data
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-stone-600 hover:text-stone-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-stone-900 capitalize tracking-tight">
                {activeTab === 'dashboard' ? 'CMS Overview' : activeTab}
              </h1>
              <p className="text-xs text-stone-500">
                Payload CMS v3.2 Headless Engine · Connected to Live Storefront
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isFirebaseSynced ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Cloud Synced (Firestore)
              </div>
            ) : syncError ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-medium" title={syncError}>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Local Mode (Syncing...)
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-stone-100 border border-stone-200 text-stone-700 rounded-lg text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-stone-400 animate-pulse"></span>
                Connecting to Cloud...
              </div>
            )}

            <button
              onClick={onSwitchToStore}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </button>
          </div>
        </header>

        {/* View Switcher */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
          {activeTab === 'products' && <ProductsAdminView showToast={showToast} />}
          {activeTab === 'categories' && <CategoriesAdminView showToast={showToast} />}
          {activeTab === 'blocks' && <BlockBuilderAdminView showToast={showToast} />}
          {activeTab === 'media' && <MediaLibraryAdminView showToast={showToast} />}
          {activeTab === 'globals' && <GlobalsAdminView showToast={showToast} />}
          {activeTab === 'orders' && <OrdersAdminView showToast={showToast} />}
          {activeTab === 'api' && <ApiExplorerAdminView />}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-[#B45309] text-white shadow-sm' 
          : 'text-stone-300 hover:bg-[#292524] hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ----------------------------------------------------
// DASHBOARD VIEW
// ----------------------------------------------------
function DashboardView({ onNavigate }: { onNavigate: (tab: AdminTab) => void }) {
  const { products, categories, blocks, media, orders } = usePayloadCMS();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-[#1C1917] to-[#292524] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Payload CMS Studio</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-1 tracking-tight">Enterprise Headless Content Engine</h2>
          <p className="text-stone-300 mt-2 text-sm leading-relaxed">
            Manage your e-commerce catalog collections, dynamic page block builders, and global site settings with real-time synchronization to the live frontend storefront.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              onClick={() => onNavigate('products')}
              className="px-4 py-2 bg-[#B45309] hover:bg-[#D97706] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              Manage Products ({products.length})
            </button>
            <button 
              onClick={() => onNavigate('blocks')}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold transition-colors border border-stone-700"
            >
              Configure Page Blocks
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Products Catalog" 
          value={products.length.toString()} 
          change={`${products.filter(p => p.status === 'published').length} Published`} 
          icon={<Package className="w-5 h-5 text-amber-600" />} 
          onClick={() => onNavigate('products')}
        />
        <StatCard 
          title="Categories" 
          value={categories.length.toString()} 
          change="Collections" 
          icon={<FolderTree className="w-5 h-5 text-indigo-600" />} 
          onClick={() => onNavigate('categories')}
        />
        <StatCard 
          title="Customer Orders" 
          value={orders.length.toString()} 
          change={`$${totalRevenue.toLocaleString()} Total Revenue`} 
          icon={<ShoppingBag className="w-5 h-5 text-emerald-600" />} 
          onClick={() => onNavigate('orders')}
        />
        <StatCard 
          title="Media Assets" 
          value={media.length.toString()} 
          change="Cloud Storage Ready" 
          icon={<ImageIcon className="w-5 h-5 text-blue-600" />} 
          onClick={() => onNavigate('media')}
        />
      </div>

      {/* Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-stone-900 text-base">Recent Collection Updates</h3>
            <button onClick={() => onNavigate('products')} className="text-xs text-amber-700 hover:underline font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {products.slice(0, 4).map(product => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
                <div className="flex items-center gap-3">
                  <img src={product.images[0]} alt={product.title} className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                  <div>
                    <div className="font-semibold text-sm text-stone-900">{product.title}</div>
                    <div className="text-xs text-stone-500">{product.category} · ${product.price}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${product.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {product.status}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">{new Date(product.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CMS System Health */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-base mb-4">Payload CMS Status</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Payload Version</span>
                <span className="font-mono font-medium text-stone-800">v3.2.1-enterprise</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Database Adapter</span>
                <span className="font-mono font-medium text-emerald-600">LocalAdapter (JSON)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Active Page Blocks</span>
                <span className="font-mono font-medium text-stone-800">{blocks.filter(b => b.enabled).length} / {blocks.length}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-stone-500">REST Endpoints</span>
                <span className="font-mono font-medium text-indigo-600">/api/v1/active</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100">
            <button 
              onClick={() => onNavigate('api')}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
            >
              Explore REST API Docs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, onClick }: { title: string; value: string; change: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-400 cursor-pointer transition-all hover:shadow-md group"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-stone-500">{title}</span>
        <div className="p-2 bg-stone-50 rounded-xl group-hover:bg-amber-50 transition-colors">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-stone-900 mt-3 font-mono tracking-tight">{value}</div>
      <div className="text-xs text-stone-500 mt-1">{change}</div>
    </div>
  );
}

// ----------------------------------------------------
// PRODUCTS ADMIN VIEW
// ----------------------------------------------------
function ProductsAdminView({ showToast }: { showToast: (msg: string) => void }) {
  const { products, categories, addProduct, updateProduct, deleteProduct } = usePayloadCMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    price: 99,
    compareAtPrice: 120,
    category: categories[0]?.title || 'Home Decor',
    stock: 15,
    description: '',
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80'],
    status: 'published' as 'published' | 'draft',
    featured: false,
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      slug: '',
      price: 99,
      compareAtPrice: 120,
      category: categories[0]?.title || 'Home Decor',
      stock: 15,
      description: '',
      images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80'],
      status: 'published',
      featured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice || 0,
      category: product.category,
      stock: product.stock,
      description: product.description,
      images: product.images,
      status: product.status,
      featured: !!product.featured,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingProduct) {
      updateProduct(editingProduct.id, { ...formData, slug });
      showToast(`Product "${formData.title}" updated successfully.`);
    } else {
      addProduct({ ...formData, slug });
      showToast(`Product "${formData.title}" created successfully.`);
    }
    setModalOpen(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 transition-colors"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-amber-600"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.title}>{c.title}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#B45309] hover:bg-[#D97706] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt={product.title} className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0" />
                      <div>
                        <div className="font-semibold text-stone-900">{product.title}</div>
                        <div className="text-xs text-stone-400 font-mono">/{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-stone-600">{product.category}</td>
                  <td className="py-4 px-6 font-mono font-medium text-stone-900">${product.price}</td>
                  <td className="py-4 px-6 font-mono text-stone-600">{product.stock} units</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${product.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(product)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Delete product "${product.title}"?`)) {
                            deleteProduct(product.id);
                            showToast(`Product deleted.`);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
              <h3 className="text-lg font-bold text-stone-900">
                {editingProduct ? 'Edit Product Document' : 'Create New Product Document'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                  placeholder="e.g. Ceramic Table Lamp"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.title}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Document Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.images[0]}
                  onChange={e => setFormData({ ...formData, images: [e.target.value] })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                  placeholder="Enter product description..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                />
                <label htmlFor="featured" className="text-sm text-stone-700 font-medium">Feature in homepage showcase</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B45309] hover:bg-[#D97706] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// CATEGORIES ADMIN VIEW
// ----------------------------------------------------
function CategoriesAdminView({ showToast }: { showToast: (msg: string) => void }) {
  const { categories, addCategory, updateCategory, deleteCategory } = usePayloadCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ title: '', slug: '', description: '' });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ title: '', slug: '', description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ title: cat.title, slug: cat.slug, description: cat.description });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      updateCategory(editingCategory.id, { ...formData, slug });
      showToast(`Category "${formData.title}" updated.`);
    } else {
      addCategory({ ...formData, slug });
      showToast(`Category "${formData.title}" created.`);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Categories Collection</h2>
          <p className="text-xs text-stone-500">Organize your store products into taxonomies</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#B45309] hover:bg-[#D97706] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-stone-900 text-base">{cat.title}</h3>
                <span className="text-xs font-mono text-stone-400">/{cat.slug}</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">{cat.description}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <span className="text-xs text-stone-400 font-mono">Updated {new Date(cat.updatedAt).toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete category "${cat.title}"?`)) {
                      deleteCategory(cat.id);
                      showToast('Category deleted.');
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 mb-4">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B45309] hover:bg-[#D97706] text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// BLOCK BUILDER ADMIN VIEW
// ----------------------------------------------------
function BlockBuilderAdminView({ showToast }: { showToast: (msg: string) => void }) {
  const { blocks, toggleBlock, updateBlock, reorderBlocks } = usePayloadCMS();
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    reorderBlocks(newBlocks);
    showToast('Page blocks reordered.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Payload Page Builder & Blocks</h2>
          <p className="text-xs text-stone-500">Enable, reorder, and configure dynamic homepage sections in real time</p>
        </div>
      </div>

      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={block.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => moveBlock(index, 'up')} 
                  disabled={index === 0}
                  className="p-1 text-stone-400 hover:text-stone-900 disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => moveBlock(index, 'down')} 
                  disabled={index === blocks.length - 1}
                  className="p-1 text-stone-400 hover:text-stone-900 disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase font-mono px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md font-semibold">
                    {block.type}
                  </span>
                  <h3 className="font-bold text-stone-900 text-base">{block.title}</h3>
                </div>
                <p className="text-sm text-stone-600 mt-1">{block.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <button
                onClick={() => {
                  toggleBlock(block.id);
                  showToast(`Block "${block.title}" ${block.enabled ? 'disabled' : 'enabled'}.`);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  block.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {block.enabled ? 'Enabled' : 'Disabled'}
              </button>

              <button
                onClick={() => setEditingBlock(block)}
                className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-medium transition-colors"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingBlock && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Configure Block: {editingBlock.type}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Block Title</label>
                <input
                  type="text"
                  value={editingBlock.title}
                  onChange={e => setEditingBlock({ ...editingBlock, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={editingBlock.subtitle}
                  onChange={e => setEditingBlock({ ...editingBlock, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  onClick={() => setEditingBlock(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateBlock(editingBlock.id, { title: editingBlock.title, subtitle: editingBlock.subtitle });
                    showToast('Block settings saved.');
                    setEditingBlock(null);
                  }}
                  className="px-5 py-2 bg-[#B45309] text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Save Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// MEDIA LIBRARY ADMIN VIEW
// ----------------------------------------------------
function MediaLibraryAdminView({ showToast }: { showToast: (msg: string) => void }) {
  const { media, addMedia, deleteMedia } = usePayloadCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [filename, setFilename] = useState('');
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !filename) return;
    addMedia({
      filename,
      url,
      alt: alt || filename,
      size: '1.2 MB',
      dimensions: '1920 x 1080',
    });
    showToast('Media asset uploaded successfully.');
    setModalOpen(false);
    setFilename('');
    setUrl('');
    setAlt('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Media Library Collection</h2>
          <p className="text-xs text-stone-500">Manage images, banners, and digital assets used across the storefront</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#B45309] hover:bg-[#D97706] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {media.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden group">
            <div className="h-48 overflow-hidden bg-stone-100 relative">
              <img src={item.url} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                {item.dimensions}
              </div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-sm text-stone-900 truncate">{item.filename}</div>
              <div className="text-xs text-stone-400 mt-1 flex items-center justify-between">
                <span>{item.size}</span>
                <button
                  onClick={() => {
                    if (window.confirm('Delete media asset?')) {
                      deleteMedia(item.id);
                      showToast('Media asset deleted.');
                    }
                  }}
                  className="text-rose-600 hover:text-rose-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Upload New Media Asset</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Filename</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. hero_banner.jpg"
                  value={filename}
                  onChange={e => setFilename(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Alt Text</label>
                <input
                  type="text"
                  value={alt}
                  onChange={e => setAlt(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B45309] text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Upload Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// GLOBALS ADMIN VIEW
// ----------------------------------------------------
function GlobalsAdminView({ showToast }: { showToast: (msg: string) => void }) {
  const { settings, updateSettings } = usePayloadCMS();
  const [formData, setFormData] = useState(settings);

  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('Site globals and announcement settings saved.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <h2 className="text-lg font-bold text-stone-900">Payload Globals & Site Configuration</h2>
        <p className="text-xs text-stone-500">Manage global branding, announcement banners, and store checkout policies</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Site Name / Brand</label>
          <input
            type="text"
            value={formData.siteName}
            onChange={e => setFormData({ ...formData, siteName: e.target.value })}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Announcement Banner Text</label>
          <input
            type="text"
            value={formData.announcementText}
            onChange={e => setFormData({ ...formData, announcementText: e.target.value })}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="announcementActive"
            checked={formData.announcementActive}
            onChange={e => setFormData({ ...formData, announcementActive: e.target.checked })}
            className="w-4 h-4 text-amber-600 rounded border-stone-300"
          />
          <label htmlFor="announcementActive" className="text-sm font-medium text-stone-800">Display announcement banner on store header</label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Footer Copyright Text</label>
          <input
            type="text"
            value={formData.footerText}
            onChange={e => setFormData({ ...formData, footerText: e.target.value })}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Currency</label>
            <input
              type="text"
              value={formData.currency}
              onChange={e => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Standard Shipping Fee ($)</label>
            <input
              type="number"
              value={formData.shippingFee}
              onChange={e => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#B45309] hover:bg-[#D97706] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Save Globals
          </button>
        </div>
      </form>
    </div>
  );
}

// ----------------------------------------------------
// ORDERS ADMIN VIEW
// ----------------------------------------------------
function OrdersAdminView({ showToast }: { showToast: (msg: string) => void }) {
  const { orders, updateOrderStatus } = usePayloadCMS();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <h2 className="text-lg font-bold text-stone-900">Customer Orders Collection</h2>
        <p className="text-xs text-stone-500">Track and fulfill customer e-commerce orders placed on the storefront</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Items</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-stone-50/50">
                  <td className="py-4 px-6 font-mono font-bold text-amber-800">{order.id}</td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-stone-900">{order.customerName}</div>
                    <div className="text-xs text-stone-500">{order.email}</div>
                  </td>
                  <td className="py-4 px-6 text-stone-600">
                    {order.items.map(i => `${i.quantity}x ${i.title}`).join(', ')}
                  </td>
                  <td className="py-4 px-6 font-mono font-medium text-stone-900">${order.total}</td>
                  <td className="py-4 px-6 uppercase text-xs font-mono">{order.paymentMethod}</td>
                  <td className="py-4 px-6">
                    <select
                      value={order.status}
                      onChange={e => {
                        updateOrderStatus(order.id, e.target.value as Order['status']);
                        showToast(`Order ${order.id} status updated to ${e.target.value}.`);
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 font-medium capitalize"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right text-xs text-stone-400 font-mono">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// API EXPLORER VIEW
// ----------------------------------------------------
function ApiExplorerAdminView() {
  const { products, categories, settings } = usePayloadCMS();
  const [selectedEndpoint, setSelectedEndpoint] = useState<'products' | 'categories' | 'globals'>('products');

  const getData = () => {
    if (selectedEndpoint === 'products') return products;
    if (selectedEndpoint === 'categories') return categories;
    return settings;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Payload REST API Explorer</h2>
          <p className="text-xs text-stone-500">Live JSON endpoints powered by Payload CMS LocalAdapter</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedEndpoint('products')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedEndpoint === 'products' ? 'bg-[#B45309] text-white' : 'bg-stone-100 text-stone-700'}`}
          >
            /api/products
          </button>
          <button
            onClick={() => setSelectedEndpoint('categories')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedEndpoint === 'categories' ? 'bg-[#B45309] text-white' : 'bg-stone-100 text-stone-700'}`}
          >
            /api/categories
          </button>
          <button
            onClick={() => setSelectedEndpoint('globals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedEndpoint === 'globals' ? 'bg-[#B45309] text-white' : 'bg-stone-100 text-stone-700'}`}
          >
            /api/globals/settings
          </button>
        </div>
      </div>

      <div className="bg-[#1C1917] text-amber-200 p-6 rounded-2xl shadow-xl font-mono text-xs overflow-x-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800 text-stone-400">
          <span>GET https://api.atelier-cms.internal/v1/{selectedEndpoint}</span>
          <span>HTTP/1.1 200 OK</span>
        </div>
        <pre className="whitespace-pre-wrap leading-relaxed">
          {JSON.stringify(getData(), null, 2)}
        </pre>
      </div>
    </div>
  );
}
