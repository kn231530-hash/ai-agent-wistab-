import React from 'react';
import { 
  Smartphone, 
  Monitor, 
  LayoutGrid, 
  Compass, 
  FileText, 
  Luggage, 
  CreditCard, 
  Heart, 
  Home, 
  Search,
  Sparkles
} from 'lucide-react';
import { ScreenType, ViewMode } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  wishlistCount: number;
  onOpenSearch: () => void;
  currency: string;
  onChangeCurrency: (curr: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onSelectScreen,
  viewMode,
  onSelectViewMode,
  wishlistCount,
  onOpenSearch,
  currency,
  onChangeCurrency,
}) => {
  const screens: { id: ScreenType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'explore', label: '1. Explore', icon: Compass },
    { id: 'detail', label: '2. Stay Detail', icon: FileText },
    { id: 'trips', label: '3. Trips & Pass', icon: Luggage },
    { id: 'checkout', label: '4. Checkout', icon: CreditCard },
    { id: 'wishlist', label: '5. Wishlist', icon: Heart },
    { id: 'host', label: '6. Host Studio', icon: Home },
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 transition-all">
      {/* Top Banner & Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectScreen('explore')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-950 flex items-center justify-center font-serif text-lg font-bold shadow-sm group-hover:scale-105 transition-transform">
              L
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif tracking-widest text-lg font-bold text-stone-100">
                  LUMINA
                </span>
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-medium bg-amber-400/10 px-1.5 py-0.5 rounded">
                  ESCAPES
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block tracking-wide">
                Architectural Stays & Sanctuaries
              </p>
            </div>
          </div>

          {/* Center Screen Navigator (Quick Jump) */}
          <div className="hidden lg:flex items-center gap-1 bg-stone-800/80 p-1 rounded-xl border border-stone-700/60">
            {screens.map((screen) => {
              const Icon = screen.icon;
              const isActive = currentScreen === screen.id;
              return (
                <button
                  key={screen.id}
                  onClick={() => onSelectScreen(screen.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-stone-100 text-stone-950 shadow-sm font-semibold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{screen.label}</span>
                  {screen.id === 'wishlist' && wishlistCount > 0 && (
                    <span className={`text-[10px] px-1 rounded-full ${isActive ? 'bg-stone-900 text-white' : 'bg-stone-700 text-amber-300'}`}>
                      {wishlistCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Zone: Search, Currency, View Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 text-xs text-stone-300 bg-stone-800/90 hover:bg-stone-700/90 px-3 py-2 rounded-lg border border-stone-700 transition-colors"
              title="Search stays"
            >
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden md:inline">Search escapes...</span>
            </button>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value)}
              aria-label="Select Currency"
              className="bg-stone-800 text-stone-200 border border-stone-700 text-xs rounded-lg px-2 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="GBP">GBP (£)</option>
            </select>

            {/* View Mode Switcher (Frame vs Desktop vs Multi-Screen Canvas) */}
            <div className="flex items-center bg-stone-800/90 p-1 rounded-lg border border-stone-700/80">
              <button
                onClick={() => onSelectViewMode('mobile')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Mobile Frame View (iPhone 16 Pro)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectViewMode('desktop')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Full Responsive Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectViewMode('canvas')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'canvas'
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="All Screens Side-by-Side Canvas"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Screen Selector Strip */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-stone-800 no-scrollbar">
          {screens.map((screen) => {
            const Icon = screen.icon;
            const isActive = currentScreen === screen.id;
            return (
              <button
                key={screen.id}
                onClick={() => onSelectScreen(screen.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-stone-100 text-stone-950 font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{screen.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
