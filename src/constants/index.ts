export const APP_NAME = 'RentEase';
export const APP_TAGLINE = 'Everything You Need to Rent. One Secure Place.';
export const APP_SUBTAGLINE = 'Find. Verify. Rent.';

export const LAUNCH_CITY = 'Bengaluru';

export const CITIES_DATA = [
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    status: 'ACTIVE' as const,
    listingCount: 420,
    localities: [
      'Indiranagar',
      'Koramangala',
      'Whitefield',
      'HSR Layout',
      'MG Road',
      'JP Nagar',
      'Electronic City',
      'Bellandur',
      'Marathahalli',
      'Hebbal'
    ],
    badge: 'Launch City',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    status: 'COMING_SOON' as const,
    listingCount: 0,
    localities: ['Bandra', 'Andheri West', 'Powai', 'Worli', 'Juhu'],
    badge: 'Coming Q4 2026',
  },
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    state: 'Delhi',
    status: 'COMING_SOON' as const,
    listingCount: 0,
    localities: ['Cyber City Gurgaon', 'South Ex', 'Noida Sec 62', 'Connaught Place'],
    badge: 'Coming Q1 2027',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    status: 'COMING_SOON' as const,
    listingCount: 0,
    localities: ['Hitec City', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills'],
    badge: 'Coming Q1 2027',
  },
];

export const CATEGORIES_CONFIG = [
  {
    id: 'RESIDENTIAL',
    label: 'Residential',
    shortLabel: 'Homes & PGs',
    description: 'Flats, Independent Villas, Studio Rooms, and Verified PGs',
    icon: 'Home',
    unit: '/month',
    countText: '240+ Active Listings',
    gradient: 'from-blue-600 to-indigo-700',
    types: ['FLAT', 'APARTMENT', 'HOUSE', 'ROOM', 'PG', 'HOSTEL'],
  },
  {
    id: 'VEHICLE',
    label: 'Vehicles',
    shortLabel: 'Cars & Bikes',
    description: 'Self-drive cars, sport bikes, and clean electric scooters',
    icon: 'Car',
    unit: '/day',
    countText: '95+ Available Rides',
    gradient: 'from-amber-600 to-orange-600',
    types: ['CAR', 'BIKE', 'SCOOTER'],
  },
  {
    id: 'COMMERCIAL',
    label: 'Commercial',
    shortLabel: 'Offices & Shops',
    description: 'High-footfall retail shops, corporate offices, and hot-desks',
    icon: 'Briefcase',
    unit: '/month',
    countText: '50+ Workspaces',
    gradient: 'from-emerald-600 to-teal-700',
    types: ['SHOP', 'OFFICE', 'COWORKING', 'WAREHOUSE'],
  },
  {
    id: 'EVENT',
    label: 'Events & Venues',
    shortLabel: 'Banquet & Gardens',
    description: 'Marriage gardens, luxury banquet halls, and farmhouses',
    icon: 'Sparkles',
    unit: '/event',
    countText: '35+ Premier Venues',
    gradient: 'from-purple-600 to-pink-600',
    types: ['MARRIAGE_GARDEN', 'BANQUET_HALL', 'PARTY_HALL', 'FARMHOUSE', 'CONFERENCE_HALL'],
  },
];

export const DESKTOP_SHORTCUTS = [
  { key: 'Ctrl/⌘ + K', description: 'Open Quick Command & Search Palette' },
  { key: 'Ctrl/⌘ + B', description: 'Quick jump to My Bookings' },
  { key: 'Ctrl/⌘ + D', description: 'Toggle Dark / Light Mode' },
  { key: 'Ctrl/⌘ + S', description: 'Jump to Saved Wishlist' },
  { key: 'Ctrl/⌘ + /', description: 'Show Keyboard Shortcuts' },
  { key: 'Esc', description: 'Close any active modal or drawer' },
];

export const PLATFORM_FEES = {
  serviceFeePercent: 4.5,
  gstTaxPercent: 18, // standard GST on service fee
  securityDepositMultiplier: 1.0,
};

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api';
