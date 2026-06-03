import { DestinationSummary } from './destination.model';

export interface CircuitSummary {
  id: string;
  title: string;
  slug: string;
  price: number;
  difficulty: 'EASY' | 'MODERATE' | 'HARD' | 'VERY_HARD';
  daysCount: number;
  nightsCount: number;
  category: string;
  coverImage: string;
  region: string;
  featured: boolean;
  averageRating: number;
  reviewCount: number;
}

export interface CircuitDetail extends CircuitSummary {
  description: string;
  shortDescription: string;
  minAge?: number;
  maxAge?: number;
  minParticipants: number;
  maxParticipants: number;
  tags: string[];
  images: string[];
  includes: string[];
  excludes: string[];
  country: string;
  latitude?: number;
  longitude?: number;
  itinerary: ItineraryDay[];
  destination?: DestinationSummary;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string;
  activities?: string;
}

export interface CircuitSearchRequest {
  category?: string;
  difficulty?: string;
  region?: string;
  destinationId?: string;
  minPrice?: number;
  maxPrice?: number;
  minDays?: number;
  maxDays?: number;
  search?: string;
  page?: number;
  size?: number;
}

export interface DepartureDate {
  id: string;
  departureDate: string;
  returnDate: string;
  minParticipants: number;
  maxParticipants: number;
  availableSpots: number;
  status: 'OPEN' | 'FULL' | 'WAITLIST' | 'CLOSED';
  season: 'HIGH' | 'LOW' | 'NORMAL';
  priceOverride?: number;
}
