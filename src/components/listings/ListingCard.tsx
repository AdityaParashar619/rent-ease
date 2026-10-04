import React from 'react';
import { Link } from 'react-router-dom';
import { AnyListing } from '../../types';
import { useWishlist } from '../../store/wishlistContext';
import { useCompare } from '../../store/compareContext';
import { RatingStars, TrustBadge, OwnerBrokerBadge } from '../common/TrustBadge';
import { Heart, MapPin, Scale, Check } from 'lucide-react';

export const ListingCard: React.FC<{ listing: AnyListing }> = ({ listing }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const wishlisted = isWishlisted(listing.id);
  const inCompare = isInCompare(listing.id);

  // Format key attribute string according to category
  const renderKeyAttributes = () => {
    switch (listing.category) {
      case 'RESIDENTIAL': {
        return (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{listing.bedrooms} Beds</span>
            <span>•</span>
            <span>{listing.bathrooms} Baths</span>
            <span>•</span>
            <span>{listing.carpetAreaSqFt} sq.ft</span>
            <span>•</span>
            <span className="capitalize">{listing.furnishing.replace('_', ' ').toLowerCase()}</span>
          </div>
        );
      }
      case 'VEHICLE': {
        return (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{listing.brand}</span>
            <span>•</span>
            <span className="capitalize">{listing.transmission.toLowerCase()}</span>
            <span>•</span>
            <span className="capitalize">{listing.fuelType.toLowerCase()}</span>
            <span>•</span>
            <span>{listing.seats} Seats</span>
          </div>
        );
      }
      case 'COMMERCIAL': {
        return (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{listing.carpetAreaSqFt} sq.ft</span>
            {listing.seatingCapacity && (
              <>
                <span>•</span>
                <span>{listing.seatingCapacity} Desks</span>
              </>
            )}
            <span>•</span>
            <span>{listing.parkingSpots} Parks</span>
          </div>
        );
      }
      case 'EVENT': {
        return (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{listing.guestCapacityMin}–{listing.guestCapacityMax} Guests</span>
            <span>•</span>
            <span className="capitalize">{listing.venueType.toLowerCase()}</span>
            <span>•</span>
            <span>{listing.parkingCapacityCars} Cars Valet</span>
          </div>
        );
      }
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(listing.id);
    } else {
      addToCompare(listing);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(listing);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      {/* Image Thumbnail Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link to={`/listing/${listing.id}`}>
          <img
            src={listing.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80'}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
            loading="lazy"
          />
        </Link>

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
          <TrustBadge isVerified={listing.isVerified} compact />
          <OwnerBrokerBadge listerType={listing.listerType} />
        </div>

        {/* Top Right Wishlist & Compare Buttons */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {/* Quick Compare button */}
          <button
            onClick={handleCompareClick}
            className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md shadow-xs transition ${
              inCompare
                ? 'bg-indigo-600 text-white'
                : 'bg-white/85 text-slate-700 hover:bg-white dark:bg-slate-900/85 dark:text-slate-200'
            }`}
            title={inCompare ? 'Remove from Comparison' : 'Add to Compare'}
          >
            {inCompare ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md shadow-xs transition ${
              wishlisted
                ? 'bg-rose-50 text-rose-500'
                : 'bg-white/85 text-slate-700 hover:bg-white dark:bg-slate-900/85 dark:text-slate-200'
            }`}
            title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart
              className={`h-4 w-4 transition-transform duration-150 ${
                wishlisted ? 'fill-rose-500 scale-110' : ''
              }`}
            />
          </button>
        </div>

        {/* Sub-Category Pill */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="rounded-md bg-slate-900/75 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-xs">
            {listing.subType.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating and Locality */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="truncate font-medium">{listing.location.locality}, {listing.location.city}</span>
          </div>
          <RatingStars rating={listing.rating} reviewCount={listing.reviewCount} />
        </div>

        {/* Title */}
        <Link to={`/listing/${listing.id}`} className="mt-2 block">
          <h3 className="line-clamp-1 text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            {listing.title}
          </h3>
        </Link>

        {/* Category Key Specs */}
        <div className="mt-2 flex-1">
          {renderKeyAttributes()}
        </div>

        {/* Price & Booking Footer */}
        <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                ₹{listing.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {listing.priceUnit}
              </span>
            </div>
          </div>

          <Link
            to={`/listing/${listing.id}`}
            className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-indigo-600 dark:hover:text-white"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
};
