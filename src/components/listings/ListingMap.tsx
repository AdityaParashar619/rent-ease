import React, { useState } from 'react';
import { AnyListing } from '../../types';
import { MapPin, Navigation, Eye, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ListingMap: React.FC<{ listings: AnyListing[] }> = ({ listings }) => {
  const [selectedListing, setSelectedListing] = useState<AnyListing | null>(listings[0] || null);
  const [zoomLevel, setZoomLevel] = useState<number>(13);

  // Map pin placement normalization based on Bengaluru coordinates approx 12.85 to 13.05 Lat, 77.55 to 77.75 Lng
  const minLat = 12.88;
  const maxLat = 13.02;
  const minLng = 77.54;
  const maxLng = 77.76;

  const getPositionStyle = (lat: number, lng: number) => {
    const topPercent = Math.max(8, Math.min(88, ((maxLat - lat) / (maxLat - minLat)) * 100));
    const leftPercent = Math.max(8, Math.min(88, ((lng - minLng) / (maxLng - minLng)) * 100));
    return { top: `${topPercent}%`, left: `${leftPercent}%` };
  };

  return (
    <div className="relative h-[650px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner dark:border-slate-800 dark:bg-slate-900">
      {/* Abstract Map Background Grid & Roads Pattern */}
      <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mapGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#94a3b8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
          {/* Simulated arterial road curves */}
          <path
            d="M 50 120 Q 300 240 700 180 T 1200 450"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 100 550 Q 400 350 900 400 T 1400 150"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Top Map Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-xl bg-white/90 p-1.5 shadow-md backdrop-blur-md dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-1 px-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <Navigation className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Interactive Map • Bengaluru</span>
        </div>
        <span className="text-xs text-slate-300 dark:text-slate-700">|</span>
        <span className="px-1 text-xs text-slate-500 font-medium">
          {listings.length} Pins Available
        </span>
      </div>

      {/* Zoom Control Buttons */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1 rounded-xl bg-white/90 p-1 shadow-md backdrop-blur-md dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 1, 16))}
          className="h-7 w-7 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
          className="h-7 w-7 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          title="Zoom Out"
        >
          −
        </button>
      </div>

      {/* Locality Quick Jump Chips */}
      <div className="absolute top-4 right-4 z-20 hidden md:flex items-center gap-1.5 overflow-x-auto rounded-xl bg-white/85 p-1.5 shadow-md backdrop-blur-md dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 text-xs">
        {['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'MG Road'].map((loc) => (
          <span
            key={loc}
            className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {loc}
          </span>
        ))}
      </div>

      {/* Map Pins */}
      {listings.map((item) => {
        const isSelected = selectedListing?.id === item.id;
        const coords = item.location.coordinates || { lat: 12.97, lng: 77.62 };
        const pos = getPositionStyle(coords.lat, coords.lng);

        return (
          <div
            key={item.id}
            style={pos}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <button
              onClick={() => setSelectedListing(item)}
              className={`group flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95 ${
                isSelected
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30'
                  : 'bg-white text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <MapPin className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
              <span>₹{(item.price >= 1000 ? `${(item.price / 1000).toFixed(0)}k` : item.price)}</span>
            </button>
          </div>
        );
      })}

      {/* Selected Listing Card Preview Overlay */}
      {selectedListing && (
        <div className="absolute bottom-6 left-6 z-30 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-bottom-3 duration-200">
          <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-100">
            <img
              src={selectedListing.images[0]}
              alt={selectedListing.title}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur-xs hover:bg-slate-900"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <span className="absolute bottom-2 left-2 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
              {selectedListing.category}
            </span>
          </div>

          <div className="p-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {selectedListing.location.locality}
              </span>
              <div className="flex items-center gap-0.5 text-amber-500 font-semibold">
                <Star className="h-3 w-3 fill-amber-400" />
                <span>{selectedListing.rating}</span>
              </div>
            </div>

            <h4 className="mt-1 line-clamp-1 text-sm font-bold text-slate-900 dark:text-white">
              {selectedListing.title}
            </h4>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800">
              <div>
                <span className="font-display text-sm font-extrabold text-slate-900 dark:text-white">
                  ₹{selectedListing.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">{selectedListing.priceUnit}</span>
              </div>

              <Link
                to={`/listing/${selectedListing.id}`}
                className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700 transition"
              >
                <Eye className="h-3 w-3" />
                <span>Details</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
