import React from 'react';
import { 
  Maximize2, 
  ExternalLink, 
  Sparkles, 
  Compass, 
  FileText, 
  Luggage, 
  CreditCard, 
  Heart, 
  Home 
} from 'lucide-react';
import { ScreenType, Stay, Reservation } from '../../types';
import { ExploreScreen } from './ExploreScreen';
import { DetailScreen } from './DetailScreen';
import { TripsScreen } from './TripsScreen';
import { CheckoutScreen } from './CheckoutScreen';
import { WishlistScreen } from './WishlistScreen';
import { HostScreen } from './HostScreen';

interface AllScreensCanvasProps {
  stays: Stay[];
  selectedStay: Stay;
  onSelectStay: (stay: Stay) => void;
  onSelectScreen: (screen: ScreenType) => void;
  onNavigate: (screen: ScreenType) => void;
  savedStayIds: string[];
  onToggleSave: (stayId: string) => void;
  onRemoveSave: (stayId: string) => void;
  reservation: Reservation;
  onOpenSearch: () => void;
  onOpenFilter: () => void;
  currencySymbol: string;
}

export const AllScreensCanvas: React.FC<AllScreensCanvasProps> = ({
  stays,
  selectedStay,
  onSelectStay,
  onSelectScreen,
  onNavigate,
  savedStayIds,
  onToggleSave,
  onRemoveSave,
  reservation,
  onOpenSearch,
  onOpenFilter,
  currencySymbol,
}) => {
  const screensMeta: { id: ScreenType; title: string; subtitle: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'explore', title: 'Screen 1: Explore & Stays', subtitle: 'Category filters, search, and architectural map', icon: Compass },
    { id: 'detail', title: 'Screen 2: Stay Detail & Gallery', subtitle: 'Architect provenance, amenities & booking', icon: FileText },
    { id: 'trips', title: 'Screen 3: Trips & Digital Pass', subtitle: 'Smart keycode, Starlink WiFi & 4-day itinerary', icon: Luggage },
    { id: 'checkout', title: 'Screen 4: Instant Checkout', subtitle: 'Promo discounts, payment & digital pass generation', icon: CreditCard },
    { id: 'wishlist', title: 'Screen 5: Saved Wishlists', subtitle: 'Curated moodboards & spec comparison table', icon: Heart },
    { id: 'host', title: 'Screen 6: Host Studio', subtitle: 'Occupancy metrics, earnings & concierge messages', icon: Home },
  ];

  const savedStaysList = stays.filter((s) => savedStayIds.includes(s.id));

  return (
    <div className="w-full min-h-screen bg-stone-900 py-8 px-4 sm:px-8 text-stone-100">
      
      {/* Canvas Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive Multi-Screen Architecture Canvas</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Complete Application Screens Flow
          </h1>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl">
            All 6 application screens running live and interactively. Click "Focus Screen" to test any screen in dedicated mobile or desktop view.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-stone-800 text-stone-300 px-3 py-1.5 rounded-lg border border-stone-700 font-mono">
            6 Production Screens Active
          </span>
        </div>
      </div>

      {/* Grid of All Screens */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {screensMeta.map((screen) => {
          const Icon = screen.icon;

          return (
            <div key={screen.id} className="flex flex-col items-center">
              
              {/* Screen Card Label */}
              <div className="w-full flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-stone-200">
                      {screen.title}
                    </h3>
                    <p className="text-[10px] text-stone-400 truncate max-w-[190px]">
                      {screen.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectScreen(screen.id)}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-amber-400 hover:text-amber-300 text-[11px] font-medium rounded-md border border-stone-700 flex items-center gap-1 transition-colors"
                  title="Focus and expand this screen"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Focus</span>
                </button>
              </div>

              {/* Mini Device Frame */}
              <div className="relative w-full max-w-[360px] h-[640px] bg-stone-950 rounded-[40px] p-2.5 shadow-2xl ring-1 ring-stone-800 overflow-hidden flex flex-col border border-stone-800/80 group">
                
                {/* Dynamic island pill */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 h-5 px-3 bg-stone-950 rounded-full flex items-center gap-1.5 shadow-sm border border-stone-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-medium text-stone-300">Lumina</span>
                </div>

                {/* Inner Screen Display */}
                <div className="relative w-full h-full bg-[#faf9f5] rounded-[32px] overflow-y-auto no-scrollbar pt-6 text-stone-900">
                  {screen.id === 'explore' && (
                    <ExploreScreen
                      stays={stays}
                      selectedStay={selectedStay}
                      onSelectStay={onSelectStay}
                      onNavigate={onNavigate}
                      savedStayIds={savedStayIds}
                      onToggleSave={onToggleSave}
                      onOpenSearch={onOpenSearch}
                      onOpenFilter={onOpenFilter}
                      currencySymbol={currencySymbol}
                      isCompact={true}
                    />
                  )}

                  {screen.id === 'detail' && (
                    <DetailScreen
                      stay={selectedStay}
                      onBack={() => onNavigate('explore')}
                      onNavigate={onNavigate}
                      isSaved={savedStayIds.includes(selectedStay.id)}
                      onToggleSave={onToggleSave}
                      currencySymbol={currencySymbol}
                      onStartCheckout={() => onNavigate('checkout')}
                      onOpenGallery={() => onSelectScreen('detail')}
                    />
                  )}

                  {screen.id === 'trips' && (
                    <TripsScreen
                      reservation={reservation}
                      onNavigate={onNavigate}
                      onSelectStay={onSelectStay}
                      currencySymbol={currencySymbol}
                    />
                  )}

                  {screen.id === 'checkout' && (
                    <CheckoutScreen
                      stay={selectedStay}
                      onBack={() => onNavigate('detail')}
                      onNavigate={onNavigate}
                      onCompleteBooking={() => onNavigate('trips')}
                      currencySymbol={currencySymbol}
                    />
                  )}

                  {screen.id === 'wishlist' && (
                    <WishlistScreen
                      savedStays={savedStaysList}
                      onRemoveSave={onRemoveSave}
                      onSelectStay={onSelectStay}
                      onNavigate={onNavigate}
                      currencySymbol={currencySymbol}
                    />
                  )}

                  {screen.id === 'host' && (
                    <HostScreen
                      stays={stays}
                      onSelectStay={onSelectStay}
                      onNavigate={onNavigate}
                      currencySymbol={currencySymbol}
                    />
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
