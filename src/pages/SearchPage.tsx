import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listingService } from '../services/listingService';
import { AnyListing, SearchFiltersState, RentalCategory } from '../types';
import { ListingCard } from '../components/listings/ListingCard';
import { ListingFilters } from '../components/listings/ListingFilters';
import { ListingMap } from '../components/listings/ListingMap';
import {
  SlidersHorizontal,
  Map,
  Grid,
  Search,
  RotateCcw,
  X,
  ChevronDown,
} from 'lucide-react';
import { LAUNCH_CITY } from '../constants';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allListings, setAllListings] = useState<AnyListing[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('grid');
  const [sortBy, setSortBy] = useState<'RECOMMENDED' | 'PRICE_ASC' | 'PRICE_DESC' | 'RATING'>('RECOMMENDED');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Initialize filter state from URL
  const initialFilters: SearchFiltersState = {
    city: LAUNCH_CITY,
    category: (searchParams.get('category') as RentalCategory | 'ALL') || 'ALL',
    locality: searchParams.get('locality') || undefined,
    listerType: (searchParams.get('listerType') as any) || 'ALL',
    keyword: searchParams.get('q') || '',
    verifiedOnly: searchParams.get('verified') === 'true',
  };

  const [filters, setFilters] = useState<SearchFiltersState>(initialFilters);

  // Sync with URL params on param change
  useEffect(() => {
    setFilters({
      city: LAUNCH_CITY,
      category: (searchParams.get('category') as RentalCategory | 'ALL') || 'ALL',
      locality: searchParams.get('locality') || undefined,
      listerType: (searchParams.get('listerType') as any) || 'ALL',
      keyword: searchParams.get('q') || '',
      verifiedOnly: searchParams.get('verified') === 'true',
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchListings = async () => {
      const res = await listingService.getListings();
      if (res.success && res.data) {
        setAllListings(res.data);
      }
    };
    fetchListings();
  }, []);

  // Filter listings
  const filteredListings = useMemo(() => {
    return allListings.filter((item) => {
      if (filters.category && filters.category !== 'ALL' && item.category !== filters.category) {
        return false;
      }
      if (filters.locality && filters.locality !== 'ALL' && item.location.locality !== filters.locality) {
        return false;
      }
      if (filters.listerType && filters.listerType !== 'ALL' && item.listerType !== filters.listerType) {
        return false;
      }
      if (filters.verifiedOnly && !item.isVerified) {
        return false;
      }
      if (filters.maxPrice && item.price > filters.maxPrice) {
        return false;
      }
      if (filters.minRating && item.rating < filters.minRating) {
        return false;
      }
      if (filters.keyword) {
        const q = filters.keyword.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesLoc = item.location.locality.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesDesc) return false;
      }
      return true;
    });
  }, [allListings, filters]);

  // Sort listings
  const sortedListings = useMemo(() => {
    const list = [...filteredListings];
    switch (sortBy) {
      case 'PRICE_ASC':
        return list.sort((a, b) => a.price - b.price);
      case 'PRICE_DESC':
        return list.sort((a, b) => b.price - a.price);
      case 'RATING':
        return list.sort((a, b) => b.rating - a.rating);
      case 'RECOMMENDED':
      default:
        return list.sort((a, b) => (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0));
    }
  }, [filteredListings, sortBy]);

  const handleResetFilters = () => {
    setFilters({
      city: LAUNCH_CITY,
      category: 'ALL',
      listerType: 'ALL',
      verifiedOnly: false,
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
      {/* Top Search Controls Bar */}
      <div className="border-b border-slate-200/80 bg-white/95 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/95 sticky top-16 z-30 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          {/* Quick Search Input */}
          <div className="flex flex-1 items-center gap-2 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search rentals by title, area, or asset name..."
                value={filters.searchQuery || ''}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Action buttons: Layout view toggle, Mobile filters, Sort by */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex rounded-xl border border-slate-200 p-0.5 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
                title="Grid Layout"
              >
                <Grid className="h-3.5 w-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  viewMode === 'split'
                    ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
                title="Split Map Layout"
              >
                <Map className="h-3.5 w-3.5" />
                <span>Split Map</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="RECOMMENDED">Recommended (Verified First)</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
                <option value="RATING">Highest Customer Rating</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 lg:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-500" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        <div className="mx-auto mt-2 flex max-w-7xl flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-400">
            {sortedListings.length} results in {LAUNCH_CITY}:
          </span>

          {filters.category && filters.category !== 'ALL' && (
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-medium">
              Category: {filters.category}
              <X
                className="h-3 w-3 cursor-pointer hover:opacity-75"
                onClick={() => setFilters({ ...filters, category: 'ALL' })}
              />
            </span>
          )}

          {filters.locality && (
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-medium">
              Locality: {filters.locality}
              <X
                className="h-3 w-3 cursor-pointer hover:opacity-75"
                onClick={() => setFilters({ ...filters, locality: undefined })}
              />
            </span>
          )}

          {filters.listerType && filters.listerType !== 'ALL' && (
            <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-medium">
              Lister: {filters.listerType === 'OWNER' ? 'Direct Owner' : 'Verified Broker'}
              <X
                className="h-3 w-3 cursor-pointer hover:opacity-75"
                onClick={() => setFilters({ ...filters, listerType: 'ALL' })}
              />
            </span>
          )}

          {filters.verifiedOnly && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
              Verified Only
              <X
                className="h-3 w-3 cursor-pointer hover:opacity-75"
                onClick={() => setFilters({ ...filters, verifiedOnly: false })}
              />
            </span>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Filter Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <ListingFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {viewMode === 'split' ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
                  {sortedListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                  {sortedListings.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-xs text-slate-500">No matching listings found.</p>
                    </div>
                  )}
                </div>
                <div className="sticky top-28">
                  <ListingMap listings={sortedListings} />
                </div>
              </div>
            ) : (
              <div>
                {sortedListings.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white">
                      No matching listings found
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Try relaxing some of your filters or switching to another locality in {LAUNCH_CITY}.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset All Filters</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {sortedListings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs lg:hidden p-4">
          <div className="max-h-[85vh] w-full overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl dark:bg-slate-900">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Filters</span>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">
              <ListingFilters
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
              />
            </div>
            <div className="mt-4">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-sm"
              >
                Apply Filters ({sortedListings.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
