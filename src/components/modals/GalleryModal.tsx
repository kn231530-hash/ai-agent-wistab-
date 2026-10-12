import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Stay } from '../../types';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stay: Stay;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  stay,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isOpen]);

  if (!isOpen) return null;

  const images = stay.images.length > 0 ? stay.images : [stay.heroImage];

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
        <div>
          <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block">
            {stay.architect.studio} ({stay.architect.yearBuilt})
          </span>
          <h3 className="font-serif font-bold text-base sm:text-lg">
            {stay.title}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-stone-300">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`${stay.title} photograph ${currentIndex + 1}`}
          className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
        />

        {/* Prev / Next Controls */}
        <button
          onClick={prevPhoto}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
          title="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextPhoto}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
          title="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 no-scrollbar">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
              currentIndex === idx
                ? 'border-amber-400 scale-105 shadow-md'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={img}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

    </div>
  );
};
