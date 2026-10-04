import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../store/compareContext';
import { TrustBadge, OwnerBrokerBadge, RatingStars } from '../components/common/TrustBadge';
import { X, Trash2, ArrowLeft, Check, Plus, ExternalLink } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-slate-900 dark:text-white">
          No Listings in Comparison Queue
        </h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Add up to 4 listings of the same category while browsing to compare specifications, security deposits, and amenities side-by-side.
        </p>
        <div className="mt-6">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Listings</span>
          </Link>
        </div>
      </div>
    );
  }

  const category = compareItems[0].category;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 uppercase">
              {category} Comparison
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">
              Side-by-Side Asset Comparison
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparing {compareItems.length} selected options. Max 4 items allowed.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All</span>
            </button>
            <Link
              to={`/search?category=${category}`}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Another {category}</span>
            </Link>
          </div>
        </div>

        {/* COMPARISON MATRIX TABLE */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="w-48 p-4 font-bold uppercase tracking-wider text-slate-400 bg-white dark:bg-slate-900 sticky left-0 z-10 shadow-xs">
                  Attribute
                </th>
                {compareItems.map((item) => (
                  <th key={item.id} className="min-w-[260px] p-4 font-normal">
                    <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                      <button
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-400"
                        title="Remove"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="aspect-16/10 w-full rounded-xl object-cover mb-2"
                      />
                      <div className="line-clamp-1 font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                          ₹{item.price.toLocaleString('en-IN')} {item.priceUnit}
                        </span>
                        <Link
                          to={`/listing/${item.id}`}
                          className="flex items-center gap-0.5 text-slate-600 hover:text-indigo-600 dark:text-slate-300 font-medium"
                        >
                          <span>View</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {/* Lister Type */}
              <tr>
                <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                  Lister Type
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4">
                    <OwnerBrokerBadge listerType={item.listerType} />
                  </td>
                ))}
              </tr>

              {/* Verification */}
              <tr>
                <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                  Verification Status
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4">
                    <TrustBadge isVerified={item.isVerified} />
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                  Rating & Reviews
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4">
                    <RatingStars rating={item.rating} reviewCount={item.reviewCount} />
                  </td>
                ))}
              </tr>

              {/* Locality */}
              <tr>
                <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                  Locality
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 font-medium text-slate-700 dark:text-slate-300">
                    {item.location.locality}, {item.location.city}
                  </td>
                ))}
              </tr>

              {/* Refundable Security Deposit */}
              <tr>
                <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                  Security Deposit
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 font-bold text-slate-900 dark:text-white">
                    ₹{item.securityDeposit.toLocaleString('en-IN')}
                  </td>
                ))}
              </tr>

              {/* CATEGORY SPECIFIC ROWS */}
              {category === 'RESIDENTIAL' && (
                <>
                  <tr>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                      Bedrooms / BHK
                    </td>
                    {compareItems.map((item: any) => (
                      <td key={item.id} className="p-4 font-semibold">
                        {item.bedrooms} BHK ({item.bathrooms} Baths)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                      Carpet Area
                    </td>
                    {compareItems.map((item: any) => (
                      <td key={item.id} className="p-4">
                        {item.carpetAreaSqFt} sq.ft
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                      Furnishing
                    </td>
                    {compareItems.map((item: any) => (
                      <td key={item.id} className="p-4 capitalize">
                        {item.furnishing.replace('_', ' ').toLowerCase()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                      Monthly Maintenance
                    </td>
                    {compareItems.map((item: any) => (
                      <td key={item.id} className="p-4">
                        ₹{item.maintenanceMonthly.toLocaleString('en-IN')}/mo
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                      Gated Society
                    </td>
                    {compareItems.map((item: any) => (
                      <td key={item.id} className="p-4 font-medium">
                        {item.isGatedSociety ? 'Yes (24/7 Guards)' : 'No'}
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {category === 'VEHICLE' && (
                <>
                  <tr>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                      Brand & Model
                    </td>
                    {compareItems.map((item: any) => (
                      <td key={item.id} className="p-4 font-bold">
                        {item.brand} {item.model} ({item.year})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                      Transmission & Fuel
                    </td>
                    {compareItems.map((item: any) => (
                      <td key={item.id} className="p-4 capitalize">
                        {item.transmission.toLowerCase()} • {item.fuelType.toLowerCase()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                      Seating Capacity
                    </td>
                    {compareItems.map((item: any) => (
                      <td key={item.id} className="p-4">
                        {item.seats} Seats
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                      Daily Km Allowance
                    </td>
                    {compareItems.map((item: any) => (
                      <td key={item.id} className="p-4">
                        {item.kmIncludedDaily} km/day (Extra: ₹{item.extraKmCharge}/km)
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {/* Amenities */}
              <tr>
                <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                  Key Amenities
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {item.amenities.slice(0, 4).map((a, i) => (
                        <span
                          key={i}
                          className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Booking CTA Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 sticky left-0 z-10">
                  Action
                </td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4">
                    <Link
                      to={`/listing/${item.id}`}
                      className="block w-full rounded-xl bg-indigo-600 py-2 text-center text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition"
                    >
                      Book This {item.category}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
