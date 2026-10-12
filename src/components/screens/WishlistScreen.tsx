import React, { useState } from 'react';
import { 
  Heart, 
  Trash2, 
  Plus, 
  Star, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  MapPin, 
  Check, 
  X,
  Share2
} from 'lucide-react';
import { Stay, ScreenType } from '../../types';

interface WishlistScreenProps {
  savedStays: Stay[];
  onRemoveSave: (stayId: string) => void;
  onSelectStay: (stay: Stay) => void;
  onNavigate: (screen: ScreenType) => void;
  currencySymbol: string;
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({
  savedStays,
  onRemoveSave,
  onSelectStay,
  onNavigate,
  currencySymbol,
}) => {
  const [isComparing, setIsComparing] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [collections, setCollections] = useState([
    { id: '1', name: 'Winter Timber & Onsen', count: 2, cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
    { id: '2', name: 'Amalfi Travertine & Horizon', count: 1, cover: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' },
  ]);

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    setCollections([
      ...collections,
      {
        id: String(Date.now()),
        name: newCollectionName.trim(),
        count: 0,
        cover: savedStays[0]?.heroImage || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
      },
    ]);
    setNewCollectionName('');
    setShowCreateModal(false);
  };

  return (
    <div className="w-full pb-20 bg-[#faf9f5] text-stone-900">
      
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-[#faf9f5]/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-stone-200">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Saved Sanctuaries & Moodboards
            </h1>
            <p className="text-xs text-stone-500">
              {savedStays.length} architectural residences saved to your personal collection
            </p>
          </div>

          <div className="flex items-center gap-2">
            {savedStays.length > 1 && (
              <button
                onClick={() => setIsComparing(!isComparing)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  isComparing 
                    ? 'bg-stone-900 text-white border-stone-900' 
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isComparing ? 'Close Compare' : 'Compare Stays'}</span>
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 bg-stone-900 text-white hover:bg-black rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              title="Create new moodboard"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Moodboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 space-y-6">

        {/* Curated Moodboards Row */}
        <div>
          <h3 className="font-serif font-bold text-sm text-stone-900 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Curated Collections</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {collections.map((col) => (
              <div
                key={col.id}
                className="group relative rounded-xl overflow-hidden aspect-16/10 cursor-pointer border border-stone-200 shadow-2xs bg-stone-900"
              >
                <img
                  src={col.cover}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <h4 className="font-serif font-bold text-xs sm:text-sm truncate">
                    {col.name}
                  </h4>
                  <span className="text-[10px] text-stone-300 font-mono">
                    {col.count} saved residences
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPARISON TABLE (If isComparing is active) */}
        {isComparing && savedStays.length > 1 && (
          <div className="bg-white rounded-2xl p-5 border border-stone-300 shadow-md overflow-x-auto space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Architectural Specification Comparison
              </h3>
              <button
                onClick={() => setIsComparing(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <table className="w-full text-xs text-left divide-y divide-stone-200 min-w-[500px]">
              <thead>
                <tr className="divide-x divide-stone-200">
                  <th className="p-2 font-semibold text-stone-500 w-1/4">Metric</th>
                  {savedStays.map((s) => (
                    <th key={s.id} className="p-2 font-bold text-stone-900 w-1/4">
                      {s.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-700">
                <tr className="divide-x divide-stone-200">
                  <td className="p-2 font-medium text-stone-500">Rate / Night</td>
                  {savedStays.map((s) => (
                    <td key={s.id} className="p-2 font-bold text-stone-900 font-mono">
                      {currencySymbol}{s.pricePerNight}
                    </td>
                  ))}
                </tr>
                <tr className="divide-x divide-stone-200">
                  <td className="p-2 font-medium text-stone-500">Architect & Year</td>
                  {savedStays.map((s) => (
                    <td key={s.id} className="p-2">
                      {s.architect.studio} ({s.architect.yearBuilt})
                    </td>
                  ))}
                </tr>
                <tr className="divide-x divide-stone-200">
                  <td className="p-2 font-medium text-stone-500">Living Area</td>
                  {savedStays.map((s) => (
                    <td key={s.id} className="p-2 font-mono">
                      {s.sqm} m² ({s.bedrooms} bdrms)
                    </td>
                  ))}
                </tr>
                <tr className="divide-x divide-stone-200">
                  <td className="p-2 font-medium text-stone-500">Rating</td>
                  {savedStays.map((s) => (
                    <td key={s.id} className="p-2 font-semibold text-amber-600">
                      ★ {s.rating} ({s.reviewCount})
                    </td>
                  ))}
                </tr>
                <tr className="divide-x divide-stone-200">
                  <td className="p-2 font-medium text-stone-500">Key Feature</td>
                  {savedStays.map((s) => (
                    <td key={s.id} className="p-2">
                      {s.features[0] || 'Sanctuary'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Saved Stays Cards Grid */}
        <div>
          <h3 className="font-serif font-bold text-base text-stone-900 mb-3">
            All Saved Sanctuaries
          </h3>

          {savedStays.length === 0 ? (
            <div className="p-10 bg-white rounded-2xl border border-stone-200 text-center space-y-3">
              <Heart className="w-10 h-10 text-stone-300 mx-auto" />
              <h4 className="font-serif font-bold text-base text-stone-800">
                No sanctuaries saved yet
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Explore our curated architectural residences and tap the heart icon on any property to save it here.
              </p>
              <button
                onClick={() => onNavigate('explore')}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Discover Escapes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedStays.map((stay) => (
                <div
                  key={stay.id}
                  onClick={() => {
                    onSelectStay(stay);
                    onNavigate('detail');
                  }}
                  className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
                    <img
                      src={stay.heroImage}
                      alt={stay.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    />

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSave(stay.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <span className="absolute bottom-2 left-2 text-[10px] bg-stone-900/80 text-stone-200 px-2 py-0.5 rounded backdrop-blur-xs">
                      {stay.category}
                    </span>
                  </div>

                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span className="truncate">{stay.location}, {stay.country}</span>
                        <div className="flex items-center gap-1 font-semibold text-stone-900">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{stay.rating}</span>
                        </div>
                      </div>

                      <h4 className="font-serif font-bold text-sm text-stone-900 mt-1 line-clamp-1">
                        {stay.title}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                        {stay.tagline}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100">
                      <div className="text-xs font-bold text-stone-900">
                        {currencySymbol}{stay.pricePerNight} <span className="font-normal text-stone-500">/ night</span>
                      </div>
                      <span className="text-xs font-medium text-amber-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Create Moodboard Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-stone-900">
                New Architectural Collection
              </h4>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCollection} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Collection Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kyoto Pavilions & Bamboo"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
