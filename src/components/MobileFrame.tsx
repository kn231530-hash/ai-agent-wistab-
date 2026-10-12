import React from 'react';
import { 
  Wifi, 
  Battery, 
  Compass, 
  Heart, 
  Luggage, 
  Home, 
  Sparkles 
} from 'lucide-react';
import { ScreenType } from '../types';

interface MobileFrameProps {
  children: React.ReactNode;
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  wishlistCount: number;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  currentScreen,
  onSelectScreen,
  wishlistCount,
}) => {
  return (
    <div className="flex justify-center items-center py-6 px-4">
      {/* Phone Outer Shell */}
      <div className="relative w-[392px] h-[824px] max-w-full bg-stone-950 rounded-[54px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)] ring-1 ring-stone-800">
        
        {/* Subtle Side Button Accents */}
        <div className="absolute -left-[3px] top-[140px] w-[3px] h-10 bg-stone-700 rounded-l-sm" />
        <div className="absolute -left-[3px] top-[195px] w-[3px] h-14 bg-stone-700 rounded-l-sm" />
        <div className="absolute -left-[3px] top-[260px] w-[3px] h-14 bg-stone-700 rounded-l-sm" />
        <div className="absolute -right-[3px] top-[180px] w-[3px] h-18 bg-stone-700 rounded-r-sm" />

        {/* Screen Display Glass */}
        <div className="relative w-full h-full bg-[#faf9f5] rounded-[44px] overflow-hidden flex flex-col border border-stone-200/50 shadow-inner">
          
          {/* iOS Top Status Bar & Dynamic Island */}
          <div className="relative z-30 pt-3 px-6 pb-2 flex items-center justify-between text-stone-900 select-none bg-stone-100/90 backdrop-blur-md border-b border-stone-200/50">
            {/* Clock */}
            <span className="text-[13px] font-semibold tracking-tight font-sans">
              9:41
            </span>

            {/* Dynamic Island */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 h-7 px-3 bg-stone-950 rounded-full flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
              <span className="text-[11px] font-medium text-stone-200 tracking-wider">
                Lumina
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-stone-800" />
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-stone-800">
              <span className="text-[10px] font-semibold tracking-tighter">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center">
                <Battery className="w-4 h-4 fill-stone-800" />
              </div>
            </div>
          </div>

          {/* Active Screen Scrollable Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar bg-[#faf9f5]">
            {children}
          </div>

          {/* iOS Native Bottom Navigation Bar */}
          <div className="relative z-30 bg-stone-900 text-stone-300 border-t border-stone-800 px-6 pt-2 pb-5 flex items-center justify-between select-none">
            
            {/* Explore Tab */}
            <button
              onClick={() => onSelectScreen('explore')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                currentScreen === 'explore' ? 'text-amber-400 font-medium' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">Explore</span>
            </button>

            {/* Saved Wishlist Tab */}
            <button
              onClick={() => onSelectScreen('wishlist')}
              className={`flex flex-col items-center gap-0.5 relative transition-colors ${
                currentScreen === 'wishlist' ? 'text-amber-400 font-medium' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">Saved</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-950 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Trips Tab */}
            <button
              onClick={() => onSelectScreen('trips')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                currentScreen === 'trips' ? 'text-amber-400 font-medium' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Luggage className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">Trips</span>
            </button>

            {/* Host Portal Tab */}
            <button
              onClick={() => onSelectScreen('host')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                currentScreen === 'host' ? 'text-amber-400 font-medium' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">Host</span>
            </button>

            {/* Bottom Home Indicator Line */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-600 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
};
