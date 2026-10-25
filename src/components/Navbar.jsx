import React, { useState, useEffect, useRef } from 'react';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';
import { ShoppingBag, Search, X, MessageCircle, MapPin } from 'lucide-react';
import { resolveAssetUrl } from '@/lib/utils';

export function Navbar({
  searchTerm,
  setSearchTerm,
  cartCount,
  onOpenCart,
  studioInfo
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      if (scrollPos > 60) {
        setIsScrolled(true);
      } else if (scrollPos < 25) {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSearch = () => {
    setIsSearchOpen(prev => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 150);
      }
      return next;
    });
  };

  return (
    <>
      {/* ── Top-Left: Brand Logo & Name Anchor (Clean, elegant, always accessible) ── */}
      <div className="fixed top-4 left-4 sm:left-6 z-50">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-2xl transition-all duration-300 group cursor-pointer ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-xl border border-sky-100 shadow-lg shadow-slate-900/10 hover:shadow-xl scale-95'
              : 'bg-white/90 backdrop-blur-md border border-white/80 shadow-md shadow-slate-900/5 hover:bg-white'
          }`}
          title="WithinArt Studio"
        >
          {/* Logo */}
          <img
            src={resolveAssetUrl('/images/logo.png')}
            alt="Withinart Logo"
            className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 shrink-0"
          />

          {/* Brand Name */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
              <span className="font-playfair text-base sm:text-lg md:text-xl font-bold tracking-wider text-slate-900 group-hover:text-sky-600 transition-colors">
                WITHIN
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold shadow-xs">
                Art
              </span>
            </div>
            <span className="hidden md:flex text-[10px] text-slate-500 items-center gap-0.5 font-medium whitespace-nowrap">
              <MapPin className="w-2.5 h-2.5 text-rose-500" />
              {studioInfo?.city || "Faisalabad, Pakistan"}
            </span>
          </div>
        </a>
      </div>

      {/* ── Top-Right: Search & Cart Controls Anchor ── */}
      <div className="fixed top-4 right-4 sm:right-6 z-50 flex items-center gap-2">
        {/* Expandable Search Input Button */}
        <div className="relative flex items-center">
          <div
            className={`flex items-center overflow-hidden transition-all duration-300 ease-out ${
              isSearchOpen
                ? 'w-48 xs:w-56 sm:w-72 px-3 py-1.5 bg-white/95 backdrop-blur-xl border border-sky-300 rounded-2xl shadow-xl shadow-slate-900/10'
                : 'w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl justify-center hover:bg-white hover:border-sky-400 shadow-md shadow-slate-900/5 hover:scale-105 active:scale-95'
            }`}
          >
            <button
              type="button"
              onClick={handleToggleSearch}
              className="text-slate-600 hover:text-sky-600 transition-colors shrink-0 cursor-pointer"
              title={isSearchOpen ? "Close Search" : "Open Search"}
            >
              <Search className="w-4 h-4" />
            </button>

            {isSearchOpen && (
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search paintings, calligraphy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ml-2 w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none font-medium"
              />
            )}

            {isSearchOpen && searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-0.5 text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {isSearchOpen && (
              <button
                onClick={() => setIsSearchOpen(false)}
                className="ml-1 text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Cart Drawer Trigger with LiquidMetalButton */}
        <div className="rounded-2xl shadow-md shadow-slate-900/5 hover:shadow-xl transition-shadow">
          <LiquidMetalButton
            label="Cart"
            icon={<ShoppingBag className="w-4 h-4 text-sky-400" />}
            badge={cartCount > 0 ? cartCount : undefined}
            onClick={onOpenCart}
            width={cartCount > 0 ? 108 : 92}
            height={40}
          />
        </div>
      </div>

      {/* ── Floating WhatsApp Action (Bottom-Right) ── */}
      <div className="fixed bottom-6 right-6 z-50">
        <LiquidMetalButton
          viewMode="icon"
          icon={<MessageCircle className="w-5 h-5 text-emerald-400" />}
          onClick={() => {
            window.open(
              `https://wa.me/${studioInfo?.whatsapp || '923007654321'}?text=${encodeURIComponent("Hello WithinArt! I would like to inquire about ordering a custom handmade painting.")}`,
              '_blank'
            );
          }}
          width={48}
          height={48}
        />
      </div>
    </>
  );
}
