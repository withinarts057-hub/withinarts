import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Star, Sparkles, MapPin, CheckCircle, Quote, ChevronLeft, ChevronRight, ArrowLeftRight } from 'lucide-react';

export function ReviewsSection({ reviewCards }) {
  const reviews = reviewCards && reviewCards.length > 0 ? reviewCards : [
    {
      title: "Dr. Tariq Jamil",
      city: "DHA Phase 6, Lahore",
      rating: 5,
      artPurchased: "Bismillah Royal Azure & Gold Leaf",
      description:
        "“The painting on my living room wall is sheer perfection. When you stand close, the gold leaf and thick knife strokes look like an ancient illuminated manuscript. The jute cloth packaging with wax seal was such a royal touch!”"
    },
    {
      title: "Ayesha Bilgrami",
      city: "Clifton, Karachi",
      rating: 5,
      artPurchased: "Sufi Whirling Ecstasy",
      description:
        "“Faisalabad artisans have truly outdone themselves! The solid Sheesham frame is robust and perfectly square. The whirling dervish glowing golden halo radiates peace throughout our prayer room.”"
    },
    {
      title: "Hamza Farooq",
      city: "F-7/2, Islamabad",
      rating: 5,
      artPurchased: "Hunza Valley Peaks",
      description:
        "“Ordered two large pieces. The palette knife impasto texture on the snow peaks is unbelievable—you can feel the raised mountain ridges with your fingertips. Zero plastic, 100% authentic jute wrap!”"
    },
    {
      title: "Malik Shahbaz",
      city: "Kohinoor City, Faisalabad",
      rating: 5,
      artPurchased: "Ayat-ul-Kursi Emerald",
      description:
        "“Being from Faisalabad myself, I was so proud to see such world-class oil paintings coming from our home city. Visited their D-Ground studio and saw the hand-carving and painting in person!”"
    },
    {
      title: "Zainab Al-Maktoum",
      city: "Downtown Dubai, UAE",
      rating: 5,
      artPurchased: "Bismillah Gold & Lapiz",
      description:
        "“Delivered via DHL all the way from Faisalabad to Dubai in impeccable condition. The jute packaging preserved the fragile oil paint layers completely intact. Truly museum grade craftsmanship.”"
    }
  ];

  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Helper for collector initials
  const getInitials = (name) => {
    if (!name) return 'RC';
    const clean = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '');
    const parts = clean.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  // Avatar gradient styles
  const avatarGradients = [
    'from-amber-500 to-amber-700 text-amber-50',
    'from-sky-500 to-blue-700 text-sky-50',
    'from-emerald-500 to-teal-700 text-emerald-50',
    'from-purple-500 to-indigo-700 text-purple-50',
    'from-rose-500 to-red-700 text-rose-50'
  ];

  // Update active index based on scroll position
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.querySelector('.review-card');
    if (!card) return;
    const cardWidth = card.offsetWidth;
    const gap = 24; // gap-6 = 24px
    const index = Math.round(container.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(Math.max(index, 0), reviews.length - 1));
  }, [reviews.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Scroll to a specific card index
  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.querySelector('.review-card');
    if (!card) return;
    const cardWidth = card.offsetWidth;
    const gap = 24;
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth'
    });
  };

  const handlePrev = () => {
    scrollToIndex(Math.max(activeIndex - 1, 0));
  };

  const handleNext = () => {
    scrollToIndex(Math.min(activeIndex + 1, reviews.length - 1));
  };

  // Mouse drag handlers for desktop swipe
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.4;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section id="reviews" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Background Subtle Colorful Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-sky-200/40 via-amber-200/40 to-rose-200/40 blur-3xl pointer-events-none rounded-full -z-10" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Verified Collectors • Authentic Experiences</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-slate-900 mb-2 tracking-tight">
            Customer & Collector Reviews
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Read authentic impressions from collectors who acquired original oil pieces from our Faisalabad atelier.
          </p>
        </div>

        {/* Swipe Hint & Navigation Arrow Buttons */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-600 shadow-sm">
            <ArrowLeftRight className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-medium">Swipe left / right</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Previous review"
              className="w-11 h-11 rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-sky-600 transition-all hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex === reviews.length - 1}
              aria-label="Next review"
              className="w-11 h-11 rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-sky-600 transition-all hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* SWIPEABLE / DRAGGABLE REVIEW CARDS CAROUSEL */}
      <div className="relative mb-6">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 pt-2 px-1 select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {reviews.map((rev, idx) => {
            const gradient = avatarGradients[idx % avatarGradients.length];
            const isCurrent = activeIndex === idx;

            return (
              <div
                key={idx}
                className={`review-card snap-center shrink-0 w-[86vw] max-w-sm sm:max-w-none sm:w-[420px] md:w-[450px] flex flex-col justify-between p-5 sm:p-7 rounded-3xl bg-white border overflow-hidden transition-all duration-300 ${
                  isCurrent
                    ? 'border-sky-400 shadow-xl shadow-sky-500/10 ring-2 ring-sky-100'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-md hover:shadow-lg'
                }`}
              >
                <div>
                  {/* Card Header: 5 Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-1.5">5.0</span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                      <Quote className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 font-medium italic min-h-[60px] sm:min-h-[80px] break-words">
                    {rev.description}
                  </p>
                </div>

                {/* Collector Identity & Art Info Footer */}
                <div className="pt-3.5 sm:pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Collector Monogram Avatar */}
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradient} font-bold text-xs flex items-center justify-center shadow-sm shrink-0`}>
                      {getInitials(rev.title)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4 className="font-playfair font-bold text-slate-900 text-sm sm:text-base truncate">
                          {rev.title}
                        </h4>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Collector" />
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5 min-w-0">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{rev.city}</span>
                      </div>
                    </div>
                  </div>

                  {rev.artPurchased && (
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100/70 min-w-0">
                      <span className="text-[10px] text-slate-400 font-normal shrink-0">Artwork:</span>
                      <span
                        className="text-[10px] sm:text-[11px] font-semibold text-sky-700 max-w-[210px] sm:max-w-[130px] truncate block bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100"
                        title={rev.artPurchased}
                      >
                        {rev.artPurchased}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Guidance Hint */}
        <div className="sm:hidden flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium my-2">
          <ArrowLeftRight className="w-3 h-3 text-sky-600" />
          <span>Swipe left or right to explore more reviews</span>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-8 bg-sky-600 shadow-sm shadow-sky-600/30'
                  : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Trust Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center hover:border-amber-400 hover:shadow-md transition-all">
          <div className="font-playfair text-2xl sm:text-3xl font-bold text-amber-600 mb-1">450+</div>
          <div className="text-xs text-slate-600 font-medium">Original Paintings Delivered</div>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center hover:border-emerald-400 hover:shadow-md transition-all">
          <div className="font-playfair text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">4.9 / 5.0</div>
          <div className="text-xs text-slate-600 font-medium">Collector Satisfaction Rate</div>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center hover:border-rose-400 hover:shadow-md transition-all">
          <div className="font-playfair text-2xl sm:text-3xl font-bold text-rose-600 mb-1">100%</div>
          <div className="text-xs text-slate-600 font-medium">Solid Sheesham Wood Frames</div>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center hover:border-sky-400 hover:shadow-md transition-all">
          <div className="font-playfair text-2xl sm:text-3xl font-bold text-sky-600 mb-1">Eco Jute</div>
          <div className="text-xs text-slate-600 font-medium">Wax-Sealed Fabric Packaging</div>
        </div>
      </div>
    </section>
  );
}
