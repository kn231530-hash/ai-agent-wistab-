import React, { useState } from 'react';
import { 
  Key, 
  Wifi, 
  QrCode, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check, 
  Share2, 
  Compass, 
  Phone, 
  ChevronRight, 
  ShieldCheck,
  Sparkles,
  Download
} from 'lucide-react';
import { Reservation, Stay, ScreenType } from '../../types';

interface TripsScreenProps {
  reservation: Reservation;
  onNavigate: (screen: ScreenType) => void;
  onSelectStay: (stay: Stay) => void;
  currencySymbol: string;
}

export const TripsScreen: React.FC<TripsScreenProps> = ({
  reservation,
  onNavigate,
  onSelectStay,
  currencySymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showCode, setShowCode] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(reservation.doorCode);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyWifi = () => {
    navigator.clipboard?.writeText(`SSID: ${reservation.wifiSsid} | Pass: ${reservation.wifiPass}`);
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  const itineraryDays = [
    {
      day: 'Day 1 · Friday, Nov 14',
      events: [
        { time: '15:00', title: 'Private Keyless Check-in & Smart Lock Entry', note: 'Use digital code 4928# at the charred cedar foyer door.' },
        { time: '17:30', title: 'Sunset Horizon & Hearth Kindling', note: 'Curated birch firewood and matches are set by the sunken hearth.' },
        { time: '19:00', title: 'Hokkaido Natural Wine Welcome', note: 'Local Sommelier bottle chilled in the Gaggenau cellar.' },
      ],
    },
    {
      day: 'Day 2 · Saturday, Nov 15',
      events: [
        { time: '08:30', title: 'Hinoki Cedar Morning Bath Ritual', note: 'Geothermal onsen water freshly circulated at 41°C.' },
        { time: '11:00', title: 'Architectural Tour & Forest Walk', note: 'Explore the Kenzo Tange studio structural cantilevers.' },
        { time: '18:00', title: 'Private Cedar Sauna & Cold Plunge', note: 'Aromatic eucalyptus oils provided in the spa pavilion.' },
      ],
    },
    {
      day: 'Day 3 · Sunday, Nov 16',
      events: [
        { time: '09:30', title: 'Local Soba Artisan Culinary Tasting', note: 'Fresh handmade buckwheat soba delivered to your terrace.' },
        { time: '14:00', title: 'Acoustic Sound Session', note: 'Bang & Olufsen ambient nature soundscapes calibrated to the pavilion.' },
      ],
    },
    {
      day: 'Day 4 · Monday, Nov 17',
      events: [
        { time: '10:00', title: 'Morning Matcha & Farewell Reflections', note: 'Urasenke ceremonial matcha set in the tearoom.' },
        { time: '11:30', title: 'Autonomous Check-out & Departure', note: 'Press lock button on outer keypad upon departure.' },
      ],
    },
  ];

  return (
    <div className="w-full pb-20 bg-[#faf9f5] text-stone-900">
      
      {/* Header Tabs */}
      <div className="sticky top-0 z-20 bg-[#faf9f5]/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-stone-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Your Reserved Escapes
            </h1>
            <p className="text-xs text-stone-500">
              Digital passes, smart access codes, and daily architectural itinerary
            </p>
          </div>

          <div className="flex bg-stone-200/80 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'upcoming' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
              }`}
            >
              Upcoming (1)
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'past' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600'
              }`}
            >
              Past (1)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">

        {activeTab === 'upcoming' ? (
          <>
            {/* ACTIVE PASS LUXURY CARD */}
            <div className="bg-stone-900 text-stone-100 rounded-3xl p-5 sm:p-7 shadow-xl border border-stone-800 relative overflow-hidden">
              {/* Subtle architectural background accent */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-amber-500/10 to-transparent pointer-events-none" />

              {/* Pass Top Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs">
                    PASS
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">
                      Confirmed Reservation
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      #{reservation.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Access Granted</span>
                  </span>
                </div>
              </div>

              {/* Stay Preview Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-5 items-center">
                <div className="md:col-span-8 flex items-center gap-4">
                  <img
                    src={reservation.stay.heroImage}
                    alt={reservation.stay.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-stone-700 shadow-sm shrink-0"
                  />
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90">
                      {reservation.stay.category}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white mt-0.5">
                      {reservation.stay.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" />
                      {reservation.stay.location}, {reservation.stay.country}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-stone-300 mt-2 font-mono">
                      <span>{reservation.nightsCount} Nights</span>
                      <span>·</span>
                      <span>{reservation.guests} Guests</span>
                      <span>·</span>
                      <span>{currencySymbol}{reservation.totalPrice} Paid</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Boarding Stamp */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-stone-950/80 rounded-2xl border border-stone-800 text-center">
                  <div className="bg-white p-2 rounded-xl shadow-xs">
                    <QrCode className="w-16 h-16 text-stone-950" />
                  </div>
                  <span className="text-[10px] font-mono text-stone-400 mt-2 tracking-wider">
                    SCAN AT ENTRANCE GATE
                  </span>
                </div>
              </div>

              {/* Smart Access Bar: Key Code & WiFi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-800">
                {/* Smart Door Code */}
                <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Key className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-stone-400 block font-mono">DIGITAL KEYCODE</span>
                      <span className="text-sm font-mono font-bold tracking-widest text-white">
                        {showCode ? reservation.doorCode : '•••••#'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowCode(!showCode)}
                      className="text-[11px] text-stone-300 hover:text-white px-2 py-1 rounded bg-stone-700 hover:bg-stone-600 transition-colors"
                    >
                      {showCode ? 'Hide' : 'Reveal'}
                    </button>
                    <button
                      onClick={handleCopyKey}
                      className="p-1.5 text-stone-300 hover:text-white rounded bg-stone-700 hover:bg-stone-600 transition-colors"
                      title="Copy Key Code"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* High-Speed Starlink WiFi */}
                <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Wifi className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-stone-400 block font-mono">STARLINK FIBER</span>
                      <span className="text-xs font-mono font-medium text-white truncate max-w-[130px] block">
                        {reservation.wifiSsid}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyWifi}
                    className="flex items-center gap-1 text-[11px] text-stone-300 hover:text-white px-2.5 py-1 rounded bg-stone-700 hover:bg-stone-600 transition-colors"
                  >
                    {copiedWifi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedWifi ? 'Copied' : 'Credentials'}</span>
                  </button>
                </div>
              </div>

              {/* Check-in Times Bar */}
              <div className="mt-4 pt-3 border-t border-stone-800/60 flex flex-wrap items-center justify-between text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Check-in: <strong>Nov 14 (3:00 PM)</strong></span>
                  <span>·</span>
                  <span>Check-out: <strong>Nov 18 (11:00 AM)</strong></span>
                </div>
                <button
                  onClick={() => {
                    onSelectStay(reservation.stay);
                    onNavigate('detail');
                  }}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 mt-1 sm:mt-0"
                >
                  <span>View Full Listing</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* CURATED ITINERARY TIMELINE */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Your Curated Stay Itinerary
                  </h3>
                  <p className="text-xs text-stone-500">
                    Bespoke architecture milestones, wellness sessions, and private tastings
                  </p>
                </div>
                <span className="text-xs font-mono bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md border border-stone-200">
                  4 Days Planned
                </span>
              </div>

              <div className="space-y-6">
                {itineraryDays.map((dayGroup, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 font-mono bg-amber-50/80 px-2.5 py-1 rounded-md inline-block">
                      {dayGroup.day}
                    </h4>

                    <div className="space-y-2 pl-2 border-l-2 border-stone-200 ml-2">
                      {dayGroup.events.map((evt, i) => (
                        <div key={i} className="pl-3 relative group">
                          {/* Timeline dot */}
                          <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-stone-400 group-hover:bg-stone-900 transition-colors" />
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-mono font-bold text-stone-800">
                              {evt.time}
                            </span>
                            <span className="text-xs font-semibold text-stone-900">
                              {evt.title}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {evt.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* PAST TRIPS TAB */
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Completed Stays
            </h3>
            <div className="p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"
                  alt="Villa Caelum"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900">Villa Caelum</h4>
                  <p className="text-xs text-stone-500">Amalfi Coast, Italy · September 2025</p>
                  <span className="text-[11px] text-amber-600 font-medium">★ 5.0 Rated by You</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('explore')}
                className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors"
              >
                Book Again
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
