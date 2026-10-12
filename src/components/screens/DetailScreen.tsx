import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  Star, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Maximize2, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Check, 
  Plus, 
  Minus,
  CheckCircle2,
  ChevronRight,
  Flame,
  Wifi,
  Utensils,
  Volume2,
  Zap,
  Waves,
  Eye,
  Sun,
  Wine
} from 'lucide-react';
import { Stay, ScreenType } from '../../types';

interface DetailScreenProps {
  stay: Stay;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  isSaved: boolean;
  onToggleSave: (stayId: string) => void;
  currencySymbol: string;
  onStartCheckout: (bookingData: {
    stay: Stay;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    addons: { id: string; name: string; price: number }[];
    totalPrice: number;
    nightsCount: number;
  }) => void;
  onOpenGallery: () => void;
}

export const DetailScreen: React.FC<DetailScreenProps> = ({
  stay,
  onBack,
  onNavigate,
  isSaved,
  onToggleSave,
  currencySymbol,
  onStartCheckout,
  onOpenGallery,
}) => {
  // Booking state
  const [checkIn, setCheckIn] = useState('2026-11-14');
  const [checkOut, setCheckOut] = useState('2026-11-18');
  const [guestsCount, setGuestsCount] = useState(2);
  const [copiedLink, setCopiedLink] = useState(false);

  // Experience Addons
  const availableAddons = [
    { id: 'tea-ceremony', name: 'Private Architecture & Tea Ceremony', price: 140 },
    { id: 'sommelier', name: 'Curated Natural Wine & Local Tasting', price: 95 },
    { id: 'sauna-ritual', name: 'Private Hinoki Sauna & Cold Plunge Session', price: 75 },
  ];
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(['tea-ceremony']);

  // Date calculation
  const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)) || 4);
  const baseRate = stay.pricePerNight * nights;
  const cleaning = stay.cleaningFee;
  const serviceFee = Math.round(baseRate * stay.serviceFeeRate);
  
  const chosenAddons = availableAddons.filter((a) => selectedAddonIds.includes(a.id));
  const addonsTotal = chosenAddons.reduce((sum, a) => sum + a.price, 0);
  const grandTotal = baseRate + cleaning + serviceFee + addonsTotal;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleAddon = (id: string) => {
    if (selectedAddonIds.includes(id)) {
      setSelectedAddonIds(selectedAddonIds.filter((x) => x !== id));
    } else {
      setSelectedAddonIds([...selectedAddonIds, id]);
    }
  };

  const handleReserve = () => {
    onStartCheckout({
      stay,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: guestsCount,
      addons: chosenAddons,
      totalPrice: grandTotal,
      nightsCount: nights,
    });
  };

  return (
    <div className="w-full pb-20 bg-[#faf9f5] text-stone-900">
      
      {/* Top Floating Action Bar */}
      <div className="sticky top-0 z-20 bg-[#faf9f5]/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between border-b border-stone-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white px-3 py-1.5 rounded-full border border-stone-300 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Escapes</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 bg-white text-stone-700 hover:text-stone-900 rounded-full border border-stone-300 shadow-2xs transition-colors relative"
            title="Share escape"
          >
            <Share2 className="w-4 h-4" />
            {copiedLink && (
              <span className="absolute -bottom-8 right-0 bg-stone-900 text-white text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                Link copied!
              </span>
            )}
          </button>
          <button
            onClick={() => onToggleSave(stay.id)}
            className="p-2 bg-white rounded-full border border-stone-300 shadow-2xs transition-colors"
            title="Save stay"
          >
            <Heart
              className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-700'}`}
            />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">

        {/* Header Title & Location */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-700 uppercase tracking-widest">
            <span>{stay.category}</span>
            <span>·</span>
            <span>{stay.architect.studio}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 mt-1">
            {stay.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mt-2">
            <div className="flex items-center gap-1 font-semibold text-stone-900">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{stay.rating}</span>
              <span className="font-normal text-stone-500">({stay.reviewCount} reviews)</span>
            </div>
            <span>·</span>
            <span className="flex items-center gap-1 text-stone-600">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              {stay.location}, {stay.country}
            </span>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="relative rounded-2xl overflow-hidden mb-8 border border-stone-200 shadow-sm bg-stone-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 h-80 sm:h-96 md:h-[420px]">
            {/* Big Hero Image */}
            <div 
              onClick={onOpenGallery}
              className="md:col-span-2 h-full relative cursor-pointer group overflow-hidden"
            >
              <img
                src={stay.heroImage}
                alt={stay.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Side Grid Images */}
            <div className="hidden md:grid col-span-2 grid-cols-2 gap-1.5 h-full">
              {stay.images.slice(1, 5).map((img, i) => (
                <div
                  key={i}
                  onClick={onOpenGallery}
                  className="relative h-full cursor-pointer group overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`${stay.title} gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* View All Photos Button */}
          <button
            onClick={onOpenGallery}
            className="absolute bottom-3 right-3 bg-stone-900/80 hover:bg-stone-950 backdrop-blur-md text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors border border-stone-700"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Show All Photos</span>
          </button>
        </div>

        {/* Content Layout: Left details vs Right booking widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Architectural Story & Amenities */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Residence Specs Bar */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-stone-500" />
                <span>{stay.maxGuests} Guests</span>
              </div>
              <span className="text-stone-300">|</span>
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-stone-500" />
                <span>{stay.bedrooms} Bedrooms</span>
              </div>
              <span className="text-stone-300">|</span>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-stone-500" />
                <span>{stay.bathrooms} Baths</span>
              </div>
              <span className="text-stone-300">|</span>
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-stone-500" />
                <span>{stay.sqm} m²</span>
              </div>
            </div>

            {/* Architect Focus Card */}
            <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl border border-stone-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase">
                    Architectural Provenance
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                    {stay.architect.name}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Built in {stay.architect.yearBuilt} · {stay.architect.studio}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <blockquote className="text-xs text-stone-300 italic pl-3 border-l-2 border-amber-400/60 py-0.5">
                "{stay.architect.philosophy}"
              </blockquote>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-800">
                {stay.architect.awards.map((award, i) => (
                  <span key={i} className="text-[11px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-md border border-stone-700/60">
                    🏆 {award}
                  </span>
                ))}
              </div>
            </div>

            {/* Host Profile */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200">
              <div className="flex items-center gap-3">
                <img
                  src={stay.host.avatar}
                  alt={stay.host.name}
                  className="w-12 h-12 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-sm text-stone-900">
                      Hosted by {stay.host.name}
                    </h4>
                    {stay.host.isSuperhost && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-1.5 py-0.5 rounded">
                        Superhost
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500">
                    {stay.host.title} · Member since {stay.host.joinedYear}
                  </p>
                </div>
              </div>
              <div className="text-right text-xs text-stone-500 hidden sm:block">
                <span>Response rate:</span>
                <p className="font-semibold text-stone-800">{stay.host.responseRate}</p>
              </div>
            </div>

            {/* Description Narrative */}
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                About the Sanctuary
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed">
                {stay.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Curated Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {stay.amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-stone-200/80 text-xs text-stone-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    {stay.rating} · {stay.reviewCount} Guest Reviews
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {stay.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <h5 className="font-semibold text-xs text-stone-900">{rev.author}</h5>
                          <span className="text-[10px] text-stone-500">{rev.location} · {rev.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-700 italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Booking Card Widget */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 bg-white rounded-2xl p-5 border border-stone-300 shadow-lg space-y-5">
              
              {/* Card Header Price */}
              <div className="flex items-baseline justify-between pb-3 border-b border-stone-200">
                <div>
                  <span className="font-serif text-2xl font-bold text-stone-900">
                    {currencySymbol}{stay.pricePerNight}
                  </span>
                  <span className="text-xs text-stone-500 font-normal"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-stone-700 font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{stay.rating}</span>
                </div>
              </div>

              {/* Date & Guest Input Form */}
              <div className="rounded-xl border border-stone-300 overflow-hidden divide-y divide-stone-300 text-xs">
                {/* Dates Row */}
                <div className="grid grid-cols-2 divide-x divide-stone-300 bg-stone-50">
                  <div className="p-2.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent font-medium text-stone-900 focus:outline-none cursor-pointer mt-0.5"
                    />
                  </div>
                  <div className="p-2.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent font-medium text-stone-900 focus:outline-none cursor-pointer mt-0.5"
                    />
                  </div>
                </div>

                {/* Guests Row */}
                <div className="p-2.5 bg-white flex items-center justify-between">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      Guests
                    </label>
                    <span className="font-semibold text-stone-900">
                      {guestsCount} Guests
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                      disabled={guestsCount <= 1}
                      className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setGuestsCount(Math.min(stay.maxGuests, guestsCount + 1))}
                      disabled={guestsCount >= stay.maxGuests}
                      className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add-on Experiences Checkbox List */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-800">
                  Curated On-Site Experiences
                </label>
                <div className="space-y-2">
                  {availableAddons.map((addon) => {
                    const active = selectedAddonIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          active
                            ? 'bg-amber-50/60 border-amber-400/80 text-stone-900'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            active ? 'bg-amber-500 border-amber-600 text-white' : 'border-stone-400 bg-white'
                          }`}>
                            {active && <Check className="w-3 h-3" />}
                          </div>
                          <span>{addon.name}</span>
                        </div>
                        <span className="font-semibold">+{currencySymbol}{addon.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>{currencySymbol}{stay.pricePerNight} × {nights} nights</span>
                  <span>{currencySymbol}{baseRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning & restoration fee</span>
                  <span>{currencySymbol}{cleaning}</span>
                </div>
                <div className="flex justify-between">
                  <span>Curated concierge fee (12%)</span>
                  <span>{currencySymbol}{serviceFee}</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between text-amber-800 font-medium">
                    <span>Selected experiences</span>
                    <span>+{currencySymbol}{addonsTotal}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total before taxes</span>
                  <span>{currencySymbol}{grandTotal}</span>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                onClick={handleReserve}
                className="w-full py-3 bg-stone-900 hover:bg-black text-white font-medium text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Reserve This Sanctuary</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Complimentary cancellation up to 14 days prior</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
