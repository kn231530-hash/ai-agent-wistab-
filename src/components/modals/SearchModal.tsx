import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, X, Compass, Check } from 'lucide-react';
import { CATEGORIES } from '../../data/mockStays';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySearch: (params: { destination: string; guests: number; category: string }) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onApplySearch,
}) => {
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState(2);
  const [category, setCategory] = useState('All Escapes');

  const popularDestinations = [
    { name: 'Niseko, Hokkaido', country: 'Japan' },
    { name: 'Amalfi Coast', country: 'Italy' },
    { name: 'Joshua Tree, CA', country: 'USA' },
    { name: 'Lofoten Islands', country: 'Norway' },
    { name: 'Arashiyama, Kyoto', country: 'Japan' },
    { name: 'Engadin, Alps', country: 'Switzerland' },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplySearch({ destination, guests, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700">
              Curated Destination Search
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-900 mt-0.5">
              Find an Architectural Sanctuary
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Destination input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-800">
              Destination or Region
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Where to? (e.g. Hokkaido, Amalfi, Swiss Alps)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Popular quick-select suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {popularDestinations.map((d) => (
                <button
                  type="button"
                  key={d.name}
                  onClick={() => setDestination(d.name)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                    destination === d.name
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-100/80 text-stone-600 border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Category selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-800">
              Architectural Archetype
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Count */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-stone-800">
                Guests
              </label>
              <span className="text-xs font-bold font-mono text-stone-900">
                {guests} Guests
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>Solo (1)</span>
              <span>Intimate (2)</span>
              <span>Group (4-8)</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore Sanctuaries</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
