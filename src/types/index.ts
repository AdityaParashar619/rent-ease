export type PlatformRole = 'CUSTOMER' | 'PROVIDER' | 'BROKER' | 'ADMIN';

export type RentalCategory = 'RESIDENTIAL' | 'VEHICLE' | 'COMMERCIAL' | 'EVENT';

export type ResidentialType = 'FLAT' | 'APARTMENT' | 'HOUSE' | 'ROOM' | 'PG' | 'HOSTEL';
export type VehicleType = 'CAR' | 'BIKE' | 'SCOOTER';
export type CommercialType = 'SHOP' | 'OFFICE' | 'COWORKING' | 'WAREHOUSE';
export type EventVenueType = 'MARRIAGE_GARDEN' | 'BANQUET_HALL' | 'PARTY_HALL' | 'FARMHOUSE' | 'CONFERENCE_HALL' | 'EVENT_VENUE';

export type ListerType = 'OWNER' | 'BROKER';

export type ListingStatus = 
  | 'DRAFT' 
  | 'PENDING_VERIFICATION' 
  | 'ACTIVE' 
  | 'REJECTED' 
  | 'SUSPENDED' 
  | 'TEMPORARILY_UNAVAILABLE';

export type BookingStatus =
  | 'REQUESTED'
  | 'PENDING'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'DISPUTED';

export type PaymentStatus = 'SUCCESSFUL' | 'PENDING' | 'FAILED' | 'REFUNDED';

export type VerificationStatus = 'NOT_STARTED' | 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'NEEDS_ATTENTION';

export type DisputeStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'ADDITIONAL_INFO_REQUIRED' | 'RESOLVED' | 'CLOSED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: PlatformRole;
  avatarUrl?: string;
  isVerified: boolean;
  memberSince: string;
  trustScore?: number;
  completedRentals?: number;
  responseRate?: number;
  responseTime?: string;
}

export interface LocationAddress {
  city: string;
  locality: string;
  landmark?: string;
  pincode: string;
  // Exact street is masked for privacy prior to confirmed booking
  maskedAddress: string;
  fullAddress?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface BaseListing {
  id: string;
  title: string;
  description: string;
  category: RentalCategory;
  listerType: ListerType;
  listerId: string;
  listerName: string;
  listerPhone?: string;
  listerRating: number;
  listerVerified: boolean;
  location: LocationAddress;
  price: number;
  priceUnit: '/month' | '/day' | '/event' | '/seat/mo' | '/sqft/mo';
  securityDeposit: number;
  images: string[];
  imageMetadata?: { url: string; isAiGenerated?: boolean; caption?: string }[];
  status: ListingStatus;
  isVerified: boolean;
  verifiedDate?: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  createdAt: string;
}

export interface ResidentialListing extends BaseListing {
  category: 'RESIDENTIAL';
  subType: ResidentialType;
  bedrooms: number;
  bathrooms: number;
  furnishing: 'FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';
  carpetAreaSqFt: number;
  genderPreference?: 'ANY' | 'MALE' | 'FEMALE';
  foodIncluded?: boolean;
  amenities: string[]; // e.g. 'Wi-Fi', 'AC', 'Power Backup', 'Parking', 'Balcony', 'Pet Friendly', 'Lift'
  availableFrom: string;
  maintenanceMonthly?: number;
  isGatedSociety?: boolean;
  balconies?: number;
  petFriendly?: boolean;
  floorNumber?: number;
  totalFloors?: number;
}

export interface VehicleListing extends BaseListing {
  category: 'VEHICLE';
  subType: VehicleType;
  brand: string;
  model: string;
  year: number;
  transmission: 'AUTOMATIC' | 'MANUAL';
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  seats: number;
  mileageLimitKmPerDay?: number;
  deliveryAvailable: boolean;
  helmetIncluded?: boolean;
  documentsVerified: boolean;
  features: string[]; // e.g. 'GPS Navigation', 'Bluetooth', 'Airbags', 'Fastag', 'Helmets (2)'
}

export interface CommercialListing extends BaseListing {
  category: 'COMMERCIAL';
  subType: CommercialType;
  carpetAreaSqFt: number;
  seatingCapacity?: number;
  cabins?: number;
  meetingRooms?: number;
  parkingSpots: number;
  amenities: string[]; // e.g. 'High-speed Fiber', 'Power Backup', 'Pantry', 'Conference Room', 'Security Guard', '24/7 Access'
}

export interface EventListing extends BaseListing {
  category: 'EVENT';
  subType: EventVenueType;
  guestCapacityMin: number;
  guestCapacityMax: number;
  venueType: 'INDOOR' | 'OUTDOOR' | 'BOTH';
  roomsAvailable: number;
  parkingCapacityCars: number;
  amenities: string[]; // e.g. 'Stage', 'DJ & Sound Setup', 'Catering Area', 'Bridal Dressing Room', 'Green Lawn', 'Generator Backup'
}

export type AnyListing = ResidentialListing | VehicleListing | CommercialListing | EventListing;

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingCategory: RentalCategory;
  listingImage: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  providerId: string;
  providerName: string;
  startDate: string;
  endDate: string;
  durationString: string;
  baseAmount: number;
  serviceFee: number;
  securityDeposit: number;
  taxes: number;
  discountAmount: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'BANK_TRANSFER';
  transactionId: string;
  createdAt: string;
  notes?: string;
  checkInInstructions?: string;
  agreementUrl?: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  listingTitle: string;
  amount: number;
  date: string;
  paymentMethod: string;
  transactionId: string;
  status: PaymentStatus;
  receiptUrl?: string;
  refundAmount?: number;
}

export interface Review {
  id: string;
  listingId: string;
  bookingId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  categoryRatings: {
    cleanlinessOrCondition: number;
    accuracy: number;
    communication: number;
    valueForMoney: number;
  };
}

export interface Dispute {
  id: string;
  bookingId: string;
  listingTitle: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  disputeType: 'PROPERTY_DAMAGE' | 'MISREPRESENTATION' | 'CANCELLATION_REFUND' | 'SECURITY_DEPOSIT' | 'SAFETY_CONCERN' | 'OTHER';
  subject: string;
  description: string;
  evidenceUrls: string[];
  status: DisputeStatus;
  createdAt: string;
  updatedAt: string;
  timeline: {
    title: string;
    timestamp: string;
    by: string;
    description: string;
  }[];
}

export interface VerificationItem {
  id: string;
  title: string;
  description: string;
  category: 'MOBILE' | 'EMAIL' | 'IDENTITY_AADHAAR' | 'PROPERTY_DEED' | 'VEHICLE_RC' | 'VENUE_LICENSE';
  status: VerificationStatus;
  lastUpdated: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'PAYMENT' | 'VERIFICATION' | 'MESSAGE' | 'SECURITY' | 'DISPUTE';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachmentName?: string;
}

export interface Conversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerRole: string;
  partnerAvatar?: string;
  listingId?: string;
  listingTitle?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface SearchFiltersState {
  city: string;
  category: RentalCategory | 'ALL';
  locality?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  listerType?: 'ALL' | 'OWNER' | 'BROKER';
  verifiedOnly?: boolean;
  minRating?: number;
  // Residential specific
  resType?: ResidentialType | 'ALL';
  bedrooms?: number | 'ANY';
  furnishing?: string | 'ANY';
  // Vehicle specific
  vehType?: VehicleType | 'ALL';
  transmission?: string | 'ANY';
  fuelType?: string | 'ANY';
  // Commercial specific
  comType?: CommercialType | 'ALL';
  // Event specific
  eventType?: EventVenueType | 'ALL';
  minCapacity?: number;
  // Sort
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}
