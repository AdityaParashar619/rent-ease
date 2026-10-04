import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { listingService } from '../services/listingService';
import { aiService } from '../services/aiService';
import { AnyListing } from '../types';
import { useWishlist } from '../store/wishlistContext';
import { useCompare } from '../store/compareContext';
import { RatingStars, TrustBadge, OwnerBrokerBadge } from '../components/common/TrustBadge';
import { BookingModal } from '../components/booking/BookingModal';
import {
  MapPin,
  Heart,
  Scale,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  User,
  Clock,
  Phone,
  MessageSquare,
  AlertCircle,
  Eye,
  Building,
  Car,
  Award,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Camera,
  Navigation,
  Send,
  Compass,
  Bus,
  Train,
  ShoppingCart,
} from 'lucide-react';
import { PLATFORM_FEES } from '../constants';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();

  const [listing, setListing] = useState<AnyListing | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [durationUnits, setDurationUnits] = useState<number>(1);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Groq AI Property Concierge state
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      const res = await listingService.getListingById(id);
      if (res.success && res.data) {
        setListing(res.data);
      }
    };
    fetchListing();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!listing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Listing not found</h2>
          <p className="text-xs text-slate-500">The requested rental asset could not be retrieved.</p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Search</span>
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(listing.id);
  const inCompare = isInCompare(listing.id);

  const basePrice = listing.price * durationUnits;
  const addonCost = includeInsurance ? (listing.category === 'VEHICLE' ? 499 : 1200) : 0;
  const fee = Math.round((basePrice * PLATFORM_FEES.serviceFeePercent) / 100);
  const total = basePrice + addonCost + fee + listing.securityDeposit;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAskAi = async (questionText?: string) => {
    const q = questionText || aiQuestion;
    if (!q.trim()) return;
    setIsAiLoading(true);
    setAiAnswer(null);
    const reply = await aiService.askPropertyAssistant(q, listing);
    setAiAnswer(reply);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors pb-16">
      {/* Breadcrumbs */}
      <div className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 sm:px-6 lg:px-8">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/search?category=${listing.category}`} className="hover:text-indigo-600 capitalize">
            {listing.category.toLowerCase()}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate text-slate-900 dark:text-white font-medium">{listing.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Title & Actions Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <TrustBadge isVerified={listing.isVerified} />
              <OwnerBrokerBadge listerType={listing.listerType} />
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 uppercase">
                {listing.subType.replace('_', ' ')}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {listing.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1 font-medium">
                <MapPin className="h-4 w-4 text-indigo-500" />
                <span>{listing.location.locality}, {listing.location.city}</span>
              </div>
              <span>•</span>
              <RatingStars rating={listing.rating} reviewCount={listing.reviewCount} size="md" />
              <span>•</span>
              <span className="text-slate-500">ID: {listing.id}</span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 self-start">
            <button
              onClick={() => (inCompare ? removeFromCompare(listing.id) : addToCompare(listing))}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                inCompare
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              <Scale className="h-4 w-4" />
              <span>{inCompare ? 'Compared' : 'Compare'}</span>
            </button>

            <button
              onClick={() => toggleWishlist(listing)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                wishlisted
                  ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-400'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
              <span>{wishlisted ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Share2 className="h-4 w-4" />
              <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-4">
          {/* Main Large Image */}
          <div className="relative aspect-16/10 lg:aspect-auto lg:col-span-3 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 max-h-[500px]">
            <img
              src={listing.images[activeImageIndex] || listing.images[0]}
              alt={listing.title}
              className="h-full w-full object-cover"
            />

            {/* Clear distinction: AI Concept vs Verified Real Photo */}
            {listing.imageMetadata?.[activeImageIndex]?.isAiGenerated ? (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-purple-950/90 px-3 py-1 text-xs font-bold text-purple-200 backdrop-blur-md border border-purple-500/40 shadow-lg">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span>AI Architectural Staging / Concept</span>
              </div>
            ) : (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-emerald-950/90 px-3 py-1 text-xs font-bold text-emerald-200 backdrop-blur-md border border-emerald-500/40 shadow-lg">
                <Camera className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Real Photo ({listing.listerType === 'OWNER' ? 'Owner Uploaded' : 'Broker Uploaded'})</span>
              </div>
            )}

            <div className="absolute bottom-3 right-3 rounded-lg bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
              Photo {activeImageIndex + 1} of {listing.images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="grid grid-cols-4 gap-2 lg:grid-cols-1">
            {listing.images.map((img, idx) => {
              const isAi = listing.imageMetadata?.[idx]?.isAiGenerated;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-16/10 overflow-hidden rounded-xl border-2 transition ${
                    activeImageIndex === idx
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                  <span
                    className={`absolute bottom-1 right-1 rounded px-1.5 py-0.5 text-[9px] font-black ${
                      isAi ? 'bg-purple-900/90 text-purple-200' : 'bg-emerald-900/90 text-emerald-200'
                    }`}
                  >
                    {isAi ? 'AI' : 'REAL'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DETAILS & BOOKING SIDEBAR GRID */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left 2 Cols: Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lister Identity & Transparency Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-base">
                    {listing.listerName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {listing.listerName}
                      </h4>
                      <OwnerBrokerBadge listerType={listing.listerType} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <ShieldCheck className="h-3.5 w-3.5" /> Identity Verified
                      </span>
                      <span>•</span>
                      <span>Verified Provider on RentEase</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Calling verified provider ${listing.listerName}: +91 98765 00000`)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
                  >
                    <Phone className="h-3.5 w-3.5 text-slate-500" />
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => alert(`Opening secure messenger with ${listing.listerName}`)}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Chat Securely</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {listing.listerType === 'OWNER' ? 'Zero Commission Guarantee:' : 'Broker Compliance Notice:'}
                </span>{' '}
                {listing.listerType === 'OWNER'
                  ? 'This listing is published directly by the owner. No brokerage fee is applicable under any circumstances.'
                  : 'This broker is certified under platform standards. Standard advisory fees are governed strictly by RentEase terms.'}
              </div>
            </div>

            {/* CATEGORY SPECIFIC SPECIFICATIONS MATRIX */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">
                Asset Specifications & Parameters
              </h3>

              {listing.category === 'RESIDENTIAL' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Bedrooms</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.bedrooms} BHK</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Bathrooms</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.bathrooms} Baths</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Carpet Area</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.carpetAreaSqFt} sq.ft</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Furnishing</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm capitalize">{listing.furnishing.replace('_', ' ').toLowerCase()}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Floor</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">Floor {listing.floorNumber} of {listing.totalFloors}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Maintenance Fee</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">₹{listing.maintenanceMonthly.toLocaleString('en-IN')}/mo</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Gated Society</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.isGatedSociety ? 'Yes (24/7 Security)' : 'No'}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Balconies</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.balconies} Balconies</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Pet Friendly</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.petFriendly ? 'Pets Welcome 🐾' : 'No Pets'}</p>
                  </div>
                </div>
              )}

              {listing.category === 'VEHICLE' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Brand & Model</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.brand} {listing.model}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Manufacturing Year</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.year}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Transmission</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm capitalize">{listing.transmission.toLowerCase()}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Fuel / Energy</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm capitalize">{listing.fuelType.toLowerCase()}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Seating Capacity</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.seats} Passenger Seats</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Daily Km Limit</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.kmIncludedDaily} km/day (Extra: ₹{listing.extraKmCharge}/km)</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Doorstep Delivery</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.doorstepDeliveryAvailable ? 'Available' : 'Pickup at Hub'}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Insurance Status</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.insuranceIncluded ? 'Comprehensive Included' : 'Basic Third-Party'}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Registration Type</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">Commercial Self-Drive</p>
                  </div>
                </div>
              )}

              {listing.category === 'COMMERCIAL' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Carpet Area</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.carpetAreaSqFt} sq.ft</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Seating Capacity</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.seatingCapacity || 'Customizable'} Desks</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Dedicated Parking</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.parkingSpots} Reserved Spots</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Power Backup</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.powerBackup ? '100% DG Backup' : 'Standard'}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Lifts / Elevators</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.passengerLifts} High-speed Lifts</p>
                  </div>
                </div>
              )}

              {listing.category === 'EVENT' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Guest Capacity</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.guestCapacityMin} – {listing.guestCapacityMax} Guests</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Venue Classification</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm capitalize">{listing.venueType.toLowerCase()}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Valet Parking</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.parkingCapacityCars} Cars Capacity</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Catering Policy</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.cateringAllowed ? 'Outside Catering Allowed' : 'In-house Chef Only'}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Music Curfew</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.musicCurfewTime}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Liquor License</span>
                    <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{listing.alcoholPermitted ? 'Permitted (One-day license required)' : 'Not Allowed'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* AMENITIES */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">
                Verified Amenities & Inclusions
              </h3>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{amenity}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-3">
                About this Rental Asset
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {listing.description}
              </p>

              {/* Masked Address Note */}
              <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-indigo-50/60 p-3 text-xs text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                <MapPin className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                <div>
                  <span className="font-semibold">Address & Landmark Privacy:</span>{' '}
                  {listing.location.locality}, {listing.location.city} - {listing.location.pincode}.
                  Exact door number and flat keys are released immediately upon booking confirmation to protect tenant privacy and property security.
                </div>
              </div>
            </div>

            {/* VERIFICATION AND TRUST REPORT */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  RentEase 3-Tier Verification Audit
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Owner/Entity KYC Identity Verification
                    </span>
                  </div>
                  <span className="font-medium text-emerald-600">Passed (Aadhaar & PAN Match)</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Legal Ownership & Title Deed / RC Book Match
                    </span>
                  </div>
                  <span className="font-medium text-emerald-600">Verified & Authenticated</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Physical Inspection & Geolocation Tagging
                    </span>
                  </div>
                  <span className="font-medium text-emerald-600">Inspected by Field Agent</span>
                </div>
              </div>
            </div>

            {/* LOCATION & INTERACTIVE MAP */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    Property Location & Verified Geolocation
                  </h3>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${listing.location.coordinates.lat},${listing.location.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300">
                <p className="font-medium">
                  {listing.location.maskedAddress}
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  {listing.location.locality}, {listing.location.city} - {listing.location.pincode} • Coordinates: {listing.location.coordinates.lat}° N, {listing.location.coordinates.lng}° E
                </p>
              </div>

              {/* Interactive Visual Map View */}
              <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950 shadow-inner">
                {/* SVG Map Grid Background */}
                <div className="absolute inset-0 opacity-40">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="detailMapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.25" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#detailMapGrid)" />
                  </svg>
                </div>

                {/* Radar ripple rings */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="h-32 w-32 animate-ping rounded-full bg-indigo-500/10" />
                  <div className="absolute h-20 w-20 rounded-full border border-indigo-400/30 bg-indigo-500/10" />
                </div>

                {/* Centered Map Pin */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-10">
                  <div className="flex flex-col items-center">
                    <div className="rounded-2xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xl ring-2 ring-white dark:ring-slate-900 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 fill-white" />
                      <span>{listing.location.locality}</span>
                    </div>
                    <div className="h-2 w-2 rotate-45 bg-indigo-600 -mt-1" />
                  </div>
                </div>

                {/* Map Floating Badges */}
                <div className="absolute bottom-3 left-3 rounded-xl bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-800 shadow-md backdrop-blur-xs dark:bg-slate-900/90 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800">
                  📍 Verified GPS Coordinates: {listing.location.coordinates.lat.toFixed(4)}, {listing.location.coordinates.lng.toFixed(4)}
                </div>
              </div>

              {/* Transit & Commute Proximity */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Train className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="font-semibold text-[11px]">Metro Station</span>
                  </div>
                  <span className="mt-1 block font-bold text-slate-800 dark:text-slate-200">~650m (8 mins walk)</span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <ShoppingCart className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="font-semibold text-[11px]">Supermarket</span>
                  </div>
                  <span className="mt-1 block font-bold text-slate-800 dark:text-slate-200">~300m (3 mins walk)</span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Building className="h-3.5 w-3.5 text-blue-500" />
                    <span className="font-semibold text-[11px]">Tech Corridor</span>
                  </div>
                  <span className="mt-1 block font-bold text-slate-800 dark:text-slate-200">~2.8km (12 mins drive)</span>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Bus className="h-3.5 w-3.5 text-purple-500" />
                    <span className="font-semibold text-[11px]">Bus Transit</span>
                  </div>
                  <span className="mt-1 block font-bold text-slate-800 dark:text-slate-200">~150m (2 mins walk)</span>
                </div>
              </div>
            </div>

            {/* GROQ AI RENTAL CONCIERGE & Q&A */}
            <div className="rounded-2xl border border-purple-200/70 bg-linear-to-br from-purple-50/60 to-indigo-50/60 p-6 shadow-xs dark:border-purple-900/50 dark:from-purple-950/20 dark:to-indigo-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    Groq AI Rental Concierge
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                  ⚡ Powered by Groq Llama 3.3
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                Ask instant questions regarding security deposits, lease terms, amenities, or commute for this listing.
              </p>

              {/* Suggested Quick Prompts */}
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  'What is the security deposit & refund timeline?',
                  'Are maintenance charges included in rent?',
                  'What are the society rules regarding pets?',
                  'How far is the nearest metro and supermarket?',
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setAiQuestion(preset);
                      handleAskAi(preset);
                    }}
                    className="rounded-xl border border-purple-200 bg-white/80 px-3 py-1.5 text-[11px] font-medium text-purple-900 hover:bg-purple-100/60 dark:border-purple-800 dark:bg-slate-900 dark:text-purple-200 transition"
                  >
                    💬 {preset}
                  </button>
                ))}
              </div>

              {/* Free-form Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask any question about this property..."
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAskAi();
                  }}
                  className="flex-1 rounded-xl border border-purple-200 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-500 focus:outline-hidden dark:border-purple-800 dark:bg-slate-900 dark:text-white"
                />
                <button
                  onClick={() => handleAskAi()}
                  disabled={isAiLoading || !aiQuestion.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-700 transition disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isAiLoading ? 'Analyzing...' : 'Ask AI'}</span>
                </button>
              </div>

              {/* AI Response Box */}
              {aiAnswer && (
                <div className="rounded-xl border border-purple-200 bg-white p-4 text-xs text-slate-700 shadow-xs dark:border-purple-800 dark:bg-slate-900 dark:text-slate-200 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300 mb-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Groq AI Concierge Answer</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-line">{aiAnswer}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right 1 Col: Transparent Sticky Booking Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-5">
              <div>
                <span className="text-xs text-slate-400">Rental Tariff</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-black text-slate-900 dark:text-white">
                    ₹{listing.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {listing.priceUnit}
                  </span>
                </div>
              </div>

              {/* Duration selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Rental Duration ({listing.priceUnit.replace('/', '')}s)
                </label>
                <div className="mt-1.5 flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={durationUnits}
                    onChange={(e) => setDurationUnits(Math.max(1, Number(e.target.value)))}
                    className="w-20 rounded-xl border border-slate-200 bg-slate-50 p-2 text-center text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <span className="text-xs text-slate-500 font-medium">
                    Total Base: ₹{basePrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Addon Protection toggle */}
              <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-3 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInsurance}
                  onChange={(e) => setIncludeInsurance(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Add Assure Protection (+₹{addonCost})
                  </span>
                  <p className="text-[11px] text-slate-400">Zero deductions on minor wear & tear.</p>
                </div>
              </label>

              {/* Transparent Ledger */}
              <div className="space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Base Rent ({durationUnits} × ₹{listing.price.toLocaleString('en-IN')})</span>
                  <span>₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                {includeInsurance && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Assure Protection Plan</span>
                    <span>₹{addonCost.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Platform Fee ({PLATFORM_FEES.serviceFeePercent}%)</span>
                  <span>₹{fee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Refundable Security Deposit</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    ₹{listing.securityDeposit.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline dark:border-slate-700">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Total Escrow</span>
                  <span className="font-display text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Reserve & Initiate Agreement</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>

              <div className="text-center text-[11px] text-slate-400">
                🔒 Security deposit held in escrow. Zero brokerage.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Stepper Modal */}
      <BookingModal
        listing={listing}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};
