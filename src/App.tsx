/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { MobileFrame } from './components/MobileFrame';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { DetailScreen } from './components/screens/DetailScreen';
import { TripsScreen } from './components/screens/TripsScreen';
import { CheckoutScreen } from './components/screens/CheckoutScreen';
import { WishlistScreen } from './components/screens/WishlistScreen';
import { HostScreen } from './components/screens/HostScreen';
import { AllScreensCanvas } from './components/screens/AllScreensCanvas';
import { SearchModal } from './components/modals/SearchModal';
import { FilterModal } from './components/modals/FilterModal';
import { GalleryModal } from './components/modals/GalleryModal';
import { MOCK_STAYS, INITIAL_RESERVATION } from './data/mockStays';
import { ScreenType, ViewMode, Stay, Reservation } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('explore');
  const [viewMode, setViewMode] = useState<ViewMode>('mobile');
  const [stays, setStays] = useState<Stay[]>(MOCK_STAYS);
  const [selectedStay, setSelectedStay] = useState<Stay>(MOCK_STAYS[0]);
  const [savedStayIds, setSavedStayIds] = useState<string[]>([
    'obsidian-pavilion',
    'koto-fjord-sanctuary',
  ]);
  const [reservation, setReservation] = useState<Reservation>(INITIAL_RESERVATION);
  const [currency, setCurrency] = useState<string>('USD');

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Active Checkout Booking Payload
  const [activeBookingData, setActiveBookingData] = useState<{
    stay: Stay;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    addons: { id: string; name: string; price: number }[];
    totalPrice: number;
    nightsCount: number;
  }>({
    stay: MOCK_STAYS[0],
    checkInDate: '2026-11-14',
    checkOutDate: '2026-11-18',
    guests: 2,
    addons: [{ id: 'tea-ceremony', name: 'Private Architecture & Tea Ceremony', price: 140 }],
    totalPrice: 3872,
    nightsCount: 4,
  });

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    JPY: '¥',
    GBP: '£',
  };
  const currencySymbol = currencySymbols[currency] || '$';

  // Toggle Save / Wishlist
  const handleToggleSave = (stayId: string) => {
    setSavedStayIds((prev) =>
      prev.includes(stayId) ? prev.filter((id) => id !== stayId) : [...prev, stayId]
    );
  };

  const handleRemoveSave = (stayId: string) => {
    setSavedStayIds((prev) => prev.filter((id) => id !== stayId));
  };

  const handleSelectStay = (stay: Stay) => {
    setSelectedStay(stay);
  };

  const handleStartCheckout = (data: typeof activeBookingData) => {
    setActiveBookingData(data);
    setSelectedStay(data.stay);
    setCurrentScreen('checkout');
  };

  const handleCompleteBooking = (newRes: Reservation) => {
    setReservation(newRes);
  };

  // Search Filter Handler
  const handleApplySearch = ({ destination, guests, category }: { destination: string; guests: number; category: string }) => {
    let result = [...MOCK_STAYS];
    if (destination.trim()) {
      const q = destination.toLowerCase();
      result = result.filter(
        (s) =>
          s.location.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q)
      );
    }
    if (category && category !== 'All Escapes') {
      result = result.filter((s) => s.category === category);
    }
    result = result.filter((s) => s.maxGuests >= guests);
    setStays(result.length > 0 ? result : MOCK_STAYS);
  };

  // Filter Modal Handler
  const handleApplyFilters = ({ maxPrice, minBedrooms, selectedAmenities }: { maxPrice: number; minBedrooms: number; selectedAmenities: string[] }) => {
    let result = MOCK_STAYS.filter((s) => s.pricePerNight <= maxPrice && s.bedrooms >= minBedrooms);
    if (selectedAmenities.length > 0) {
      result = result.filter((s) =>
        selectedAmenities.every((amenity) =>
          s.amenities.some((a) => a.name.toLowerCase().includes(amenity.toLowerCase()))
        )
      );
    }
    setStays(result.length > 0 ? result : MOCK_STAYS);
  };

  const savedStaysList = MOCK_STAYS.filter((s) => savedStayIds.includes(s.id));

  // Render the current screen component
  const renderScreenContent = (compact = false) => {
    switch (currentScreen) {
      case 'explore':
        return (
          <ExploreScreen
            stays={stays}
            selectedStay={selectedStay}
            onSelectStay={handleSelectStay}
            onNavigate={(screen) => setCurrentScreen(screen)}
            savedStayIds={savedStayIds}
            onToggleSave={handleToggleSave}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenFilter={() => setIsFilterOpen(true)}
            currencySymbol={currencySymbol}
            isCompact={compact}
          />
        );
      case 'detail':
        return (
          <DetailScreen
            stay={selectedStay}
            onBack={() => setCurrentScreen('explore')}
            onNavigate={(screen) => setCurrentScreen(screen)}
            isSaved={savedStayIds.includes(selectedStay.id)}
            onToggleSave={handleToggleSave}
            currencySymbol={currencySymbol}
            onStartCheckout={handleStartCheckout}
            onOpenGallery={() => setIsGalleryOpen(true)}
          />
        );
      case 'trips':
        return (
          <TripsScreen
            reservation={reservation}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onSelectStay={handleSelectStay}
            currencySymbol={currencySymbol}
          />
        );
      case 'checkout':
        return (
          <CheckoutScreen
            stay={selectedStay}
            bookingData={activeBookingData}
            onBack={() => setCurrentScreen('detail')}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onCompleteBooking={handleCompleteBooking}
            currencySymbol={currencySymbol}
          />
        );
      case 'wishlist':
        return (
          <WishlistScreen
            savedStays={savedStaysList}
            onRemoveSave={handleRemoveSave}
            onSelectStay={handleSelectStay}
            onNavigate={(screen) => setCurrentScreen(screen)}
            currencySymbol={currencySymbol}
          />
        );
      case 'host':
        return (
          <HostScreen
            stays={stays}
            onSelectStay={handleSelectStay}
            onNavigate={(screen) => setCurrentScreen(screen)}
            currencySymbol={currencySymbol}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-900 flex flex-col antialiased">
      
      {/* Top Application Header */}
      <Header
        currentScreen={currentScreen}
        onSelectScreen={(screen) => setCurrentScreen(screen)}
        viewMode={viewMode}
        onSelectViewMode={(mode) => setViewMode(mode)}
        wishlistCount={savedStayIds.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        currency={currency}
        onChangeCurrency={setCurrency}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col justify-center">
        {viewMode === 'canvas' ? (
          /* Multi-Screen Figma/Behance Style Canvas */
          <AllScreensCanvas
            stays={stays}
            selectedStay={selectedStay}
            onSelectStay={handleSelectStay}
            onSelectScreen={(screen) => {
              setCurrentScreen(screen);
              setViewMode('mobile');
            }}
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              setViewMode('mobile');
            }}
            savedStayIds={savedStayIds}
            onToggleSave={handleToggleSave}
            onRemoveSave={handleRemoveSave}
            reservation={reservation}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenFilter={() => setIsFilterOpen(true)}
            currencySymbol={currencySymbol}
          />
        ) : viewMode === 'mobile' ? (
          /* Mobile Device Frame View (iPhone 16 Pro) */
          <div className="w-full flex-1 flex flex-col justify-center items-center py-4 bg-stone-900">
            <MobileFrame
              currentScreen={currentScreen}
              onSelectScreen={(screen) => setCurrentScreen(screen)}
              wishlistCount={savedStayIds.length}
            >
              {renderScreenContent(true)}
            </MobileFrame>
          </div>
        ) : (
          /* Full Responsive Desktop View */
          <div className="w-full flex-1 bg-[#faf9f5]">
            {renderScreenContent(false)}
          </div>
        )}
      </main>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onApplySearch={handleApplySearch}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        maxPrice={1400}
        onApplyFilters={handleApplyFilters}
        currencySymbol={currencySymbol}
      />

      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        stay={selectedStay}
      />

    </div>
  );
}
