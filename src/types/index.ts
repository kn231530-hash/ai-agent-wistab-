export interface Amenity {
  id: string;
  name: string;
  category: 'wellness' | 'architecture' | 'comfort' | 'culinary' | 'connectivity';
  icon: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
  location: string;
}

export interface ArchitectInfo {
  name: string;
  studio: string;
  yearBuilt: number;
  philosophy: string;
  awards: string[];
}

export interface Stay {
  id: string;
  title: string;
  tagline: string;
  category: 'Architectural Icons' | 'Nordic Cabins' | 'Cliffside Villas' | 'Desert Sanctuaries' | 'Zen Retreats';
  location: string;
  country: string;
  coordinates: { lat: number; lng: number };
  pricePerNight: number;
  cleaningFee: number;
  serviceFeeRate: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  images: string[];
  heroImage: string;
  description: string;
  architect: ArchitectInfo;
  host: {
    name: string;
    avatar: string;
    title: string;
    joinedYear: number;
    responseRate: string;
    isSuperhost: boolean;
  };
  amenities: Amenity[];
  features: string[];
  reviews: Review[];
  featured?: boolean;
}

export interface Reservation {
  id: string;
  stayId: string;
  stay: Stay;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  addons: {
    id: string;
    name: string;
    price: number;
  }[];
  totalPrice: number;
  nightlyTotal: number;
  nightsCount: number;
  taxesAndFees: number;
  doorCode: string;
  wifiSsid: string;
  wifiPass: string;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  guestName: string;
  guestEmail: string;
}

export type ScreenType = 'explore' | 'detail' | 'trips' | 'checkout' | 'wishlist' | 'host';
export type ViewMode = 'mobile' | 'desktop' | 'canvas';
