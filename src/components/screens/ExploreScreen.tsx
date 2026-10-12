import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  Heart, 
  MapPin, 
  Compass, 
  Map as MapIcon, 
  Grid, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Stay, ScreenType } from '../../types';
import { CATEGORIES } from '../../data/mockStays';

interface ExploreScreenProps {
  stays: Stay[];
  selectedStay: Stay;
  onSelectStay: (stay: Stay) => void;
  onNavigate: (screen: ScreenType) => void;
  savedStayIds: string[];
  onToggleSave: (stayId: string) => void;
  onOpenSearch: () => void;
  onOpenFilter: () => void;
  currencySymbol: string;
  isCompact?: boolean;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  stays,
  selectedStay,
  onSelectStay,
  onNavigate,
  savedStayIds,
  onToggleSave,
  onOpenSearch,
  onOpenFilter,
  currencySymbol,
  isCompact = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Escapes');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMapPinStay, setSelectedMapPinStay] = useState<Stay | null>(stays[0] || null);
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});

  // Filter stays by category
  const filteredStays = stays.filter((stay) => {
    if (activeCategory === 'All Escapes') return true;
    return stay.category === activeCategory;
  });

  const handlePrevImage = (e: React.MouseEvent, stayId: string, total: number) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => {
      const current = prev[stayId] || 0;
      return { ...prev, [stayId]: (current - 1 + total) % total };
    });
  };

  const handleNextImage = (e: React.MouseEvent, stayId: string, total: number) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => {
      const current = prev[stayId] || 0;
      return { ...prev, [stayId]: (current + 1) % total };
    });
  };

  return (
    <div className="w-full pb-16 text-stone-900 bg-[#faf9f5]">
      
      {/* Search & Filter Header Strip */}
      <div className="sticky top-0 z-20 bg-[#faf9f5]/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-stone-200/60 shadow-xs">
        <div className="flex items-center gap-2">
          {/* Main Search Pill */}
          <button
            onClick={onOpenSearch}
            className="flex-1 flex items-center justify-between bg-white px-3.5 py-2.5 rounded-full border border-stone-300/80 shadow-xs hover:border-stone-400 hover:shadow-sm transition-all text-left"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Search className="w-4 h-4 text-stone-600 shrink-0" />
              <div className="truncate">
                <span className="text-xs font-semibold text-stone-900 block truncate">
                  Any Sanctuary
                </span>
                <span className="text-[11px] text-stone-500 block truncate">
                  Curated Dates · 2 Guests · World
                </span>
              </div>
            </div>
          </button>

          {/* Filter & View Mode Actions */}
          <button
            onClick={onOpenFilter}
            className="p-2.5 bg-white border border-stone-300/80 rounded-full text-stone-700 hover:bg-stone-50 transition-colors shrink-0 shadow-xs"
            title="Filter escapes"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
            className={`p-2.5 rounded-full border transition-all shrink-0 ${
              viewMode === 'map'
                ? 'bg-stone-900 text-stone-100 border-stone-900'
                : 'bg-white border-stone-300/80 text-stone-700 hover:bg-stone-50'
            }`}
            title={viewMode === 'grid' ? 'Show Map View' : 'Show Grid View'}
          >
            {viewMode === 'grid' ? <MapIcon className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
        </div>

        {/* Category Horizontal Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-stone-100 shadow-xs'
                    : 'bg-stone-200/60 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4">

        {/* Featured Architectural Hero Spotlight (Grid view only) */}
        {viewMode === 'grid' && activeCategory === 'All Escapes' && (
          <div 
            onClick={() => {
              onSelectStay(stays[0]);
              onNavigate('detail');
            }}
            className="mb-6 relative rounded-2xl overflow-hidden cursor-pointer group shadow-md border border-stone-200"
          >
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-900">
              <img
                src={stays[0].heroImage}
                alt={stays[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
            </div>

            {/* Floating Top Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-stone-950/80 backdrop-blur-md text-amber-300 text-[11px] font-medium px-2.5 py-1 rounded-full border border-stone-700">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Architectural Spotlight of the Month</span>
            </div>

            {/* Bottom Content Card */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[11px] tracking-widest uppercase text-stone-300 font-mono">
                {stays[0].architect.studio} · {stays[0].architect.yearBuilt}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                {stays[0].title}
              </h3>
              <p className="text-xs text-stone-300 line-clamp-1 mt-1">
                {stays[0].tagline}
              </p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/15">
                <div className="flex items-center gap-1.5 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{stays[0].rating}</span>
                  <span className="text-stone-300">({stays[0].reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-amber-300">
                  <span>{currencySymbol}{stays[0].pricePerNight}</span>
                  <span className="text-[11px] text-stone-300 font-normal">/ night</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              {activeCategory}
            </h2>
            <p className="text-xs text-stone-500">
              {filteredStays.length} architectural residences available
            </p>
          </div>
        </div>

        {/* MAP VIEW MODE */}
        {viewMode === 'map' ? (
          <div className="relative rounded-2xl overflow-hidden border border-stone-300 shadow-md h-[460px] sm:h-[520px] bg-stone-900">
            {/* Stylized Vector Map Canvas */}
            <div className="absolute inset-0 bg-[#e8e6df] overflow-hidden">
              {/* Map grid lines & contours */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#78716c_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Abstract Island / Topography Shapes */}
              <svg className="w-full h-full object-cover opacity-60" viewBox="0 0 600 500" fill="none">
                <path d="M50 120 C120 80, 200 130, 260 90 C340 50, 420 120, 500 110 C560 100, 580 180, 540 240 C500 300, 460 380, 380 410 C290 440, 220 380, 160 390 C90 400, 40 330, 30 250 C20 180, 20 140, 50 120 Z" fill="#dedbd2" stroke="#cfcac0" strokeWidth="2" />
                <path d="M120 180 C180 160, 240 200, 310 180 C370 160, 430 220, 400 280 C360 330, 280 340, 210 320 C150 300, 100 240, 120 180 Z" fill="#d3cebe" stroke="#c0baa8" strokeWidth="1.5" />
              </svg>

              {/* Stays Pins */}
              {filteredStays.map((stay, idx) => {
                const isSelected = selectedMapPinStay?.id === stay.id;
                // Pin positions across canvas
                const positions = [
                  { top: '32%', left: '42%' },
                  { top: '56%', left: '68%' },
                  { top: '24%', left: '72%' },
                  { top: '68%', left: '32%' },
                  { top: '44%', left: '22%' },
                  { top: '78%', left: '55%' },
                ];
                const pos = positions[idx % positions.length];

                return (
                  <button
                    key={stay.id}
                    onClick={() => setSelectedMapPinStay(stay)}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all ${
                      isSelected ? 'scale-110 z-20' : 'hover:scale-105'
                    }`}
                  >
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 border transition-colors ${
                      isSelected 
                        ? 'bg-stone-950 text-amber-300 border-amber-400 ring-2 ring-amber-400/30' 
                        : 'bg-white text-stone-900 border-stone-300 hover:bg-stone-50'
                    }`}>
                      <span>{currencySymbol}{stay.pricePerNight}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Stay Map Preview Card */}
            {selectedMapPinStay && (
              <div className="absolute bottom-4 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-stone-200 shadow-xl flex items-center gap-3">
                <img
                  src={selectedMapPinStay.heroImage}
                  alt={selectedMapPinStay.title}
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{selectedMapPinStay.rating} ({selectedMapPinStay.reviewCount})</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                    {selectedMapPinStay.title}
                  </h4>
                  <p className="text-xs text-stone-500 truncate">
                    {selectedMapPinStay.location}, {selectedMapPinStay.country}
                  </p>
                  <p className="text-xs font-semibold text-stone-900 mt-1">
                    {currencySymbol}{selectedMapPinStay.pricePerNight} <span className="font-normal text-stone-500">/ night</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    onSelectStay(selectedMapPinStay);
                    onNavigate('detail');
                  }}
                  className="px-3 py-2 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-lg shrink-0 shadow-xs"
                >
                  View Stay
                </button>
              </div>
            )}
          </div>
        ) : (
          /* GRID VIEW MODE */
          <div className={`grid gap-5 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {filteredStays.map((stay) => {
              const isSaved = savedStayIds.includes(stay.id);
              const imgIndex = activeImageIndexes[stay.id] || 0;
              const currentImage = stay.images[imgIndex] || stay.heroImage;

              return (
                <div
                  key={stay.id}
                  onClick={() => {
                    onSelectStay(stay);
                    onNavigate('detail');
                  }}
                  className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  {/* Image Carousel Container */}
                  <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={currentImage}
                      alt={stay.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />

                    {/* Image Carousel Navigation Controls */}
                    {stay.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => handlePrevImage(e, stay.id, stay.images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          title="Previous photo"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleNextImage(e, stay.id, stay.images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          title="Next photo"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Dot Indicators */}
                        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1">
                          {stay.images.map((_, i) => (
                            <span
                              key={i}
                              className={`h-1.5 rounded-full transition-all ${
                                i === imgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Wishlist Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(stay.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-xs transition-colors"
                      title={isSaved ? 'Remove from saved' : 'Save to wishlist'}
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform active:scale-125 ${
                          isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'
                        }`}
                      />
                    </button>

                    {/* Category pill on image */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-stone-900/70 backdrop-blur-xs text-[10px] font-medium text-stone-200">
                      {stay.category}
                    </div>
                  </div>

                  {/* Card Metadata & Typography */}
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between gap-1 text-[11px] text-stone-500">
                        <span className="truncate">{stay.location}, {stay.country}</span>
                        <div className="flex items-center gap-1 font-semibold text-stone-900 shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{stay.rating}</span>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-base text-stone-900 tracking-tight mt-1 line-clamp-1">
                        {stay.title}
                      </h3>

                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                        {stay.tagline}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-2">
                        <span>{stay.maxGuests} guests</span>
                        <span aria-hidden="true">·</span>
                        <span>{stay.bedrooms} bdrms</span>
                        <span aria-hidden="true">·</span>
                        <span>{stay.sqm} m²</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100">
                      <div className="text-sm font-bold text-stone-900">
                        {currencySymbol}{stay.pricePerNight} <span className="text-xs font-normal text-stone-500">night</span>
                      </div>
                      <span className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-0.5">
                        Reserve <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
