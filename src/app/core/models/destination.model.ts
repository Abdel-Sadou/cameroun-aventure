export interface DestinationSummary {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string;
  coverImage: string;
  circuitsCount: number;
}

export interface DestinationDetail extends DestinationSummary {
  description: string;
  practicalInfo?: string;
  bestTimeToVisit?: string;
  images: string[];
  latitude?: number;
  longitude?: number;
}
