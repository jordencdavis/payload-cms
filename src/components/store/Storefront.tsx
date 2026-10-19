import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  ChevronRight, 
  X, 
  Plus, 
  Minus, 
  Check, 
  Star, 
  ArrowRight,
  Sliders,
  SlidersHorizontal as SlidersIcon,
  HelpCircle,
  ExternalLink,
  Lock
} from 'lucide-react';
import { usePayloadCMS } from '../../hooks/usePayloadCMS';
import { Product, Order } from '../../types/cms';

interface StorefrontProps {
  onSwitchToAdmin: () => void;
}

export function Storefront({ onSwitchToAdmin }: StorefrontProps) {
  const { products, categories, blocks, settings, addOrder } = usePayloadCMS();
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity }];
    });
    setCartOpen(true);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as { product: Product; quantity: number }[]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Announcement Banner */}
      {settings.announcementActive && (
        <div className="bg-[#1C1917] text-[#E7E5E4] text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-3">
          <span>{settings.announcementText}</span>
          <button 
            onClick={onSwitchToAdmin}
            className="underline hover:text-white transition-colors flex items-center gap-1 font-semibold text-amber-400"
          >
            <span>Payload Admin</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Top Navbar (Strict 3-zone contract) */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <a href="#" className="font-bold text-lg tracking-tight text-stone-900 whitespace-nowrap shrink-0 font-serif">
          {settings.siteName}
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <a href="#catalog" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">Catalog</a>
          <a href="#story" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">Craftsmanship</a>
          <a href="#reviews" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">Community</a>
          <a href="#faq" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">FAQ</a>
        </nav>

        {/* Zone 3: Primary action (Cart & Admin Switch) */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={onSwitchToAdmin}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
          >
            <span>Payload CMS Admin</span>
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#B45309] text-white rounded-full text-[10px] font-bold flex items-center justify-center font-mono">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Dynamic Blocks Renderer from Payload CMS */}
      <main>
        {blocks.filter(b => b.enabled).map(block => {
          if (block.type === 'hero') {
            return (
              <section key={block.id} className="px-6 py-16 md:py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  {block.settings.accentText && (
                    <span className="inline-block text-xs uppercase tracking-widest text-amber-800 font-semibold bg-amber-50 px-3 py-1 rounded-full">
                      {block.settings.accentText}
                    </span>
                  )}
                  <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 leading-[1.1] tracking-tight">
                    {block.title}
                  </h1>
                  <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-xl">
                    {block.subtitle}
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <a
                      href={block.settings.buttonLink || '#catalog'}
                      className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                    >
                      <span>{block.settings.buttonText || 'Explore Catalog'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <button
                      onClick={onSwitchToAdmin}
                      className="px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-sm font-medium transition-colors"
                    >
                      Open CMS Studio
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-stone-200">
                    <img 
                      src={products[0]?.images[0] || 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80'} 
                      alt="Hero Showcase" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </section>
            );
          }

          if (block.type === 'product_grid') {
            const publishedProducts = products.filter(p => p.status === 'published');
            const filtered = publishedProducts.filter(p => {
              const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
              const matchCat = activeCategory === 'all' || p.category === activeCategory;
              return matchSearch && matchCat;
            });

            return (
              <section id="catalog" key={block.id} className="py-16 px-6 max-w-7xl mx-auto border-t border-stone-200">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-stone-900">{block.title}</h2>
                    <p className="text-stone-600 text-sm mt-1">{block.subtitle}</p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-200/60 rounded-xl">
                    <button
                      onClick={() => setActiveCategory('all')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${activeCategory === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
                    >
                      All Items
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.title)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${activeCategory === cat.title ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mb-8 max-w-md">
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search store catalog..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600 transition-colors shadow-xs"
                    />
                  </div>
                </div>

                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filtered.map(product => (
                    <div 
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative">
                        <img 
                          src={product.images[0]} 
                          alt={product.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.compareAtPrice && (
                          <span className="absolute top-3 left-3 bg-stone-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                            Sale
                          </span>
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-stone-400 font-medium mb-1">
                            {product.category}
                          </div>
                          <h3 className="font-bold text-stone-900 text-lg group-hover:text-amber-800 transition-colors">
                            {product.title}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-stone-900 text-lg">${product.price}</span>
                            {product.compareAtPrice && (
                              <span className="font-mono text-stone-400 text-sm line-through">${product.compareAtPrice}</span>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="px-4 py-2 bg-stone-900 hover:bg-[#B45309] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                          >
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (block.type === 'editorial') {
            return (
              <section id="story" key={block.id} className="py-20 px-6 bg-[#F3F0E6] border-y border-stone-200">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">Atelier Philosophy</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">{block.title}</h2>
                    <p className="text-stone-700 leading-relaxed text-base">{block.subtitle}</p>
                    <div className="pt-2">
                      <button
                        onClick={onSwitchToAdmin}
                        className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
                      >
                        Explore Payload CMS Schema
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80" alt="Craft" className="rounded-2xl object-cover h-64 w-full shadow-md" />
                    <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80" alt="Workshop" className="rounded-2xl object-cover h-64 w-full shadow-md mt-8" />
                  </div>
                </div>
              </section>
            );
          }

          if (block.type === 'testimonials') {
            return (
              <section id="reviews" key={block.id} className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center max-w-xl mx-auto mb-16">
                  <h2 className="text-3xl font-serif font-bold text-stone-900">{block.title}</h2>
                  <p className="text-stone-600 text-sm mt-2">{block.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <TestimonialCard 
                    quote="The ceramic lamp and walnut desk organizer transformed my studio workspace. The quality and tactile finish are unmatched."
                    author="Julian Thorne"
                    role="Principal Architect"
                  />
                  <TestimonialCard 
                    quote="Managing our storefront through Payload CMS is an absolute dream. Instant updates and clean headless architecture."
                    author="Clara Danvers"
                    role="Creative Director"
                  />
                  <TestimonialCard 
                    quote="Exceptional packaging and swift delivery. You can immediately feel the dedication to sustainable materials and timeless design."
                    author="Sophie Laurent"
                    role="Interior Designer"
                  />
                </div>
              </section>
            );
          }

          if (block.type === 'faq') {
            return (
              <section id="faq" key={block.id} className="py-20 px-6 max-w-4xl mx-auto border-t border-stone-200">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-serif font-bold text-stone-900">{block.title}</h2>
                  <p className="text-stone-600 text-sm mt-2">{block.subtitle}</p>
                </div>

                <div className="space-y-4">
                  <FaqItem 
                    question="How does Payload CMS sync with this storefront?" 
                    answer="Any changes made in the Payload Admin Studio (adding products, modifying blocks, updating globals) are persisted instantly in LocalStorage and immediately rendered on the storefront." 
                  />
                  <FaqItem 
                    question="What materials do you use in your products?" 
                    answer="We source 100% natural, durable materials including American black walnut, European stoneware ceramics, and organic Belgian flax linen." 
                  />
                  <FaqItem 
                    question="What are your shipping and return policies?" 
                    answer="We offer complimentary global shipping on orders over $150. All items include a 30-day return policy in original packaging." 
                  />
                </div>
              </section>
            );
          }

          return null;
        })}
      </main>

      {/* Footer */}
      <footer className="bg-[#1C1917] text-[#E7E5E4] py-12 px-6 border-t border-[#292524]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-serif font-bold text-lg text-white">{settings.siteName}</div>
          <div className="text-xs text-stone-400">{settings.footerText}</div>
          <button
            onClick={onSwitchToAdmin}
            className="flex items-center gap-2 px-4 py-2 bg-[#B45309] hover:bg-[#D97706] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <span>Payload CMS Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

      {/* Product Detail Modal (PDP) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh] relative">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden shadow-inner">
                <img src={selectedProduct.images[0]} alt={selectedProduct.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">{selectedProduct.category}</span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-1">{selectedProduct.title}</h2>
                  <div className="text-2xl font-mono font-bold text-stone-900 mt-3">${selectedProduct.price}</div>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed">{selectedProduct.description}</p>

                {selectedProduct.specs && (
                  <div className="border-t border-stone-200 pt-4 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Specifications</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {selectedProduct.specs.map((spec, i) => (
                        <div key={i} className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                          <span className="text-stone-400 block">{spec.label}</span>
                          <span className="font-medium text-stone-800 mt-0.5 block">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-stone-200 flex items-center gap-4">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3.5 bg-stone-900 hover:bg-[#B45309] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Slide-Over Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-700" />
                <span>Your Shopping Bag ({cartItemCount})</span>
              </h3>
              <button onClick={() => setCartOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-stone-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Your shopping bag is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between gap-4 py-4 border-b border-stone-100">
                    <img src={item.product.images[0]} alt={item.product.title} className="w-16 h-16 rounded-xl object-cover bg-stone-100" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-stone-900">{item.product.title}</div>
                      <div className="font-mono text-xs text-stone-500 mt-1">${item.product.price} each</div>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateCartQty(item.product.id, -1)} className="p-1 bg-stone-100 hover:bg-stone-200 rounded-md">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.product.id, 1)} className="p-1 bg-stone-100 hover:bg-stone-200 rounded-md">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-stone-900">${item.product.price * item.quantity}</div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-mono font-bold text-stone-900">${cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Shipping</span>
                  <span className="font-mono font-bold text-stone-900">{cartTotal > 150 ? 'FREE' : '$15'}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span className="font-mono">${cartTotal + (cartTotal > 150 ? 0 : 15)}</span>
                </div>

                <button
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 bg-stone-900 hover:bg-[#B45309] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  Proceed to Secure Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <CheckoutModal 
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={(order) => {
            setCart([]);
            setCheckoutOpen(false);
            setConfirmedOrder(order);
          }}
          shippingFee={cartTotal > 150 ? 0 : 15}
          addOrder={addOrder}
        />
      )}

      {/* Order Confirmed Receipt Modal */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">Order Confirmed!</h3>
              <p className="text-xs text-stone-500 mt-1 font-mono">Order ID: {confirmedOrder.id}</p>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Thank you, {confirmedOrder.customerName}. Your order has been successfully placed and recorded in the Payload CMS Customer Orders collection.
            </p>
            <button
              onClick={() => setConfirmedOrder(null)}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-6">
      <div className="flex gap-1 text-amber-600">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>
      <p className="text-stone-700 text-sm leading-relaxed italic">"{quote}"</p>
      <div>
        <div className="font-bold text-stone-900 text-sm">{author}</div>
        <div className="text-xs text-stone-500">{role}</div>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 text-left font-bold text-stone-900 text-sm flex items-center justify-between"
      >
        <span>{question}</span>
        <span className="text-xl font-mono">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-6 pb-4 text-stone-600 text-sm leading-relaxed border-t border-stone-100 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

function CheckoutModal({ cart, onClose, onSuccess, shippingFee, addOrder }: { cart: { product: Product; quantity: number }[]; onClose: () => void; onSuccess: (order: Order) => void; shippingFee: number; addOrder: any }) {
  const [formData, setFormData] = useState({
    customerName: 'Alex Rivers',
    email: 'alex.rivers@design.co',
    phone: '+1 (555) 432-1098',
    address: '450 Lexington Ave, New York, NY 10017',
    paymentMethod: 'card' as 'card' | 'cod',
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = cartTotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = addOrder({
      ...formData,
      items: cart.map(i => ({ productId: i.product.id, title: i.product.title, price: i.product.price, quantity: i.quantity })),
      total,
    });
    onSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-stone-700">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">Secure Checkout</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={e => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Phone</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">Shipping Address</label>
            <textarea
              rows={2}
              required
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${formData.paymentMethod === 'card' ? 'border-amber-600 bg-amber-50/50 text-amber-900' : 'border-stone-200 text-stone-600'}`}
              >
                <Lock className="w-4 h-4" />
                <span>Credit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${formData.paymentMethod === 'cod' ? 'border-amber-600 bg-amber-50/50 text-amber-900' : 'border-stone-200 text-stone-600'}`}
              >
                <Truck className="w-4 h-4" />
                <span>Cash on Delivery</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-base font-bold">
            <span>Total Due</span>
            <span className="font-mono">${total}</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-stone-900 hover:bg-[#B45309] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            Place Order (${total})
          </button>
        </form>
      </div>
    </div>
  );
}
