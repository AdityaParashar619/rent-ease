import React from 'react';
import { SearchFiltersState, RentalCategory, ListerType } from '../../types';
import { Filter, RotateCcw, Check, User, Briefcase } from 'lucide-react';
import { CITIES_DATA } from '../../constants';

interface ListingFiltersProps {
  filters: SearchFiltersState;
  onChange: (filters: SearchFiltersState) => void;
  onReset: () => void;
}

export const ListingFilters: React.FC<ListingFiltersProps> = ({ filters, onChange, onReset }) => {
  const activeCityData = CITIES_DATA.find((c) => c.name.toLowerCase() === filters.city.toLowerCase()) || CITIES_DATA[0];

  const update = (partial: Partial<SearchFiltersState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <aside className="w-full space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Category
        </label>
        <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs font-medium">
          {[
            { id: 'ALL', label: 'All Categories' },
            { id: 'RESIDENTIAL', label: 'Residential' },
            { id: 'VEHICLE', label: 'Vehicles' },
            { id: 'COMMERCIAL', label: 'Commercial' },
            { id: 'EVENT', label: 'Events & Venues' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => update({ category: cat.id as RentalCategory | 'ALL' })}
              className={`rounded-lg px-2.5 py-1.5 text-left transition ${
                filters.category === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Locality Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Locality ({filters.city})
        </label>
        <select
          value={filters.locality || 'ALL'}
          onChange={(e) => update({ locality: e.target.value === 'ALL' ? undefined : e.target.value })}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="ALL">All Localities</option>
          {activeCityData.localities.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Owner vs Broker Transparency Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Lister Model
        </label>
        <div className="mt-2 flex rounded-xl border border-slate-200 p-1 dark:border-slate-800">
          <button
            onClick={() => update({ listerType: 'ALL' })}
            className={`flex-1 rounded-lg py-1.5 text-center text-xs font-medium transition ${
              filters.listerType === 'ALL' || !filters.listerType
                ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            All
          </button>
          <button
            onClick={() => update({ listerType: 'OWNER' })}
            className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-center text-xs font-medium transition ${
              filters.listerType === 'OWNER'
                ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <User className="h-3 w-3" />
            Owner
          </button>
          <button
            onClick={() => update({ listerType: 'BROKER' })}
            className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-center text-xs font-medium transition ${
              filters.listerType === 'BROKER'
                ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Briefcase className="h-3 w-3" />
            Broker
          </button>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Max Price
          </label>
          <span className="font-bold text-slate-900 dark:text-white">
            {filters.maxPrice ? `₹${filters.maxPrice.toLocaleString('en-IN')}` : 'Any Price'}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="250000"
          step="1000"
          value={filters.maxPrice || 250000}
          onChange={(e) => update({ maxPrice: Number(e.target.value) })}
          className="mt-2 w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>₹500</span>
          <span>₹2.5 Lakhs</span>
        </div>
      </div>

      {/* Verified Only Toggle */}
      <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Verified Listings Only
          </span>
          <p className="text-[11px] text-slate-400">Documents & title verified</p>
        </div>
        <button
          onClick={() => update({ verifiedOnly: !filters.verifiedOnly })}
          className={`h-5 w-9 rounded-full transition-colors relative ${
            filters.verifiedOnly ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
              filters.verifiedOnly ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* CATEGORY SPECIFIC FILTERS */}
      {filters.category === 'RESIDENTIAL' && (
        <div className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Residential Options
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Bedrooms (BHK)
            </label>
            <div className="mt-1.5 flex gap-1.5">
              {['ANY', 1, 2, 3, 4].map((bhk) => (
                <button
                  key={String(bhk)}
                  onClick={() => update({ bedrooms: bhk as number | 'ANY' })}
                  className={`flex-1 rounded-lg py-1 text-xs font-medium ${
                    filters.bedrooms === bhk || (!filters.bedrooms && bhk === 'ANY')
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {bhk === 'ANY' ? 'Any' : `${bhk} BHK`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Property Type
            </label>
            <select
              value={filters.resType || 'ALL'}
              onChange={(e) => update({ resType: e.target.value as any })}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Residential Types</option>
              <option value="APARTMENT">Apartment / Gated Community</option>
              <option value="FLAT">Independent Flat</option>
              <option value="HOUSE">Villa / Independent House</option>
              <option value="PG">Co-Living / PG</option>
            </select>
          </div>
        </div>
      )}

      {filters.category === 'VEHICLE' && (
        <div className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Vehicle Options
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Vehicle Type
            </label>
            <div className="mt-1.5 flex gap-1.5">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'CAR', label: 'Car' },
                { id: 'BIKE', label: 'Bike' },
                { id: 'SCOOTER', label: 'EV/Scooter' },
              ].map((vt) => (
                <button
                  key={vt.id}
                  onClick={() => update({ vehType: vt.id as any })}
                  className={`flex-1 rounded-lg py-1 text-xs font-medium ${
                    filters.vehType === vt.id || (!filters.vehType && vt.id === 'ALL')
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {vt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              Transmission
            </label>
            <div className="mt-1.5 flex gap-1.5">
              {['ANY', 'AUTOMATIC', 'MANUAL'].map((tr) => (
                <button
                  key={tr}
                  onClick={() => update({ transmission: tr })}
                  className={`flex-1 rounded-lg py-1 text-xs font-medium ${
                    filters.transmission === tr || (!filters.transmission && tr === 'ANY')
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {tr === 'ANY' ? 'Any' : tr === 'AUTOMATIC' ? 'Auto' : 'Manual'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Minimum Rating
        </label>
        <div className="mt-2 flex gap-1">
          {[0, 4.0, 4.5, 4.8].map((star) => (
            <button
              key={star}
              onClick={() => update({ minRating: star === 0 ? undefined : star })}
              className={`flex-1 rounded-lg py-1 text-xs font-medium ${
                (!filters.minRating && star === 0) || filters.minRating === star
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {star === 0 ? 'Any' : `${star}★+`}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
