import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, Sparkles } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxPrice: number;
  onApplyFilters: (filters: { maxPrice: number; minBedrooms: number; selectedAmenities: string[] }) => void;
  currencySymbol: string;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  maxPrice: initialMaxPrice,
  onApplyFilters,
  currencySymbol,
}) => {
  const [price, setPrice] = useState(initialMaxPrice || 1400);
  const [minBedrooms, setMinBedrooms] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const filterFeatures = [
    'Private Geothermal Onsen',
    'Hinoki Cedar Sauna',
    'Sunken Hearth Fireplace',
    'Infinity Edge Horizon Pool',
    'Celestron Observatory Telescope',
    'Private Cliff Path to Cove',
    'Universal Tesla EV Charger',
  ];

  if (!isOpen) return null;

  const toggleFeature = (feat: string) => {
    if (selectedAmenities.includes(feat)) {
      setSelectedAmenities(selectedAmenities.filter((f) => f !== feat));
    } else {
      setSelectedAmenities([...selectedAmenities, feat]);
    }
  };

  const handleApply = () => {
    onApplyFilters({ maxPrice: price, minBedrooms, selectedAmenities });
    onClose();
  };

  const handleReset = () => {
    setPrice(1400);
    setMinBedrooms(1);
    setSelectedAmenities([]);
    onApplyFilters({ maxPrice: 1400, minBedrooms: 1, selectedAmenities: [] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-700" />
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Filter Escapes
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Max Price Range Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-stone-800">Max Nightly Rate</label>
            <span className="font-mono font-bold text-sm text-stone-900">
              Up to {currencySymbol}{price} / night
            </span>
          </div>
          <input
            type="range"
            min="400"
            max="1500"
            step="50"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-stone-900 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400 font-mono">
            <span>{currencySymbol}400</span>
            <span>{currencySymbol}900</span>
            <span>{currencySymbol}1,500+</span>
          </div>
        </div>

        {/* Bedrooms count */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-800">
            Minimum Bedrooms
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setMinBedrooms(num)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  minBedrooms === num
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {num}+ {num === 1 ? 'bed' : 'beds'}
              </button>
            ))}
          </div>
        </div>

        {/* Architectural Features */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-800">
            Architectural Elements & Amenities
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filterFeatures.map((feat) => {
              const active = selectedAmenities.includes(feat);
              return (
                <button
                  key={feat}
                  type="button"
                  onClick={() => toggleFeature(feat)}
                  className={`p-2.5 rounded-xl border text-xs text-left flex items-center justify-between transition-colors ${
                    active
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="truncate pr-1">{feat}</span>
                  {active && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-stone-200 flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-md transition-all"
          >
            Show Filtered Sanctuaries
          </button>
        </div>

      </div>
    </div>
  );
};
