import React, { useState } from 'react';
import { Lens } from '@/components/ui/lens';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';
import { ShoppingBag, MessageCircle, Sparkles, Check, Flame, Award, ZoomIn, ArrowRight } from 'lucide-react';
import { resolveAssetUrl } from '@/lib/utils';

export function PaintingCard({
  painting,
  onSelect,
  onAddToCart,
  whatsappNumber
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [viewMode, setViewMode] = useState('auto'); // 'auto', 'wall', or 'closeup'
  const [addedAnimation, setAddedAnimation] = useState(false);

  const showCloseup = viewMode === 'closeup' || (viewMode === 'auto' && isHovered);
  const currentImage = resolveAssetUrl(showCloseup ? painting.closeupImage : painting.wallImage);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(painting);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1600);
  };

  const handleWhatsAppOrder = (e) => {
    e.stopPropagation();
    const msg = `Hello Withinarts! I would like to order this original handmade painting:\n\n*Artwork:* ${painting.title}\n*Price:* Rs. ${painting.pricePKR.toLocaleString()} (PKR)\n\n✍️ *Custom Name/Text I want on the painting:* ________\n_(Please type the name or text you'd like hand-painted on this artwork above)_\n\nPlease confirm availability and delivery in your signature eco-friendly jute packaging.`;
    window.open(`https://wa.me/${whatsappNumber || '923264784663'}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const getBadgeStyle = (badge) => {
    switch (badge?.toLowerCase()) {
      case 'limited edition':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold';
      case 'hot item':
        return 'bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold animate-pulse';
      case 'masterpiece':
        return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold';
      default:
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold';
    }
  };

  return (
    <div
      onClick={() => onSelect(painting)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-200 hover:border-sky-400 shadow-md hover:shadow-2xl hover:shadow-sky-500/15 transition-all duration-300 cursor-pointer"
    >
      {/* Top Media Container with Aceternity Lens (1:1 Aspect Ratio, Zero Cropping) */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 flex items-center justify-center p-2.5">
        <Lens
          zoomFactor={2.4}
          lensSize={190}
          hovering={showCloseup && isHovered}
        >
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
            <img
              src={currentImage}
              alt={painting.title}
              className="w-full h-full object-contain transition-all duration-500 ease-out group-hover:scale-105 drop-shadow-sm"
              loading="lazy"
            />
          </div>
        </Lens>

        {/* Top Badges: Limited Edition & In Stock directly on home page */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-30 pointer-events-auto">
          {/* Limited Edition badge */}
          <span className={`px-2.5 py-1 rounded-full text-[11px] shadow-md flex items-center gap-1.5 ${getBadgeStyle(painting.badge || 'Limited Edition')}`}>
            {painting.badge?.toLowerCase().includes('hot') ? (
              <Flame className="w-3 h-3 fill-current" />
            ) : painting.badge?.toLowerCase().includes('master') ? (
              <Award className="w-3 h-3" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            <span>{painting.badge || "Limited Edition"}</span>
          </span>

          {/* In Stock Badge */}
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600/95 text-white shadow-md flex items-center gap-1.5 backdrop-blur-sm border border-emerald-400/40">
            <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
            <span>In Stock</span>
          </span>
        </div>

        {/* Subtle Lens / Wall Toggle in Bottom-Right — Only on Laptop/Desktop, hidden on Phone */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="hidden sm:flex absolute bottom-2 right-2 items-center gap-1 p-0.5 rounded-lg bg-black/50 backdrop-blur-md text-[10px] text-white z-20"
        >
          <button
            onClick={() => setViewMode('wall')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${!showCloseup ? 'bg-sky-500 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            Wall
          </button>
          <button
            onClick={() => setViewMode('closeup')}
            className={`px-2 py-0.5 rounded flex items-center gap-1 font-medium transition-colors ${showCloseup ? 'bg-sky-500 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            <ZoomIn className="w-2.5 h-2.5" />
            <span>Lens</span>
          </button>
        </div>
      </div>

      {/* Card Info Section - Clean & Uncluttered: ONLY Name, Price, and Actions */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="text-base sm:text-lg font-cinzel font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1 mb-1.5">
            {painting.title}
          </h3>

          <div className="flex items-baseline justify-between mb-4">
            <span className="text-lg sm:text-xl font-bold font-heading text-slate-900">
              Rs. {painting.pricePKR.toLocaleString()}
            </span>
            <span className="text-xs text-sky-600 font-semibold group-hover:underline flex items-center gap-1">
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
          {/* Add To Cart */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/90 border border-slate-200 text-xs font-semibold text-slate-800 transition-all duration-200 cursor-pointer"
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-sky-600" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* Order Now (WhatsApp) */}
          <div className="flex items-center justify-end">
            <LiquidMetalButton
              label="Order Now"
              icon={<MessageCircle className="w-3.5 h-3.5 text-emerald-400" />}
              onClick={handleWhatsAppOrder}
              width={125}
              height={40}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
