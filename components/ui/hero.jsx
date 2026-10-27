"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { MeshGradient } from "@paper-design/shaders-react";
import { Sparkles, ArrowDown, MessageCircle, Paintbrush, TreePine, PackageCheck, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reuno-UI Paper Shaders Hero Section
 * Features:
 * - Full 100vh Viewport Screen
 * - Living Fluid Gradients (Organic Waves + WebGL MeshGradient)
 * - Crystal clear, solid, legible typography
 * - Cleaned layout with zero double-headers or spinning stamps
 */
export default function ShaderShowcase({
  studioInfo,
  onExploreClick,
  className,
  isWhiteTheme = true,
}) {
  const containerRef = useRef(null);

  // Vibrant, rich art colors that contrast beautifully against a white paper canvas
  const meshColors = isWhiteTheme
    ? ["#ffffff", "#0284c7", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#ffffff"]
    : ["#000000", "#06b6d4", "#0891b2", "#164e63", "#f97316"];

  const wireframeColors = isWhiteTheme
    ? ["#0284c7", "#f59e0b", "#ec4899", "#8b5cf6", "#38bdf8"]
    : ["#000000", "#ffffff", "#06b6d4", "#f97316"];

  const handleWhatsApp = () => {
    const phone = studioInfo?.whatsapp || "923264784663";
    const text = encodeURIComponent("Hello WithinArts! I am interested in custom artwork from your studio.");
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-[100dvh] min-h-[100dvh] w-full max-w-full overflow-hidden flex flex-col justify-between pt-16 sm:pt-24 pb-4 sm:pb-8",
        isWhiteTheme ? "bg-white text-slate-900" : "bg-black text-white",
        className
      )}
    >
      {/* ── Background: Active Moving Gradients (Living Organic Waves + WebGL MeshGradient covering 100% full screen) ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden [contain:paint] [clip-path:inset(0)]">
        {/* Living Flowing Organic Gradients Layer (Dynamic continuous fluid motion) */}
        <div className="absolute inset-0 w-full h-full opacity-70 overflow-hidden [contain:paint] [clip-path:inset(0)]">
          {/* Top-Left Azure / Cyan Flowing Wave */}
          <motion.div
            className="absolute -top-20 -left-20 sm:-top-1/4 sm:-left-1/4 w-[90vw] sm:w-[75vw] max-w-[500px] h-[90vw] sm:h-[75vw] max-h-[500px] rounded-full bg-gradient-to-tr from-sky-400/50 via-cyan-300/45 to-blue-500/30 blur-3xl"
            animate={{
              x: [0, 45, -25, 0],
              y: [0, 35, -20, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: 16,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Top-Right Warm Amber / Saffron Sun Swirl */}
          <motion.div
            className="absolute -top-10 -right-16 sm:top-1/4 sm:-right-1/4 w-[80vw] sm:w-[65vw] max-w-[450px] h-[80vw] sm:h-[65vw] max-h-[450px] rounded-full bg-gradient-to-bl from-amber-400/50 via-yellow-300/40 to-orange-400/30 blur-3xl"
            animate={{
              x: [0, -45, 20, 0],
              y: [0, -35, 25, 0],
              scale: [1, 1.12, 0.92, 1],
            }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          {/* Bottom Rose Quartz & Magenta Wave */}
          <motion.div
            className="absolute -bottom-20 left-1/4 w-[85vw] sm:w-[70vw] max-w-[460px] h-[85vw] sm:h-[70vw] max-h-[460px] rounded-full bg-gradient-to-t from-rose-400/45 via-pink-300/35 to-purple-400/30 blur-3xl"
            animate={{
              x: [0, 35, -35, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.08, 0.95, 1],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 4,
            }}
          />

          {/* Ethereal Violet Center Ripple */}
          <motion.div
            className="absolute top-1/3 left-1/4 w-[60vw] sm:w-[50vw] max-w-[360px] h-[60vw] sm:h-[50vw] max-h-[360px] rounded-full bg-gradient-to-r from-violet-400/35 via-indigo-300/30 to-teal-300/30 blur-3xl"
            animate={{
              x: [0, -25, 30, 0],
              y: [0, 30, -25, 0],
              scale: [0.95, 1.12, 0.95],
            }}
            transition={{
              duration: 14,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Base WebGL MeshGradient (High speed, dynamic distortion & swirl) */}
        <MeshGradient
          className="absolute inset-0 w-full h-full mix-blend-multiply opacity-80"
          colors={meshColors}
          speed={1.2}
          distortion={1.3}
          swirl={0.8}
          backgroundColor={isWhiteTheme ? "#ffffff" : "#000000"}
        />

        {/* Secondary Wireframe MeshGradient (Active undulating 3D lines) */}
        <MeshGradient
          className={cn(
            "absolute inset-0 w-full h-full",
            isWhiteTheme ? "opacity-30 mix-blend-multiply" : "opacity-60"
          )}
          colors={wireframeColors}
          speed={0.9}
          distortion={1.1}
          swirl={0.6}
          wireframe="true"
          backgroundColor="transparent"
        />

        {/* Subtle, breathable central vignette so text stays razor sharp */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            isWhiteTheme
              ? "bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.05)_60%,rgba(255,255,255,0.65)_100%)]"
              : "bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.8)_100%)]"
          )}
        />

        {/* Bottom smooth fade into next catalog section */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-16 sm:h-24 pointer-events-none",
            isWhiteTheme
              ? "bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/60 to-transparent"
              : "bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent"
          )}
        />
      </div>

      {/* Top spacer to ensure clear clearance below floating navbar */}
      <div className="w-full shrink-0 h-4 sm:h-8" />

      {/* ── Main Hero Content (Vertically Centered in Fullscreen) ── */}
      <main className="relative z-20 max-w-5xl w-full mx-auto px-3 sm:px-6 my-auto text-center flex flex-col items-center justify-center shrink-0">
        {/* Announcement Pill */}
        <motion.div
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-amber-200/90 bg-white/95 shadow-sm backdrop-blur-md mb-2 sm:mb-4 max-w-[95vw] mx-auto"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-500 shrink-0 animate-pulse" />
          <span className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-semibold tracking-wide text-slate-800 leading-tight">
            Faisalabad Art Atelier • 100% Original Hand-Painted Works
          </span>
        </motion.div>

        {/* Main Headline — Solid, Crisp, Balanced across screen sizes */}
        <motion.h1
          className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-cinzel font-extrabold tracking-tight text-slate-900 mb-2 sm:mb-4 leading-[1.08] max-w-full px-1"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {/* Ethereal Handmade */}
          <span className="block font-cinzel font-bold text-base xs:text-lg sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.08em] sm:tracking-[0.16em] text-slate-900 mb-0.5 uppercase drop-shadow-xs break-words">
            Ethereal Handmade
          </span>

          <span className="block font-black text-2xl xs:text-3xl sm:text-5xl md:text-6xl text-slate-950 drop-shadow-xs">
            Art Atelier
          </span>

          <span className="block font-serif font-light italic text-amber-800 text-lg xs:text-2xl sm:text-4xl md:text-5xl mt-0.5">
            Crafted in Faisalabad
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-[11px] xs:text-xs sm:text-base md:text-lg font-normal text-slate-700 max-w-xl mx-auto mb-2.5 sm:mb-5 leading-relaxed px-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {studioInfo?.tagline || "Authentic handmade oil paintings, Sufi art, and sacred Arabic calligraphy."}{" "}
          Every piece is stretched on{" "}
          <strong className="text-amber-900 font-bold bg-amber-100/90 px-1 sm:px-1.5 py-0.5 rounded-md shadow-xs">
            solid seasoned rosewood
          </strong>{" "}
          and shipped in our signature{" "}
          <strong className="text-amber-900 font-bold bg-amber-100/90 px-1 sm:px-1.5 py-0.5 rounded-md shadow-xs">
            eco-friendly jute fabric
          </strong>{" "}
          across Pakistan and worldwide.
        </motion.p>

        {/* Atelier USPs Badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 w-full max-w-2xl mb-3 sm:mb-5 px-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/90 border border-amber-200/70 backdrop-blur-md shadow-xs hover:border-emerald-400 transition-all">
            <TreePine className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 text-emerald-600 shrink-0" />
            <span className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-slate-800">
              Seasoned Rosewood Stretcher
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/90 border border-amber-200/70 backdrop-blur-md shadow-xs hover:border-amber-400 transition-all">
            <Paintbrush className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 text-amber-600 shrink-0" />
            <span className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-slate-800">
              Heavy 3D Palette Knife Impasto
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/90 border border-amber-200/70 backdrop-blur-md shadow-xs hover:border-rose-400 transition-all">
            <PackageCheck className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 text-rose-600 shrink-0" />
            <span className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-slate-800">
              Signature Eco Jute Packaging
            </span>
          </div>
        </motion.div>

        {/* Action CTA Buttons — Sleek side-by-side or compact stack */}
        <motion.div
          className="flex items-center justify-center gap-2 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto mt-2 sm:mt-6 px-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <motion.button
            onClick={onExploreClick}
            className="flex-1 sm:flex-initial px-4 sm:px-8 py-2.5 sm:py-3 rounded-full bg-slate-900 text-white font-semibold text-[11px] sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 shadow-xl hover:bg-slate-800 transition-all cursor-pointer border border-slate-700 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <span>Explore Collection</span>
            <ArrowDown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          </motion.button>

          <motion.button
            onClick={handleWhatsApp}
            className="flex-1 sm:flex-initial px-4 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white/95 text-slate-800 font-semibold text-[11px] sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 border border-amber-300/80 shadow-md hover:bg-white hover:border-emerald-500 transition-all cursor-pointer backdrop-blur-md hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>WhatsApp Order</span>
          </motion.button>
        </motion.div>
      </main>

      {/* ── Bottom Section: Floating Scroll Prompt (Centered, No Spinning Stamp) ── */}
      <div className="relative z-20 w-full px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-center shrink-0 pointer-events-auto">
        <motion.button
          onClick={onExploreClick}
          className="flex flex-col items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors group cursor-pointer py-1"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <span className="text-[11px] sm:text-xs tracking-wider uppercase text-slate-500 group-hover:text-slate-800 transition-colors">
            Scroll to explore collection
          </span>
          <div className="w-7 h-7 rounded-full border border-slate-300 group-hover:border-slate-700 flex items-center justify-center transition-colors bg-white/90 shadow-xs backdrop-blur-xs">
            <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-slate-900" />
          </div>
        </motion.button>
      </div>
    </div>
  );
}

export { ShaderShowcase };
