import React from 'react';
import { Palette, MapPin, Phone, MessageCircle, Heart, ShieldCheck, TreePine, PackageCheck } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { resolveAssetUrl } from '@/lib/utils';

export function Footer({ studioInfo, onOpenManager }) {
  return (
    <footer className="relative border-t-4 border-sky-400 bg-gradient-to-b from-slate-900 via-[#0f172a] to-[#1e1b4b] text-white pt-16 pb-12 overflow-hidden shadow-2xl">
      {/* Background colorful ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Origin */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={resolveAssetUrl('/images/logo.png')} alt="Withinart Logo" className="h-10 sm:h-12 w-auto object-contain drop-shadow-md" />
              <div>
                <span className="font-cinzel text-xl font-bold tracking-wider text-white block">
                  WITHINART
                </span>
                <span className="text-[11px] text-amber-400 font-medium">
                  Faisalabad Handmade Fine Art Studio
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              We are master painters from Faisalabad, Pakistan. Handcrafting bespoke oil paintings on seasoned solid Sheesham stretcher frames, packed in signature eco-friendly rustic jute cloth.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{studioInfo?.address || "D-Ground, Peoples Colony, Faisalabad, Pakistan"}</span>
            </div>
          </div>

          {/* Col 2: Studio Craft Pillars */}
          <div className="space-y-3">
            <h4 className="font-cinzel font-bold text-sm text-amber-300 tracking-wider uppercase">
              Craft Traditions
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                <span>Genuine Seasoned Rosewood (Sheesham)</span>
              </li>
              <li className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>3D Impasto Palette Knife Technique</span>
              </li>
              <li className="flex items-center gap-2">
                <PackageCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>Signature Eco-Friendly Jute Packaging</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Studio Certificate of Authenticity</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Inquiry & WhatsApp */}
          <div className="space-y-3">
            <h4 className="font-cinzel font-bold text-sm text-amber-300 tracking-wider uppercase">
              Bespoke Commissions
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have a specific room size or color scheme? Our Faisalabad artists accept custom commissioned paintings.
            </p>

            <a
              href={`https://wa.me/${studioInfo?.whatsapp || '923007654321'}?text=${encodeURIComponent("Hello! I would like to discuss a custom artwork commission with Withinart.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Chat with Studio Master</span>
            </a>
          </div>

          {/* Col 4: Studio Manager Access */}
          <div className="space-y-3">
            <h4 className="font-playfair font-bold text-sm text-amber-300 tracking-wider uppercase">
              Owner Portal
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Studio Management: Add new paintings, adjust prices, and customize story content.
            </p>

            <button
              onClick={onOpenManager}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-sky-500/20 hover:from-amber-500/30 hover:to-sky-500/30 border border-amber-400/40 text-xs font-bold text-amber-200 hover:text-white transition-all w-full text-center flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>⚙️ Open Owner Portal</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Withinart. All handmade paintings protected by copyright.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Hand-painted with pride in</span>
            <span className="text-amber-400 font-semibold">Faisalabad, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
