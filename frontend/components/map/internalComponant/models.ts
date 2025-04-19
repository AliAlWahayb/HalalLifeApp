export interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'fully_halal' | 'partially_halal' | 'seafood';
  rating: number;
  price_level: number;
  hours: string;
  phone: string;
  website: string;
  description: string;
  photo_url: string;
}

// Mock data for halal restaurants
export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Halal Guys',
    address: '123 Main St, New York, NY 10001',
    latitude: 40.7128,
    longitude: -74.0060,
    status: 'fully_halal',
    rating: 4.5,
    price_level: 2, // $$ out of $$$$
    hours: 'Open: 10:00 AM - 10:00 PM',
    phone: '+1-555-123-4567',
    website: 'https://thehalalguys.com',
    description: 'American halal food restaurant chain specializing in chicken, gyros, and falafel.',
    photo_url: 'https://example.com/photo1.jpg',
  },
  {
    id: '2',
    name: 'Sababa Mediterranean Grill',
    address: '456 Broadway, New York, NY 10012',
    latitude: 40.7193,
    longitude: -74.0020,
    status: 'partially_halal',
    rating: 4.2,
    price_level: 2,
    hours: 'Open: 11:00 AM - 9:00 PM',
    phone: '+1-555-765-4321',
    website: 'https://sababagrill.com',
    description: 'Mediterranean restaurant with both halal and non-halal options clearly labeled.',
    photo_url: 'https://example.com/photo2.jpg',
  },
  {
    id: '3',
    name: 'Ocean Treasures',
    address: '789 Canal St, New York, NY 10013',
    latitude: 40.7170,
    longitude: -74.0080,
    status: 'seafood',
    rating: 4.7,
    price_level: 3,
    hours: 'Open: 12:00 PM - 11:00 PM',
    phone: '+1-555-987-6543',
    website: 'https://oceantreasures.com',
    description: 'Seafood restaurant with fresh daily catches. All seafood options are halal-friendly.',
    photo_url: 'https://example.com/photo3.jpg',
  },
  {
    id: '4',
    name: 'Kebab Express',
    address: '321 5th Ave, New York, NY 10016',
    latitude: 40.7234,
    longitude: -73.9890,
    status: 'fully_halal',
    rating: 4.0,
    price_level: 1,
    hours: 'Open: 10:00 AM - 12:00 AM',
    phone: '+1-555-234-5678',
    website: 'https://kebabexpress.com',
    description: 'Fast and delicious halal kebabs and Middle Eastern cuisine.',
    photo_url: 'https://example.com/photo4.jpg',
  },
  {
    id: '5',
    name: 'Saffron House',
    address: '567 Madison Ave, New York, NY 10022',
    latitude: 40.7308,
    longitude: -73.9772,
    status: 'partially_halal',
    rating: 4.6,
    price_level: 3,
    hours: 'Open: 5:00 PM - 10:30 PM',
    phone: '+1-555-876-5432',
    website: 'https://saffronhouse.com',
    description: 'Upscale Indian restaurant with halal meat options available upon request.',
    photo_url: 'https://example.com/photo5.jpg',
  },
]; 