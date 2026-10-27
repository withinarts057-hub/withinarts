import React, { useState } from 'react';
import { LinkPreview } from '@/components/ui/link-preview';
import { Sparkles, MapPin, TreePine, Paintbrush, PackageCheck, Eye, ArrowUpRight } from 'lucide-react';
import { resolveAssetUrl } from '@/lib/utils';

export function OurStorySection({ storySteps, studioInfo }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps = storySteps && storySteps.length >= 4 ? storySteps : [
    {
      id: "step-1",
      stepNumber: "01",
      label: "Studio & Origins",
      title: "Faisalabad Studio & Heritage",
      description: "Based in D-Ground, Faisalabad, our flagship atelier creates 100% handmade acrylic paintings. Every wood slice and canvas is meticulously crafted by resident master artists with authentic passion.",
      keyword: "Faisalabad Studio",
      image: "/images/faisalabad_art_studio.jpg",
      color: "sky"
    },
    {
      id: "step-2",
      stepNumber: "02",
      label: "Solid Wood Craft",
      title: "Genuine Seasoned Rosewood (Sheesham)",
      description: "A painting's foundation begins with solid timber. Our stretcher frames are hand-joined by Faisalabad's master carpenters using genuine seasoned Sheesham and kiln-dried Pine, guaranteeing lifetime warp resistance.",
      keyword: "Genuine Sheesham Wood",
      image: "/images/wood_frame_craft.jpg",
      color: "emerald"
    },
    {
      id: "step-3",
      stepNumber: "03",
      label: "Handmade Brushwork",
      title: "3D Palette Knife Impasto & Gold Foil",
      description: "Over seasoned natural wood slices, our artists sculpt acrylic colors with heavy palette knife impasto and gild genuine 24K gold leaf, creating radiant depth and brilliant light reflection.",
      keyword: "Live Palette Knife Craft",
      image: "/images/brush_painting_action.jpg",
      color: "rose"
    },
    {
      id: "step-4",
      stepNumber: "04",
      label: "Jute Packaging",
      title: "Signature Eco-Friendly Jute Packaging",
      description: "Replacing plastics with organic rustic jute burlap, every painting is protected with wooden corner guards, a studio wax seal stamp, and a Certificate of Authenticity.",
      keyword: "Signature Jute Packaging",
      image: "/images/jute_packaging_craft.jpg",
      color: "amber"
    }
  ];

  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <section id="our-story" className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-sky-200/40 blur-3xl pointer-events-none rounded-full -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-200/40 blur-3xl pointer-events-none rounded-full -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 border border-sky-300 text-sky-800 text-xs font-bold mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Our Atelier Heritage • Faisalabad Craftsmanship</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-slate-900 mb-4 tracking-tight">
          How Our Paintings Are Created
        </h2>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          We are master artisans based in Faisalabad, creating 100% original handmade fine art.
          Follow our 4-step artisan journey below to experience how each masterpiece is brought to life.
        </p>
      </div>

      {/* Editorial Narrative Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Continuous Luxury Narrative Flow (8 Columns on desktop, full width on mobile) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Chapter 1: Faisalabad Studio */}
          <div
            onMouseEnter={() => setActiveStepIndex(0)}
            onClick={() => setActiveStepIndex(0)}
            className={`p-6 sm:p-7 rounded-3xl transition-all duration-300 border cursor-pointer ${activeStepIndex === 0
                ? 'bg-white border-sky-300 shadow-xl shadow-sky-500/10'
                : 'bg-white/70 hover:bg-white border-slate-200/90 shadow-sm'
              }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-7 h-7 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">01</span>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Studio & Heritage</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-2">
              Our Faisalabad Art Atelier
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Our flagship art studio and office is located in D-Ground, Peoples Colony{' '}
              <LinkPreview
                isStatic={true}
                imageSrc={steps[0].image}
                className="inline-flex items-center gap-1 font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-0.5 rounded-lg border border-sky-200 decoration-sky-400 underline underline-offset-4 cursor-pointer transition-colors shadow-sm"
              >
                <span>[Faisalabad Studio]</span>
                <Eye className="w-3 h-3 text-sky-600" />
              </LinkPreview>{' '}
              in Faisalabad. We produce and curate 100% original hand-painted acrylic artworks, where every stroke is applied by our seasoned resident master artists.
            </p>

            {/* Embedded Mobile Visual (Shown on mobile, hidden on desktop where sticky preview is present) */}
            <div className="lg:hidden mt-5 rounded-2xl overflow-hidden border border-slate-200 aspect-[16/10] relative shadow-md">
              <img
                src={resolveAssetUrl(steps[0].image)}
                alt={steps[0].title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 font-bold text-[11px]">
                  Step 01 • Studio & Heritage
                </span>
                <span className="text-[11px] text-slate-200">D-Ground, Faisalabad</span>
              </div>
            </div>
          </div>

          {/* Chapter 2: Genuine Seasoned Rosewood Frame */}
          <div
            onMouseEnter={() => setActiveStepIndex(1)}
            onClick={() => setActiveStepIndex(1)}
            className={`p-6 sm:p-7 rounded-3xl transition-all duration-300 border cursor-pointer ${activeStepIndex === 1
                ? 'bg-white border-emerald-300 shadow-xl shadow-emerald-500/10'
                : 'bg-white/70 hover:bg-white border-slate-200/90 shadow-sm'
              }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">02</span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Seasoned Hardwood</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-2">
              Solid Handcrafted Wood Frames
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              A timeless painting begins with its wooden foundation. For our custom stretcher bars, we select{' '}
              <LinkPreview
                isStatic={true}
                imageSrc={resolveAssetUrl(steps[1].image)}
                className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-200 decoration-emerald-400 underline underline-offset-4 cursor-pointer transition-colors shadow-sm"
              >
                <span>[Genuine Sheesham Wood]</span>
                <TreePine className="w-3 h-3 text-emerald-600" />
              </LinkPreview>{' '}
              and kiln-dried Pine, hand-joined by Faisalabad's master carpenters to guarantee your canvas hangs perfectly square and warp-free for decades.
            </p>

            {/* Embedded Mobile Visual */}
            <div className="lg:hidden mt-5 rounded-2xl overflow-hidden border border-slate-200 aspect-[16/10] relative shadow-md">
              <img
                src={resolveAssetUrl(steps[1].image)}
                alt={steps[1].title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 font-bold text-[11px]">
                  Step 02 • Hardwood Carpentry
                </span>
                <span className="text-[11px] text-slate-200">Solid Sheesham Frame</span>
              </div>
            </div>
          </div>

          {/* Chapter 3: Live Palette Knife Impasto */}
          <div
            onMouseEnter={() => setActiveStepIndex(2)}
            onClick={() => setActiveStepIndex(2)}
            className={`p-6 sm:p-7 rounded-3xl transition-all duration-300 border cursor-pointer ${activeStepIndex === 2
                ? 'bg-white border-rose-300 shadow-xl shadow-rose-500/10'
                : 'bg-white/70 hover:bg-white border-slate-200/90 shadow-sm'
              }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-bold">03</span>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Master Painting</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-2">
              Palette Knife Impasto & 24K Gold Leaf Inlay
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Over our tightly stretched linen canvas, our artists use sculptured palette knives and natural sable brushes in{' '}
              <LinkPreview
                isStatic={true}
                imageSrc={resolveAssetUrl(steps[2].image)}
                className="inline-flex items-center gap-1 font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-0.5 rounded-lg border border-rose-200 decoration-rose-400 underline underline-offset-4 cursor-pointer transition-colors shadow-sm"
              >
                <span>[Live Palette Knife Craft]</span>
                <Paintbrush className="w-3 h-3 text-rose-600" />
              </LinkPreview>{' '}
              to apply rich 3D acrylic textures. Genuine 24K gold foil is meticulously inlaid into calligraphic script to radiate brilliantly under room lighting.
            </p>

            {/* Embedded Mobile Visual */}
            <div className="lg:hidden mt-5 rounded-2xl overflow-hidden border border-slate-200 aspect-[16/10] relative shadow-md">
              <img
                src={resolveAssetUrl(steps[2].image)}
                alt={steps[2].title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 font-bold text-[11px]">
                  Step 03 • Acrylic & 24K Gold Foil
                </span>
                <span className="text-[11px] text-slate-200">Heavy Impasto Technique</span>
              </div>
            </div>
          </div>

          {/* Chapter 4: Signature Jute Packaging */}
          <div
            onMouseEnter={() => setActiveStepIndex(3)}
            onClick={() => setActiveStepIndex(3)}
            className={`p-6 sm:p-7 rounded-3xl transition-all duration-300 border cursor-pointer ${activeStepIndex === 3
                ? 'bg-white border-amber-300 shadow-xl shadow-amber-500/10'
                : 'bg-white/70 hover:bg-white border-slate-200/90 shadow-sm'
              }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">04</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Packaging Tradition</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-2">
              Signature Eco-Friendly Jute Burlap Packaging
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              In place of synthetic plastic bubble wraps, our hallmark is{' '}
              <LinkPreview
                isStatic={true}
                imageSrc={resolveAssetUrl(steps[3].image)}
                className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-200 decoration-amber-400 underline underline-offset-4 cursor-pointer transition-colors shadow-sm"
              >
                <span>[Signature Jute Burlap]</span>
                <PackageCheck className="w-3 h-3 text-amber-600" />
              </LinkPreview>{' '}
              packaging. Thick organic jute fabric, solid corner guards, an authentic studio red wax seal, and a Certificate of Authenticity ensure pristine delivery across Pakistan and worldwide.
            </p>

            {/* Embedded Mobile Visual */}
            <div className="lg:hidden mt-5 rounded-2xl overflow-hidden border border-slate-200 aspect-[16/10] relative shadow-md">
              <img
                src={resolveAssetUrl(steps[3].image)}
                alt={steps[3].title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 font-bold text-[11px]">
                  Step 04 • Jute Packaging
                </span>
                <span className="text-[11px] text-slate-200">Wax Sealed Wrap</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Dynamic Photo Reveal (Desktop ONLY >= lg; on mobile each card above has its own visual) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-28">
          <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-2xl p-3 sm:p-4 transition-all duration-500">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={resolveAssetUrl(currentStep.image)}
                alt={currentStep.title}
                key={currentStep.image}
                className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Photo Caption Badge */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs font-medium z-10">
                <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 font-bold">
                  {currentStep.label}
                </span>
                <span className="text-[11px] text-slate-200">
                  Step {currentStep.stepNumber} of 04
                </span>
              </div>
            </div>

            <div className="p-4 pt-3 flex items-center justify-between">
              <div>
                <h4 className="font-playfair font-bold text-slate-900 text-base">
                  {currentStep.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Hover over any chapter on the left to inspect details
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
