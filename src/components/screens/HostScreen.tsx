import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  Sparkles, 
  Check, 
  Sliders, 
  ShieldCheck, 
  ArrowUpRight,
  Eye,
  Plus,
  X
} from 'lucide-react';
import { HOST_STATS } from '../../data/mockStays';
import { Stay, ScreenType } from '../../types';

interface HostScreenProps {
  stays: Stay[];
  onSelectStay: (stay: Stay) => void;
  onNavigate: (screen: ScreenType) => void;
  currencySymbol: string;
}

export const HostScreen: React.FC<HostScreenProps> = ({
  stays,
  onSelectStay,
  onNavigate,
  currencySymbol,
}) => {
  const [selectedArrivalMessage, setSelectedArrivalMessage] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sentToast, setSentToast] = useState(false);
  const [nightlyRate, setNightlyRate] = useState(820);
  const [isInstantBook, setIsInstantBook] = useState(true);

  const upcomingGuests = [
    {
      id: 'g-1',
      name: 'Julian Thorne',
      stay: 'The Obsidian Pavilion',
      dates: 'Nov 14 – Nov 18',
      guests: 2,
      note: 'Arriving around 4 PM. Inquiring about fireplace kindling & sommelier wine.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'g-2',
      name: 'Elena Rostova',
      stay: 'Villa Caelum',
      dates: 'Dec 02 – Dec 07',
      guests: 4,
      note: 'Anniversary celebration. Requested private boat transfer from Naples.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSentToast(true);
    setReplyText('');
    setTimeout(() => {
      setSentToast(false);
      setSelectedArrivalMessage(null);
    }, 1500);
  };

  return (
    <div className="w-full pb-20 bg-[#faf9f5] text-stone-900">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-[#faf9f5]/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-stone-200">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-700 uppercase tracking-widest">
              <span>Lumina Partner Studio</span>
              <span>·</span>
              <span>Host Console</span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-0.5">
              Architectural Host Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Superhost Status Active</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 space-y-6">

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] text-stone-500 font-mono">YTD REVENUE</span>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
              {currencySymbol}{HOST_STATS.ytdEarnings.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs 2025</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] text-stone-500 font-mono">OCCUPANCY RATE</span>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
              {HOST_STATS.occupancyRate}%
            </div>
            <div className="text-[11px] text-stone-500">
              Peak winter season fully locked
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] text-stone-500 font-mono">GUEST RATING</span>
            <div className="text-xl sm:text-2xl font-bold text-amber-600 font-serif flex items-center gap-1">
              <span>{HOST_STATS.superhostScore}</span>
              <Star className="w-4 h-4 fill-amber-500 text-amber-500 inline" />
            </div>
            <div className="text-[11px] text-stone-500">
              Across 63 verified stays
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] text-stone-500 font-mono">BOOKED NIGHTS</span>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
              184
            </div>
            <div className="text-[11px] text-stone-500">
              Next arrival in 4 days
            </div>
          </div>

        </div>

        {/* REVENUE VISUALIZATION & CALENDAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Monthly Revenue Bar Chart */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Monthly Architectural Earnings
                </h3>
                <p className="text-xs text-stone-500">
                  Net payouts after concierge fees
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-stone-800">
                2026 Season
              </span>
            </div>

            {/* Bars */}
            <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-stone-100">
              {HOST_STATS.monthlyRevenue.map((item) => {
                const max = 7500;
                const heightPercent = Math.round((item.amount / max) * 100);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-mono text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {currencySymbol}{item.amount}
                    </span>
                    <div className="w-full bg-stone-100 rounded-t-md overflow-hidden h-32 flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-stone-900 group-hover:bg-amber-600 transition-all rounded-t-md"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-stone-600 font-mono">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rate & Availability Quick Settings */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Listing Controls: The Obsidian Pavilion
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Adjust Nightly Rate ({currencySymbol})
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={nightlyRate}
                    onChange={(e) => setNightlyRate(Number(e.target.value))}
                    className="flex-1 px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 font-mono text-sm font-semibold"
                  />
                  <button
                    onClick={() => alert(`Nightly rate updated to ${currencySymbol}${nightlyRate}`)}
                    className="px-3 py-2 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-medium"
                  >
                    Save Rate
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800 block">Instant Booking</span>
                  <p className="text-[11px] text-stone-500">Allow verified guests to book autonomously</p>
                </div>
                <button
                  onClick={() => setIsInstantBook(!isInstantBook)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    isInstantBook ? 'bg-amber-500' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform absolute top-1 ${
                      isInstantBook ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 space-y-1">
                <strong>Next Payout Scheduled:</strong>
                <p>Transfer of {currencySymbol}3,280 scheduled to Kenzo Tange Studio Trust on Nov 15.</p>
              </div>
            </div>
          </div>

        </div>

        {/* UPCOMING GUEST ARRIVALS */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Upcoming Guest Arrivals
              </h3>
              <p className="text-xs text-stone-500">
                Direct concierge messaging and custom guest requests
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {upcomingGuests.map((guest) => (
              <div
                key={guest.id}
                className="p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={guest.avatar}
                    alt={guest.name}
                    className="w-12 h-12 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-stone-900">{guest.name}</h4>
                      <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-mono">
                        {guest.stay}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      {guest.dates} · {guest.guests} Guests
                    </p>
                    <p className="text-xs text-stone-700 italic mt-0.5">
                      "{guest.note}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedArrivalMessage(guest.name)}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message Guest</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Guest Messaging Modal */}
      {selectedArrivalMessage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-stone-900">
                Message {selectedArrivalMessage}
              </h4>
              <button
                onClick={() => setSelectedArrivalMessage(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {sentToast ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Message dispatched to {selectedArrivalMessage}’s Lumina mobile pass!</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea
                  rows={4}
                  placeholder={`Hello ${selectedArrivalMessage}, your request has been confirmed. The cedar hearth is prepared and ready for your arrival.`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 bg-stone-50 rounded-lg border border-stone-300 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedArrivalMessage(null)}
                    className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg"
                  >
                    Send Direct Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
