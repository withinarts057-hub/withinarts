import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PaintingCard } from './components/PaintingCard';
import { OurStorySection } from './components/OurStorySection';
import { ReviewsSection } from './components/ReviewsSection';
import { PaintingDetailPage } from './components/PaintingDetailPage';
import { StudioManagerPage } from './components/StudioManagerPage';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import {
  DEFAULT_PAINTINGS,
  DEFAULT_STORY_STEPS,
  DEFAULT_STUDIO_INFO,
  DEFAULT_REVIEW_CARDS
} from './data/artData';
import { Sparkles, Filter, SlidersHorizontal, MessageCircle, RefreshCw, CheckCircle2, X } from 'lucide-react';
import { resolveAssetUrl } from './lib/utils';

export default function App() {
  // Persistence state
  const [paintings, setPaintings] = useState(() => {
    try {
      const saved = localStorage.getItem('withinart_paintings') || localStorage.getItem('rangrez_paintings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove specific previous dummy paintings (painting-1 to painting-6)
          const dummyIds = new Set(['painting-1', 'painting-2', 'painting-3', 'painting-4', 'painting-5', 'painting-6']);
          const validList = parsed.filter((p) => !dummyIds.has(p.id));
          const existingIds = new Set(validList.map((p) => p.id));
          const missingDefaults = DEFAULT_PAINTINGS.filter((p) => !existingIds.has(p.id));
          const merged = [...validList, ...missingDefaults];
          if (merged.length > 0) {
            return merged.map(p => ({
              ...p,
              wallImage: resolveAssetUrl(p.wallImage),
              closeupImage: resolveAssetUrl(p.closeupImage)
            }));
          }
        }
      }
      return DEFAULT_PAINTINGS.map(p => ({
        ...p,
        wallImage: resolveAssetUrl(p.wallImage),
        closeupImage: resolveAssetUrl(p.closeupImage)
      }));
    } catch (e) {
      return DEFAULT_PAINTINGS;
    }
  });

  const [storySteps, setStorySteps] = useState(() => {
    try {
      const saved = localStorage.getItem('withinart_story') || localStorage.getItem('rangrez_story');
      const list = saved ? JSON.parse(saved) : DEFAULT_STORY_STEPS;
      return list.map(s => ({
        ...s,
        image: resolveAssetUrl(s.image)
      }));
    } catch (e) {
      return DEFAULT_STORY_STEPS;
    }
  });

  const [studioInfo, setStudioInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('withinart_info') || localStorage.getItem('rangrez_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && (parsed.name.includes('Rangrez') || parsed.name.toLowerCase().includes('rangrez'))) {
          parsed.name = DEFAULT_STUDIO_INFO.name;
        }
        return parsed;
      }
      return DEFAULT_STUDIO_INFO;
    } catch (e) {
      return DEFAULT_STUDIO_INFO;
    }
  });

  const [reviewCards, setReviewCards] = useState(() => {
    try {
      const saved = localStorage.getItem('withinart_reviews') || localStorage.getItem('rangrez_reviews');
      return saved ? JSON.parse(saved) : DEFAULT_REVIEW_CARDS;
    } catch (e) {
      return DEFAULT_REVIEW_CARDS;
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('withinart_cart') || localStorage.getItem('rangrez_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save to localStorage whenever state changes with safe quota protection
  useEffect(() => {
    try {
      localStorage.setItem('withinart_paintings', JSON.stringify(paintings));
    } catch (e) {
      console.warn("Could not save paintings to localStorage:", e);
    }
  }, [paintings]);

  useEffect(() => {
    try {
      localStorage.setItem('withinart_story', JSON.stringify(storySteps));
    } catch (e) {
      console.warn("Could not save story to localStorage:", e);
    }
  }, [storySteps]);

  useEffect(() => {
    try {
      localStorage.setItem('withinart_info', JSON.stringify(studioInfo));
    } catch (e) {
      console.warn("Could not save studio info to localStorage:", e);
    }
  }, [studioInfo]);

  useEffect(() => {
    try {
      const lightweightCart = (Array.isArray(cart) ? cart : []).map(item => ({
        id: item.id,
        title: item.title,
        pricePKR: Number(item.pricePKR) || 0,
        priceUSD: Number(item.priceUSD) || 0,
        dimensions: item.dimensions || '',
        woodFrame: item.woodFrame || '',
        qty: Number(item.qty) || 1,
        wallImage: (typeof item.wallImage === 'string' && item.wallImage.length > 50000) ? '' : item.wallImage,
        closeupImage: (typeof item.closeupImage === 'string' && item.closeupImage.length > 50000) ? '' : item.closeupImage,
      }));
      localStorage.setItem('withinart_cart', JSON.stringify(lightweightCart));
    } catch (e) {
      console.warn("Could not save cart to localStorage:", e);
    }
  }, [cart]);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [cartToast, setCartToast] = useState(null);
  const toastTimerRef = useRef(null);

  const galleryRef = useRef(null);

  // Dedicated Secret Studio Owner Key: \928731408@admin or #928731408@admin
  const SECRET_ADMIN_KEY = '928731408@admin';

  // Listen for secret admin URL (#928731408@admin, /928731408@admin, or \928731408@admin)
  useEffect(() => {
    const checkAdminRoute = () => {
      const hash = window.location.hash || '';
      const pathname = decodeURIComponent(window.location.pathname || '');
      const search = window.location.search || '';

      const isAdminRequested =
        hash.includes(SECRET_ADMIN_KEY) ||
        pathname.includes(SECRET_ADMIN_KEY) ||
        search.includes(SECRET_ADMIN_KEY);

      if (isAdminRequested) {
        const isAuth = sessionStorage.getItem('withinart_studio_session') === 'authenticated';
        if (isAuth) {
          setIsManagerOpen(true);
          setIsLoginModalOpen(false);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };

    checkAdminRoute();

    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsManagerOpen(true);
    if (!window.location.hash.includes(SECRET_ADMIN_KEY)) {
      window.location.hash = SECRET_ADMIN_KEY;
    }
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    if (window.location.hash.includes(SECRET_ADMIN_KEY)) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleOpenOwnerPortal = () => {
    const isAuth = sessionStorage.getItem('withinart_studio_session') === 'authenticated';
    if (isAuth) {
      setIsManagerOpen(true);
      window.location.hash = SECRET_ADMIN_KEY;
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleCloseManager = () => {
    setIsManagerOpen(false);
    if (window.location.hash.includes(SECRET_ADMIN_KEY)) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleLockPortal = () => {
    try {
      sessionStorage.removeItem('withinart_studio_session');
    } catch (e) {}
    setIsManagerOpen(false);
    if (window.location.hash.includes(SECRET_ADMIN_KEY)) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Categories list
  const categories = useMemo(() => {
    const list = ['All'];
    const seen = new Set();
    paintings.forEach((p) => {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        list.push(p.category);
      }
    });
    return list;
  }, [paintings]);

  // Filtered paintings
  const filteredPaintings = useMemo(() => {
    return paintings.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.medium.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.woodFrame.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'All' ||
        (selectedCategory === 'Limited Edition' ? p.badge?.toLowerCase().includes('limited') : p.category === selectedCategory);

      return matchesSearch && matchesCat;
    });
  }, [paintings, searchTerm, selectedCategory]);

  // Cart operations
  const handleAddToCart = (painting) => {
    if (!painting) return;
    const safePainting = {
      ...painting,
      id: painting.id || `art-${Date.now()}`,
      title: painting.title || 'Untitled Artwork',
      pricePKR: typeof painting.pricePKR === 'string'
        ? Number(painting.pricePKR.replace(/[^0-9]/g, '')) || 0
        : Number(painting.pricePKR) || 0,
      priceUSD: Number(painting.priceUSD) || Math.round((Number(painting.pricePKR) || 0) / 278),
      wallImage: painting.wallImage || '/images/painting_wall_1.jpg',
      closeupImage: painting.closeupImage || painting.wallImage || '/images/painting_closeup_1.jpg',
      dimensions: painting.dimensions || 'Handcrafted Canvas',
      woodFrame: painting.woodFrame || 'Seasoned Wood Frame',
    };

    setCart((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const existing = list.find((item) => item.id === safePainting.id);
      if (existing) {
        return list.map((item) =>
          item.id === safePainting.id ? { ...item, qty: (Number(item.qty) || 1) + 1 } : item
        );
      }
      return [...list, { ...safePainting, qty: 1 }];
    });

    // Show floating toast notification popup (does NOT force open the cart drawer)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setCartToast({ item: safePainting });
    toastTimerRef.current = setTimeout(() => {
      setCartToast(null);
    }, 3800);
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) =>
        item.id === id ? { ...item, qty: Number(newQty) || 1 } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => (Array.isArray(prev) ? prev : []).filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all paintings, story steps, and studio settings to default curated showcase?")) {
      setPaintings(DEFAULT_PAINTINGS);
      setStorySteps(DEFAULT_STORY_STEPS);
      setStudioInfo(DEFAULT_STUDIO_INFO);
      setReviewCards(DEFAULT_REVIEW_CARDS);
      localStorage.clear();
      alert("Studio defaults successfully restored!");
    }
  };

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Dedicated Full-Page Owner Portal View
  if (isManagerOpen) {
    return (
      <StudioManagerPage
        onBack={handleCloseManager}
        paintings={paintings}
        setPaintings={setPaintings}
        storySteps={storySteps}
        setStorySteps={setStorySteps}
        studioInfo={studioInfo}
        setStudioInfo={setStudioInfo}
        onResetDefaults={handleResetDefaults}
        onLock={handleLockPortal}
      />
    );
  }

  // Floating Toast Notification Popup when item is added to cart
  const renderCartToast = () => {
    if (!cartToast) return null;
    return (
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-900/95 text-white border border-sky-400/40 shadow-2xl backdrop-blur-xl max-w-sm">
          <img
            src={cartToast.item.wallImage || cartToast.item.closeupImage}
            alt={cartToast.item.title}
            className="w-12 h-12 rounded-xl object-contain bg-white/10 border border-white/20 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Added to Art Bag!</span>
            </div>
            <p className="text-xs font-bold text-slate-100 truncate">
              {cartToast.item.title}
            </p>
            <p className="text-[11px] text-sky-300 font-medium">
              Rs. {(Number(cartToast.item.pricePKR) || 0).toLocaleString()} PKR
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setIsCartOpen(true);
                setCartToast(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-500/25 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              View Bag
            </button>
            <button
              onClick={() => setCartToast(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Dedicated Full-Page Product Detail View with Cart Drawer and Bag Trigger
  if (selectedPainting) {
    return (
      <div className="relative">
        <PaintingDetailPage
          painting={selectedPainting}
          onBack={() => setSelectedPainting(null)}
          onAddToCart={handleAddToCart}
          whatsappNumber={studioInfo.whatsapp}
          onSelectPainting={(p) => setSelectedPainting(p)}
          allPaintings={paintings}
          cartCount={(Array.isArray(cart) ? cart : []).reduce((sum, item) => sum + (Number(item.qty) || 1), 0)}
          onOpenCart={() => setIsCartOpen(true)}
        />
        {/* Cart Slide-Over Drawer on Detail Page */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={Array.isArray(cart) ? cart : []}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          whatsappNumber={studioInfo.whatsapp}
          studioInfo={studioInfo}
        />
        {/* Floating Added to Bag Toast Notification */}
        {renderCartToast()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Sticky / Decoupled Adaptive Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        studioInfo={studioInfo}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Clean, Non-Messy Hero Section with Natural Sky & Centerpiece Artwork */}
        <Hero
          studioInfo={studioInfo}
          onExploreClick={scrollToGallery}
          featuredPainting={paintings[0]}
          onSelectPainting={(p) => setSelectedPainting(p)}
        />

        {/* Art Gallery Section (White Clean Art Background with Colorful Accents) */}
        <section ref={galleryRef} id="gallery" className="relative py-16 px-4 sm:px-6 max-w-7xl mx-auto">
          {/* Subtle Ambient Colorful Glows */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/2 right-10 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Original Oil & Gold Leaf Canvases</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-slate-900 mb-2">
                Curated Art Collection
              </h2>
              <p className="text-slate-600 text-sm max-w-xl">
                Hover over any card to switch from the <strong className="text-sky-700 font-semibold">Wall View</strong> to the <strong className="text-sky-700 font-semibold">Close-Up View</strong> and activate the <strong className="text-amber-700 font-semibold">Aceternity Lens</strong> to inspect rich oil brushstrokes!
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-sky-500/25'
                      : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200 hover:border-sky-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Result count if searching */}
          {searchTerm && (
            <div className="mb-6 flex items-center justify-between text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
              <span>Showing results matching "{searchTerm}": <strong>{filteredPaintings.length}</strong> pieces found</span>
              <button
                onClick={() => setSearchTerm('')}
                className="text-sky-600 font-semibold hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Paintings Grid */}
          {filteredPaintings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPaintings.map((painting) => (
                <PaintingCard
                  key={painting.id}
                  painting={painting}
                  onSelect={(p) => setSelectedPainting(p)}
                  onAddToCart={handleAddToCart}
                  whatsappNumber={studioInfo.whatsapp}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
              <p className="text-slate-600 text-sm mb-4">No artworks found matching your filter or search query.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-sky-500/20"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Our Story Section with Aceternity LinkPreview */}
        <OurStorySection
          storySteps={storySteps}
          studioInfo={studioInfo}
        />

        {/* Customer Reviews Section */}
        <ReviewsSection
          reviewCards={reviewCards}
        />
      </main>

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        whatsappNumber={studioInfo.whatsapp}
        studioInfo={studioInfo}
      />

      {/* Footer */}
      <Footer
        studioInfo={studioInfo}
        onOpenManager={handleOpenOwnerPortal}
      />

      {/* Secret Studio Owner Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onSuccess={handleLoginSuccess}
      />

      {/* Floating Added to Bag Toast Notification */}
      {renderCartToast()}
    </div>
  );
}
