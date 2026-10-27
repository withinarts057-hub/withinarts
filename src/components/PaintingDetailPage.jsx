import React, { useState, useEffect } from 'react';
import { Lens } from '@/components/ui/lens';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';
import {
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  ZoomIn,
  TreePine,
  Maximize2,
  PackageCheck,
  Sparkles,
  ShieldCheck,
  Check,
  Palette,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { resolveAssetUrl } from '@/lib/utils';

export function PaintingDetailPage({
  painting,
  onBack,
  onAddToCart,
  whatsappNumber,
  onSelectPainting,
  allPaintings,
  cartCount = 0,
  onOpenCart
}) {
  const [activeView, setActiveView] = useState('closeup'); // 'closeup' or 'wall'
  const [zoomFactor, setZoomFactor] = useState(2.6);
  const [isLensHovering, setIsLensHovering] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Scroll to top when this page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [painting?.id]);

  if (!painting) return null;

  const currentImg = resolveAssetUrl(activeView === 'closeup' ? painting.closeupImage : painting.wallImage);

  const handleAdd = () => {
    onAddToCart(painting);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const formattedPrice = (Number(painting.pricePKR) || 0).toLocaleString();
    const msg = `Hello Withinarts! I would like to order this original handmade artwork:\n\n*Artwork:* ${painting.title}\n*Stretcher Frame:* ${painting.woodFrame}\n*Dimensions:* ${painting.dimensions}\n*Price:* Rs. ${formattedPrice} (PKR)\n\n✍️ *Custom Name/Text I want on the painting:* ________\n_(Please type the name or text you'd like hand-painted on this artwork above)_\n\nPlease confirm delivery in your signature eco-friendly jute packaging to my address.`;
    window.open(`https://wa.me/${whatsappNumber || '923264784663'}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Other paintings for the bottom recommendations
  const otherPaintings = (allPaintings || [])
    .filter(p => p.id !== painting.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Header Bar for Dedicated Detail Page */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto relative flex items-center justify-between">
          {/* Back Button Only (Icon only, text removed) */}
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 hover:text-sky-600 transition-all active:scale-95 group shadow-xs cursor-pointer z-10"
            title="Back to Home"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Perfectly Centered Logo (Text removed, official logo in center, large & clear) */}
          <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={onBack}
              className="pointer-events-auto hover:opacity-90 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
              title="Withinarts"
            >
              <img
                src={resolveAssetUrl("/images/logo.png")}
                alt="Withinarts"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-sm"
              />
            </button>
          </div>

          {/* Quick Actions: Bag Trigger + WhatsApp */}
          <div className="flex items-center gap-2 z-10">
            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer relative"
                title="View Art Bag"
              >
                <ShoppingBag className="w-4 h-4 text-sky-600" />
                <span className="hidden sm:inline">Bag</span>
                {cartCount > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={handleWhatsAppOrder}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all cursor-pointer"
              title="Order via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex-1">
        {/* 1. Full-screen centerstage featured artwork display */}
        <section className="mb-10 flex flex-col items-center">
          {/* View Mode & Lens Zoom Switcher Bar */}
          <div className="w-full flex items-center justify-between mb-4 flex-wrap gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-sm w-full sm:w-auto">
              <button
                onClick={() => setActiveView('closeup')}
                className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeView === 'closeup'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Macro Closeup (Fine Texture Lens)</span>
                <span className="sm:hidden">Macro Brushstrokes</span>
              </button>
              <button
                onClick={() => setActiveView('wall')}
                className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${activeView === 'wall'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <span className="hidden sm:inline">Gallery Wall View</span>
                <span className="sm:hidden">Wall View</span>
              </button>
            </div>

            {/* Lens Zoom Level Selector */}
            {activeView === 'closeup' && (
              <div className="flex items-center gap-1.5 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                <span className="text-slate-500 font-medium text-[11px] sm:text-xs">Zoom:</span>
                {[1.8, 2.6, 3.4].map((z) => (
                  <button
                    key={z}
                    onClick={() => setZoomFactor(z)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${zoomFactor === z
                        ? 'bg-sky-100 text-sky-800'
                        : 'text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    {z}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Central Large Painting Canvas with Aceternity Lens (Square 1:1, Zero Cropping) */}
          <div
            className="relative w-full aspect-square max-w-2xl max-h-[75vh] mx-auto rounded-3xl overflow-hidden bg-white border-2 border-slate-200 shadow-2xl cursor-crosshair group flex items-center justify-center p-3 sm:p-6"
            onMouseEnter={() => setIsLensHovering(true)}
            onMouseLeave={() => setIsLensHovering(false)}
          >
            <Lens
              zoomFactor={zoomFactor}
              lensSize={230}
              hovering={isLensHovering && activeView === 'closeup'}
            >
              <div className="w-full h-full relative flex items-center justify-center bg-white">
                <img
                  src={currentImg}
                  alt={painting.title}
                  className="w-full h-full object-contain drop-shadow-md select-none"
                  draggable={false}
                />
              </div>
            </Lens>

            {/* Bottom Floating Hint Overlay */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between pointer-events-none z-20 gap-2">
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-medium flex items-center gap-1.5 sm:gap-2 shadow-lg truncate">
                <ZoomIn className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                {activeView === 'closeup' ? (
                  <>
                    <span className="hidden sm:inline">Move cursor over artwork to zoom into fine acrylic brushstrokes</span>
                    <span className="sm:hidden">Touch & drag across artwork to inspect texture</span>
                  </>
                ) : (
                  <span>Gallery Living Room Wall Display</span>
                )}
              </span>

              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 text-[11px] sm:text-xs font-bold shadow-lg shrink-0">
                {painting.dimensions}
              </span>
            </div>
          </div>

          {/* Thumbnail strip underneath */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setActiveView('closeup')}
              className={`relative w-24 h-16 rounded-2xl overflow-hidden border-2 transition-all ${activeView === 'closeup'
                  ? 'border-sky-500 shadow-md scale-105'
                  : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
            >
              <img src={resolveAssetUrl(painting.closeupImage)} alt="Closeup" className="w-full h-full object-cover" />
              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-center text-white font-bold py-0.5">
                Macro Closeup
              </span>
            </button>

            <button
              onClick={() => setActiveView('wall')}
              className={`relative w-24 h-16 rounded-2xl overflow-hidden border-2 transition-all ${activeView === 'wall'
                  ? 'border-sky-500 shadow-md scale-105'
                  : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
            >
              <img src={resolveAssetUrl(painting.wallImage)} alt="Wall view" className="w-full h-full object-cover" />
              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-center text-white font-bold py-0.5">
                Wall Display
              </span>
            </button>
          </div>
        </section>

        {/* 2. Artwork Title and Description */}
        <section className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-sm">
              {painting.badge || "Limited Edition"}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              In Stock (Faisalabad Studio)
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-sky-700">
              {painting.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-slate-900 mb-3 tracking-tight">
            {painting.title}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {painting.description || "100% authentic handmade acrylic painting crafted by master artists in Faisalabad, Pakistan."}
          </p>

          {/* Customizable artwork special badge banner */}
          {painting.isCustomizable && (
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 border border-purple-200 text-xs text-purple-950 font-medium flex flex-col sm:flex-row items-center justify-center gap-2 shadow-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[11px] shrink-0">
                ✍️ Customizable
              </span>
              <span>
                Aap is painting par apna <strong>Family Name, Couple Names, ya Special Date</strong> hand-paint karwa sakte hain! (Custom orders require 50% advance deposit).
              </span>
            </div>
          )}
        </section>

        {/* 3. Specifications and Craftsmanship */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 mb-10">
          <h2 className="text-lg font-playfair font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Complete Artwork Specifications & Craftsmanship</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Stretcher Frame Box */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <TreePine className="w-4 h-4 text-emerald-600" />
                <span>Handcrafted Stretcher Frame</span>
              </div>
              <p className="font-playfair font-bold text-slate-900 text-base">
                {painting.woodFrame}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Genuine seasoned Sheesham (rosewood) & treated hardwood frame, guaranteed warp-resistant for decades.
              </p>
            </div>

            {/* Inch / Size Box */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-2">
              <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                <Maximize2 className="w-4 h-4 text-sky-600" />
                <span>Size / Dimensions</span>
              </div>
              <p className="font-playfair font-bold text-slate-900 text-xl">
                {painting.dimensions}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard luxury gallery dimensions, ready to hang directly on your wall without any additional framing required.
              </p>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Original Art Price</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="font-playfair font-bold text-slate-900 text-2xl sm:text-3xl">
                  Rs. {(Number(painting.pricePKR) || 0).toLocaleString()}
                </p>
              </div>
              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Free Safe Shipping on Advance Orders Across Pakistan
              </p>
            </div>
          </div>

          {/* Additional Medium & Packaging Commitment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-8">
            <div className="flex items-start gap-2.5">
              <Palette className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900">Medium & Texture:</strong>
                <span>{painting.medium || "100% Heavy Impasto Acrylic on Natural Bark Wood Slice"}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <PackageCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900">Signature Eco-Friendly Jute Packaging:</strong>
                <span>Eco-friendly burlap jute wrap, authentic red wax seal, and reinforced wooden corner guards.</span>
              </div>
            </div>
          </div>

          {/* Action Purchase Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Add to Cart */}
            <button
              onClick={handleAdd}
              className="py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200/90 border border-slate-300 font-bold text-slate-900 text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-sky-600" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* WhatsApp Order Now */}
            <div className="flex items-center justify-center sm:justify-start">
              <LiquidMetalButton
                label="Order via WhatsApp"
                icon={<MessageCircle className="w-4 h-4 text-emerald-400" />}
                onClick={handleWhatsAppOrder}
                width={200}
                height={46}
              />
            </div>
          </div>
        </section>

        {/* 4. Return to Gallery Button */}
        <section className="text-center py-8 border-t border-slate-200">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-xl shadow-slate-900/10 active:scale-95 transition-all group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-sky-400 group-hover:-translate-x-1.5 transition-transform" />
            <span>← Return to Gallery Showcase</span>
          </button>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Click to explore our full collection of handmade acrylic paintings and heritage stories
          </p>
        </section>

        {/* 5. More Artworks from the Atelier */}
        {otherPaintings.length > 0 && (
          <section className="mt-10">
            <h3 className="font-playfair font-bold text-xl text-slate-900 mb-4">
              More Handcrafted Works from Faisalabad Atelier
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherPaintings.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectPainting(p)}
                  className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 cursor-pointer shadow-sm hover:shadow-md transition-all group"
                >
                  <img
                    src={p.wallImage}
                    alt={p.title}
                    className="w-full aspect-square rounded-xl object-contain bg-slate-50 p-1 mb-2 group-hover:scale-[1.02] transition-transform"
                  />
                  <h4 className="font-playfair font-bold text-slate-900 text-xs truncate">
                    {p.title}
                  </h4>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    Rs. {(Number(p.pricePKR) || 0).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
