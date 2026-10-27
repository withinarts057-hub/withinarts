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

export default function App() {
  // Persistence state
  const [paintings, setPaintings] = useState(() => {
    try {
      const saved = localStorage.getItem('withinarts_paintings') || localStorage.getItem('withinart_paintings') || localStorage.getItem('rangrez_paintings');
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
            return merged;
          }
        }
      }
      return DEFAULT_PAINTINGS;
    } catch (e) {
      return DEFAULT_PAINTINGS;
    }
  });

  const [storySteps, setStorySteps] = useState(() => {
    try {
      const saved = localStorage.getItem('withinarts_story') || localStorage.getItem('withinart_story') || localStorage.getItem('rangrez_story');
      return saved ? JSON.parse(saved) : DEFAULT_STORY_STEPS;
    } catch (e) {
      return DEFAULT_STORY_STEPS;
    }
  });

  const [studioInfo, setStudioInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('withinarts_info') || localStorage.getItem('withinart_info') || localStorage.getItem('rangrez_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name && (parsed.name.includes('Rangrez') || parsed.name.toLowerCase().includes('rangrez') || parsed.name === 'Withinart')) {
          parsed.name = DEFAULT_STUDIO_INFO.name;
        }
        if (parsed.email === 'msaadzia44@gmail.com' || !parsed.email) {
          parsed.email = DEFAULT_STUDIO_INFO.email;
        }
        if (parsed.whatsapp === '923007654321' || !parsed.whatsapp) {
          parsed.whatsapp = DEFAULT_STUDIO_INFO.whatsapp;
          parsed.phone = DEFAULT_STUDIO_INFO.phone;
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
      const saved = localStorage.getItem('withinarts_reviews') || localStorage.getItem('withinart_reviews') || localStorage.getItem('rangrez_reviews');
      return saved ? JSON.parse(saved) : DEFAULT_REVIEW_CARDS;
    } catch (e) {
      return DEFAULT_REVIEW_CARDS;
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('withinarts_cart') || localStorage.getItem('withinart_cart') || localStorage.getItem('rangrez_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save to localStorage whenever state changes with safe quota protection
  useEffect(() => {
    try {
      localStorage.setItem('withinarts_paintings', JSON.stringify(paintings));
    } catch (e) {
      console.warn("Could not save paintings to localStorage:", e);
    }
  }, [paintings]);

  useEffect(() => {
    try {
      localStorage.setItem('withinarts_story', JSON.stringify(storySteps));
    } catch (e) {
      console.warn("Could not save story to localStorage:", e);
    }
  }, [storySteps]);

  useEffect(() => {
    try {
      localStorage.setItem('withinarts_info', JSON.stringify(studioInfo));
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
      localStorage.setItem('withinarts_cart', JSON.stringify(lightweightCart));
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

  // Helper to create human-readable, SEO-friendly painting slugs (e.g. bismillah-royal-azure-painting-1)
  const getPaintingSlug = (p) => {
    if (!p) return '';
    const cleanTitle = (p.title || 'artwork')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${cleanTitle}-${p.id}`;
  };

  const getBasePath = () => {
    return window.location.pathname.startsWith('/withinarts') ? '/withinarts' : '';
  };

  // Comprehensive URL Router: Handles /painting/:slug, /cart, /gallery, /our-story, /reviews, /admin
  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash || '';
      const rawPath = decodeURIComponent(window.location.pathname || '');
      const search = window.location.search || '';
      const base = getBasePath();
      const path = rawPath.replace(base, '') || '/';

      // 1. Admin / Owner Portal
      const isAdminRequested =
        hash.includes(SECRET_ADMIN_KEY) ||
        rawPath.includes(SECRET_ADMIN_KEY) ||
        search.includes(SECRET_ADMIN_KEY) ||
        path.startsWith('/admin') ||
        hash.startsWith('#admin');

      if (isAdminRequested) {
        const isAuth = sessionStorage.getItem('withinarts_studio_session') === 'authenticated';
        if (isAuth) {
          setIsManagerOpen(true);
          setIsLoginModalOpen(false);
        } else {
          setIsLoginModalOpen(true);
        }
        return;
      }

      // 2. Painting Detail View (/painting/:slug or #painting/:slug)
      const paintingMatch = path.match(/^\/painting\/([^\/\?#]+)/) || hash.match(/^#\/?painting\/([^\/\?#]+)/);
      if (paintingMatch) {
        const param = paintingMatch[1].toLowerCase();
        const found = paintings.find((p) => {
          const fullSlug = getPaintingSlug(p).toLowerCase();
          return (
            p.id.toLowerCase() === param ||
            fullSlug === param ||
            param.endsWith(p.id.toLowerCase()) ||
            param.includes(p.id.toLowerCase()) ||
            (p.title && fullSlug.includes(param))
          );
        });

        if (found) {
          setSelectedPainting(found);
          document.title = `${found.title} | Withinarts Studio`;
          return;
        }
      }

      // If not on painting route, close detail view
      setSelectedPainting((prev) => (prev ? null : prev));

      // 3. Cart Drawer (/cart or #cart)
      if (path === '/cart' || hash === '#cart' || hash === '#/cart') {
        setIsCartOpen(true);
      } else {
        setIsCartOpen(false);
      }

      // 4. Section Smooth Scrolling with clean URLs
      if (path === '/gallery' || hash === '#gallery' || hash === '#/gallery') {
        setTimeout(() => galleryRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      } else if (path === '/our-story' || hash === '#our-story' || path === '/about' || hash === '#about') {
        setTimeout(() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' }), 100);
      } else if (path === '/reviews' || hash === '#reviews') {
        setTimeout(() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }), 100);
      } else if (path === '/' && !hash) {
        document.title = "Withinarts | Handcrafted Oil Paintings & Fine Art Studio";
      }
    };

    handleRoute();

    window.addEventListener('popstate', handleRoute);
    window.addEventListener('hashchange', handleRoute);

    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('hashchange', handleRoute);
    };
  }, [paintings]);

  // Clean Navigation Handlers that update URL and browser history
  const handleSelectPainting = (painting) => {
    if (!painting) return;
    setSelectedPainting(painting);
    const slug = getPaintingSlug(painting);
    const base = getBasePath();
    const targetUrl = `${base}/painting/${slug}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ type: 'painting', id: painting.id, slug }, `${painting.title} | Withinarts`, targetUrl);
    }
    document.title = `${painting.title} | Withinarts Studio`;
  };

  const handleBackFromDetail = () => {
    setSelectedPainting(null);
    const base = getBasePath();
    window.history.pushState({ type: 'home' }, "Withinarts", base + '/');
    document.title = "Withinarts | Handcrafted Oil Paintings & Fine Art Studio";
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
    const base = getBasePath();
    if (!window.location.pathname.endsWith('/cart')) {
      window.history.pushState({ type: 'cart' }, "Cart | Withinarts", base + '/cart');
    }
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
    const base = getBasePath();
    if (window.location.pathname.endsWith('/cart')) {
      const prev = selectedPainting ? `${base}/painting/${getPaintingSlug(selectedPainting)}` : (base + '/');
      window.history.replaceState({ type: selectedPainting ? 'painting' : 'home' }, "Withinarts", prev);
    }
  };

  const handleNavigateHome = () => {
    setSelectedPainting(null);
    setIsCartOpen(false);
    const base = getBasePath();
    window.history.pushState({ type: 'home' }, "Withinarts", base + '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = "Withinarts | Handcrafted Oil Paintings & Fine Art Studio";
  };

  const scrollToGallery = () => {
    if (selectedPainting) {
      setSelectedPainting(null);
    }
    const base = getBasePath();
    window.history.pushState({ type: 'section', section: 'gallery' }, "Collection | Withinarts", base + '/gallery');
    setTimeout(() => {
      galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const scrollToStory = () => {
    if (selectedPainting) {
      setSelectedPainting(null);
    }
    const base = getBasePath();
    window.history.pushState({ type: 'section', section: 'our-story' }, "Our Story | Withinarts", base + '/our-story');
    setTimeout(() => {
      document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const scrollToReviews = () => {
    if (selectedPainting) {
      setSelectedPainting(null);
    }
    const base = getBasePath();
    window.history.pushState({ type: 'section', section: 'reviews' }, "Reviews | Withinarts", base + '/reviews');
    setTimeout(() => {
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsManagerOpen(true);
    if (!window.location.hash.includes(SECRET_ADMIN_KEY)) {
      window.location.hash = SECRET_ADMIN_KEY;
    }
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    const base = getBasePath();
    window.history.replaceState(null, '', base + '/');
  };

  const handleOpenOwnerPortal = () => {
    const isAuth = sessionStorage.getItem('withinarts_studio_session') === 'authenticated';
    if (isAuth) {
      setIsManagerOpen(true);
      window.location.hash = SECRET_ADMIN_KEY;
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleCloseManager = () => {
    setIsManagerOpen(false);
    const base = getBasePath();
    window.history.replaceState(null, '', base + '/');
  };

  const handleLockPortal = () => {
    try {
      sessionStorage.removeItem('withinarts_studio_session');
    } catch (e) { }
    setIsManagerOpen(false);
    const base = getBasePath();
    window.history.replaceState(null, '', base + '/');
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
          onBack={handleBackFromDetail}
          onAddToCart={handleAddToCart}
          whatsappNumber={studioInfo.whatsapp}
          onSelectPainting={handleSelectPainting}
          allPaintings={paintings}
          cartCount={(Array.isArray(cart) ? cart : []).reduce((sum, item) => sum + (Number(item.qty) || 1), 0)}
          onOpenCart={handleOpenCart}
        />
        {/* Cart Slide-Over Drawer on Detail Page */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={handleCloseCart}
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Sticky / Decoupled Adaptive Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
        onOpenCart={handleOpenCart}
        studioInfo={studioInfo}
        onNavigateHome={handleNavigateHome}
        onNavigateGallery={scrollToGallery}
        onNavigateStory={scrollToStory}
        onNavigateReviews={scrollToReviews}
      />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* Clean, Non-Messy Hero Section with Natural Sky & Centerpiece Artwork */}
        <Hero
          studioInfo={studioInfo}
          onExploreClick={scrollToGallery}
          featuredPainting={paintings[0]}
          onSelectPainting={handleSelectPainting}
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
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${selectedCategory === cat
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
                  onSelect={handleSelectPainting}
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
