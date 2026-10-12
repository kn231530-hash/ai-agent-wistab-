import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  Calendar, 
  Users, 
  Tag, 
  QrCode,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Stay, Reservation, ScreenType } from '../../types';

interface CheckoutScreenProps {
  stay: Stay;
  bookingData?: {
    stay: Stay;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    addons: { id: string; name: string; price: number }[];
    totalPrice: number;
    nightsCount: number;
  };
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onCompleteBooking: (newReservation: Reservation) => void;
  currencySymbol: string;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  stay,
  bookingData,
  onBack,
  onNavigate,
  onCompleteBooking,
  currencySymbol,
}) => {
  // Form state
  const [guestName, setGuestName] = useState('Julian Thorne');
  const [guestEmail, setGuestEmail] = useState('julian.thorne@designcollective.io');
  const [guestPhone, setGuestPhone] = useState('+1 (555) 234-8900');
  const [specialRequests, setSpecialRequests] = useState('Arriving around 4 PM. We would appreciate extra birch firewood for the hearth.');
  
  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple-pay'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('382');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  // Confirmation state
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  const checkIn = bookingData?.checkInDate || '2026-11-14';
  const checkOut = bookingData?.checkOutDate || '2026-11-18';
  const guests = bookingData?.guests || 2;
  const nights = bookingData?.nightsCount || 4;
  const baseRate = stay.pricePerNight * nights;
  const cleaning = stay.cleaningFee;
  const serviceFee = Math.round(baseRate * stay.serviceFeeRate);
  const addonsTotal = bookingData?.addons?.reduce((sum, a) => sum + a.price, 0) || 140;

  const rawTotal = baseRate + cleaning + serviceFee + addonsTotal;
  const finalTotal = Math.max(0, rawTotal - appliedDiscount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'ARCHITECT' || clean === 'LUMINA20') {
      const disc = Math.round(rawTotal * 0.15);
      setAppliedDiscount(disc);
      setPromoFeedback(`Voucher ${clean} applied: 15% VIP architectural reduction (-${currencySymbol}${disc})`);
    } else if (clean) {
      setPromoFeedback('Invalid code. Try using "ARCHITECT" for 15% VIP discount.');
    }
  };

  const handleConfirmPayment = () => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#1c1917', '#e7e5e4', '#10b981'],
      });
    } catch {
      // fallback if confetti throws
    }

    const newRes: Reservation = {
      id: `RES-${Math.floor(10000 + Math.random() * 90000)}`,
      stayId: stay.id,
      stay,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      addons: bookingData?.addons || [{ id: 'arch-tour', name: 'Private Architecture & Tea Ceremony', price: 140 }],
      totalPrice: finalTotal,
      nightlyTotal: baseRate,
      nightsCount: nights,
      taxesAndFees: serviceFee,
      doorCode: `${Math.floor(1000 + Math.random() * 9000)}#`,
      wifiSsid: `LUMINA_${stay.id.toUpperCase()}_5G`,
      wifiPass: 'ArchitecturalCalm2026',
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0],
      guestName,
      guestEmail,
    };

    setCreatedReservation(newRes);
    setIsConfirmed(true);
    onCompleteBooking(newRes);
  };

  if (isConfirmed && createdReservation) {
    return (
      <div className="w-full pb-20 bg-[#faf9f5] text-stone-900 px-4 sm:px-6 pt-6">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
            <Check className="w-8 h-8 stroke-3" />
          </div>

          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-700">
              Reservation Confirmed
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Your Sanctuary is Ready
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Confirmation ID: <strong className="font-mono text-stone-900">#{createdReservation.id}</strong>
            </p>
          </div>

          {/* Pass Card Preview */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 text-left space-y-3 border border-stone-800">
            <div className="flex items-center gap-3">
              <img
                src={stay.heroImage}
                alt={stay.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-serif font-bold text-base text-white truncate">
                  {stay.title}
                </h4>
                <p className="text-xs text-stone-400 truncate">
                  {stay.location}, {stay.country}
                </p>
                <div className="text-xs text-amber-300 font-mono mt-1">
                  {checkIn} → {checkOut} ({nights} nights)
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block font-mono">YOUR SMART KEYCODE</span>
                <span className="font-mono font-bold text-amber-400 text-sm tracking-widest">
                  {createdReservation.doorCode}
                </span>
              </div>
              <div className="bg-white p-1 rounded-lg">
                <QrCode className="w-10 h-10 text-stone-950" />
              </div>
            </div>
          </div>

          <div className="text-xs text-stone-500">
            A confirmation pack with offline directions has been dispatched to <strong>{guestEmail}</strong>.
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onNavigate('trips')}
              className="flex-1 py-3 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>View Full Itinerary & Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('explore')}
              className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xl transition-colors"
            >
              Explore More Escapes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 bg-[#faf9f5] text-stone-900">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-[#faf9f5]/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-stone-200 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white px-3 py-1.5 rounded-full border border-stone-300 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Stay Details</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono text-stone-500">
          <Lock className="w-3.5 h-3.5 text-stone-700" />
          <span>256-Bit Encrypted Checkout</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5">
        
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-6">
          Confirm and Secure Reservation
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Guest Details & Payment Info */}
          <div className="lg:col-span-7 space-y-6">

            {/* Guest Details Form */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900">
                1. Guest Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Primary Guest Name
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Mobile Phone (for Smart Lock SMS alerts)
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800"
                />
              </div>

              <div className="text-xs">
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Architectural or Stay Preferences
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800 text-xs"
                />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  2. Payment Method
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Encrypted</span>
                </div>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple-pay')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'apple-pay'
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-bold"> Pay</span>
                  <span>Instant Pay</span>
                </button>
              </div>

              {/* Credit Card Fields */}
              {paymentMethod === 'card' ? (
                <div className="space-y-3 pt-2">
                  <div className="text-xs">
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-stone-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Expires
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        CVC Security Code
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-stone-800"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-stone-50 rounded-xl text-center space-y-2 border border-stone-200">
                  <p className="text-xs text-stone-600">
                    Authenticate quickly using Touch ID / Face ID configured on your device.
                  </p>
                </div>
              )}

            </div>

            {/* Cancellation Policy */}
            <div className="p-4 bg-stone-100 rounded-xl text-xs text-stone-600 space-y-1">
              <span className="font-semibold text-stone-800 block">
                Flexible Architectural Cancellation Policy
              </span>
              <p>
                Full refund up to 14 days prior to check-in. Between 14 and 7 days prior, 50% refund minus service fees.
              </p>
            </div>

          </div>

          {/* Right: Booking Summary & Final Pay Trigger */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 bg-white rounded-2xl p-5 border border-stone-300 shadow-md space-y-5">
              
              <h3 className="font-serif font-bold text-base text-stone-900 pb-2 border-b border-stone-200">
                Reservation Summary
              </h3>

              {/* Stay Preview snippet */}
              <div className="flex gap-3 items-center">
                <img
                  src={stay.heroImage}
                  alt={stay.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-stone-200"
                />
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-700">
                    {stay.category}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-stone-900 leading-snug">
                    {stay.title}
                  </h4>
                  <p className="text-xs text-stone-500">
                    {stay.location}, {stay.country}
                  </p>
                </div>
              </div>

              {/* Dates & Guests */}
              <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1.5 border border-stone-200">
                <div className="flex items-center justify-between text-stone-700">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span>Dates:</span>
                  </div>
                  <span className="font-semibold text-stone-900">{checkIn} → {checkOut} ({nights} nights)</span>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-500" />
                    <span>Guests:</span>
                  </div>
                  <span className="font-semibold text-stone-900">{guests} Guests</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Promo code (try ARCHITECT)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-8 pr-2 py-2 bg-stone-50 rounded-lg border border-stone-300 text-xs focus:outline-none uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
                {promoFeedback && (
                  <p className={`text-[11px] mt-1.5 ${appliedDiscount > 0 ? 'text-emerald-600 font-medium' : 'text-rose-500'}`}>
                    {promoFeedback}
                  </p>
                )}
              </div>

              {/* Itemized Price breakdown */}
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
                  <span>Concierge & service fee</span>
                  <span>{currencySymbol}{serviceFee}</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between text-amber-800 font-medium">
                    <span>Curated experiences</span>
                    <span>+{currencySymbol}{addonsTotal}</span>
                  </div>
                )}
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>VIP Architectural Discount</span>
                    <span>-{currencySymbol}{appliedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="font-serif text-lg">{currencySymbol}{finalTotal}</span>
                </div>
              </div>

              {/* Complete Booking CTA Button */}
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3.5 bg-stone-900 hover:bg-black text-white font-medium text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Confirm & Pay {currencySymbol}{finalTotal}</span>
              </button>

              <p className="text-[10px] text-center text-stone-500">
                By confirming, you agree to the Lumina Escapes Guest Architectural Charter.
              </p>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
