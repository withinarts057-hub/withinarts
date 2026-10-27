import React, { useState, useEffect } from 'react';
import { Lens } from '@/components/ui/lens';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { X, ZoomIn, ShoppingBag, MessageCircle, ShieldCheck, TreePine, PackageCheck, Sparkles, Check } from 'lucide-react';
import { resolveAssetUrl } from '@/lib/utils';

export function PaintingDetailModal({
  painting,
  onClose,
  onAddToCart,
  whatsappNumber
}) {
  const [activeTab, setActiveTab] = useState('closeup'); // 'closeup' or 'wall'
  const [zoomFactor, setZoomFactor] = useState(2.6);
  const [isLensHovering, setIsLensHovering] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!painting) return null;

  const handleAdd = () => {
    onAddToCart(painting);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    const msg = `Hello Withinarts! I want to order this painting:\n\n*Painting:* ${painting.title}\n*Medium:* ${painting.medium}\n*Dimensions:* ${painting.dimensions}\n*Frame Wood:* ${painting.woodFrame}\n*Price:* Rs. ${painting.pricePKR.toLocaleString()} (PKR)\n\nPlease confirm shipping in signature Jute packaging to my address.`;
    window.open(`https://wa.me/${whatsappNumber || '923264784663'}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const currentImg = resolveAssetUrl(activeTab === 'closeup' ? painting.closeupImage : painting.wallImage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col md:flex-row text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Interactive Media View with Aceternity Lens */}
        <div className="md:w-3/5 bg-slate-50 p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
          {/* Top Switcher & Lens Zoom Controls */}
          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-sm">
              <button
                onClick={() => setActiveTab('closeup')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'closeup'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Macro Closeup (Lens Active)</span>
              </button>
              <button
                onClick={() => setActiveTab('wall')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'wall'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Gallery Wall View</span>
              </button>
            </div>

            {/* Zoom Factor Selector */}
            {activeTab === 'closeup' && (
              <div className="flex items-center gap-1 text-[11px] bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
                <span className="text-slate-500 font-medium">Lens Zoom:</span>
                {[1.8, 2.5, 3.2].map((z) => (
                  <button
                    key={z}
                    onClick={() => setZoomFactor(z)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${zoomFactor === z ? 'bg-sky-100 text-sky-800' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    {z}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Canvas with Aceternity Lens */}
          <div
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 cursor-crosshair shadow-inner"
            onMouseEnter={() => setIsLensHovering(true)}
            onMouseLeave={() => setIsLensHovering(false)}
          >
            <Lens
              zoomFactor={zoomFactor}
              lensSize={210}
              hovering={isLensHovering}
            >
              <div className="w-full h-full relative">
                <img
                  src={currentImg}
                  alt={painting.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Lens>

            <div className="absolute bottom-3 left-3 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md border border-slate-200 text-[11px] text-slate-800 font-medium flex items-center gap-1.5 shadow-md">
                <ZoomIn className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden sm:inline">Hover mouse cursor to inspect brushwork texture</span>
                <span className="sm:hidden">Touch & drag to inspect brushwork texture</span>
              </span>
            </div>
          </div>

          {/* Quick thumbnails strip */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setActiveTab('wall')}
              className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${activeTab === 'wall' ? 'border-sky-500 shadow-md scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
            >
              <img src={painting.wallImage} alt="Wall view" className="w-full h-full object-cover" />
              <span className="absolute bottom-0 inset-x-0 bg-white/90 text-[9px] text-center text-slate-800 font-bold py-0.5">Wall</span>
            </button>

            <button
              onClick={() => setActiveTab('closeup')}
              className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${activeTab === 'closeup' ? 'border-sky-500 shadow-md scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
            >
              <img src={painting.closeupImage} alt="Close up" className="w-full h-full object-cover" />
              <span className="absolute bottom-0 inset-x-0 bg-white/90 text-[9px] text-center text-slate-800 font-bold py-0.5">Closeup</span>
            </button>

            <div className="text-xs text-slate-500 pl-2">
              <span className="block text-slate-900 font-bold">Studio Authentication</span>
              <span>100% Original Acrylic on Wood Slice</span>
            </div>
          </div>
        </div>

        {/* Right: Painting Specs, Artisan Wood & Purchase */}
        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                {painting.badge || "Original Painting"}
              </span>
              <span className="text-xs text-sky-700 font-bold uppercase tracking-wider">
                {painting.category}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-slate-900 mb-3">
              {painting.title}
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              {painting.description}
            </p>

            {/* Authentic Wood & Craft Specs Box */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-6 text-xs">
              <div className="flex items-start gap-2.5">
                <TreePine className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Stretcher Frame:</span>
                  <p className="text-slate-600">{painting.woodFrame}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Medium & Texture:</span>
                  <p className="text-slate-600">{painting.medium}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <PackageCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Signature Packaging:</span>
                  <p className="text-slate-600">Eco-friendly jute burlap wrap, wax seal stamp, wooden corner guards</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-xs text-slate-500 block font-normal">Original Piece Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                    Rs. {painting.pricePKR.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    (~${painting.priceUSD} USD)
                  </span>
                </div>
              </div>
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Free Safe Delivery
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleAdd}
                className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 font-semibold text-sm text-slate-800 flex items-center justify-center gap-2 transition-all"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-sky-600" />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>

              <button onClick={handleWhatsApp} className="w-full">
                <LiquidGlass
                  radius={16}
                  bevelDepth={12}
                  scale={35}
                  aberration={3}
                  frost={0.25}
                  tint={0.1}
                  className="w-full py-3 px-4 border border-emerald-400 hover:border-emerald-500 transition-all cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>Order Now via WhatsApp</span>
                </LiquidGlass>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
