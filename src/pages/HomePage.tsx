import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listingService } from '../services/listingService';
import { AnyListing, RentalCategory, ListerType } from '../types';
import { ListingCard } from '../components/listings/ListingCard';
import {
  Search,
  MapPin,
  Home,
  Car,
  Briefcase,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  SlidersHorizontal,
  WifiOff,
  UserCheck,
  Award,
  Zap,
  PlusCircle,
} from 'lucide-react';
import { LAUNCH_CITY, CITIES_DATA } from '../constants';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState<AnyListing[]>([]);
  const [activeCategory, setActiveCategory] = useState<RentalCategory | 'ALL'>('ALL');
  const [selectedLocality, setSelectedLocality] = useState<string>('All Localities');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [listerTypeFilter, setListerTypeFilter] = useState<ListerType | 'ALL'>('ALL');

  const bangaloreData = CITIES_DATA.find((c) => c.name === LAUNCH_CITY) || CITIES_DATA[0];

  useEffect(() => {
    const loadListings = async () => {
      const res = await listingService.getListings();
      if (res.success && res.data) {
        setFeaturedListings(res.data);
      }
    };
    loadListings();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeCategory !== 'ALL') params.set('category', activeCategory);
    if (selectedLocality !== 'All Localities') params.set('locality', selectedLocality);
    if (listerTypeFilter !== 'ALL') params.set('listerType', listerTypeFilter);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    navigate(`/search?${params.toString()}`);
  };

  const filteredDisplayListings = featuredListings.filter((item) => {
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    if (listerTypeFilter !== 'ALL' && item.listerType !== listerTypeFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/50 pt-10 pb-16 dark:border-slate-800/80 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        {/* Subtle Decorative Geometry */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-96 w-full max-w-7xl opacity-30 dark:opacity-10 pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            {/* Launch City Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-2xs backdrop-blur-md dark:border-indigo-900/60 dark:bg-slate-900/80 dark:text-indigo-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Verified Rentals Live in {LAUNCH_CITY}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-500 dark:text-slate-400">Desktop & Offline Ready</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white">
              Rent verified homes, cars, <br className="hidden sm:inline" />
              and spaces with{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                zero hidden fees.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              RentEase unifies residential apartments, self-drive vehicles, commercial offices, and event venues into a single transparent desktop marketplace. Clear owner-versus-broker labels on every listing.
            </p>
          </div>

          {/* UNIFIED SEARCH CARD */}
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-3 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:p-4">
              {/* Category Quick Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold">
                {[
                  { id: 'ALL', label: 'All Categories', icon: SlidersHorizontal },
                  { id: 'RESIDENTIAL', label: 'Homes & PGs', icon: Home },
                  { id: 'VEHICLE', label: 'Cars & Bikes', icon: Car },
                  { id: 'COMMERCIAL', label: 'Offices & Shops', icon: Briefcase },
                  { id: 'EVENT', label: 'Event Venues', icon: Sparkles },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as any)}
                      className={`flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Inputs Form */}
              <form onSubmit={handleSearchSubmit} className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-12 items-center">
                {/* Locality Dropdown */}
                <div className="sm:col-span-4 relative">
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800/70">
                    <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
                    <div className="flex flex-col text-left w-full">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Locality
                      </span>
                      <select
                        value={selectedLocality}
                        onChange={(e) => setSelectedLocality(e.target.value)}
                        className="w-full border-0 bg-transparent p-0 text-xs font-semibold text-slate-800 focus:ring-0 dark:text-slate-200 cursor-pointer"
                      >
                        <option value="All Localities">All Localities (Bengaluru)</option>
                        {bangaloreData.localities.map((loc) => (
                          <option key={loc} value={loc} className="dark:bg-slate-800">
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Free Text Search */}
                <div className="sm:col-span-5">
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800/70">
                    <Search className="h-4 w-4 text-slate-400 shrink-0" />
                    <div className="flex flex-col text-left w-full">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Search Keywords
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. 3BHK Gated, Thar 4x4, Banquet, Studio..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border-0 bg-transparent p-0 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Search Button */}
                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-98"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search Rentals</span>
                  </button>
                </div>
              </form>

              {/* Direct Owner vs Verified Broker Filter Strip */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Lister Transparency:
                  </span>
                  <div className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
                    <button
                      onClick={() => setListerTypeFilter('ALL')}
                      className={`rounded-md px-2.5 py-0.5 text-[11px] font-medium transition ${
                        listerTypeFilter === 'ALL'
                          ? 'bg-white text-indigo-700 shadow-2xs font-semibold dark:bg-slate-900 dark:text-indigo-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Show All
                    </button>
                    <button
                      onClick={() => setListerTypeFilter('OWNER')}
                      className={`rounded-md px-2.5 py-0.5 text-[11px] font-medium transition ${
                        listerTypeFilter === 'OWNER'
                          ? 'bg-white text-indigo-700 shadow-2xs font-semibold dark:bg-slate-900 dark:text-indigo-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Direct Owners Only (Zero Brokerage)
                    </button>
                    <button
                      onClick={() => setListerTypeFilter('BROKER')}
                      className={`rounded-md px-2.5 py-0.5 text-[11px] font-medium transition ${
                        listerTypeFilter === 'BROKER'
                          ? 'bg-white text-indigo-700 shadow-2xs font-semibold dark:bg-slate-900 dark:text-indigo-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Verified Brokers
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5" /> 100% Escrow Protection
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM VALUE PROPOSITION (Zero Hidden Fees & Trust Framework) */}
      <section className="border-b border-slate-200/80 bg-white py-8 dark:border-slate-800/80 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Zero Hidden Fees
                </h4>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Clear itemized ledger for base rent, refundable deposit, GST, and service fees prior to booking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Owner / Broker Clarity
                </h4>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Every asset is tagged as Direct Owner (no commission) or Certified Broker with strict verification.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Trust & Dispute Resolution
                </h4>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Escrow security deposit release, multi-party mediation desk, and verified digital tenancy agreements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400">
                <WifiOff className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Offline Desktop Caching
                </h4>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Browse cached listings and queue bookings seamlessly on Windows and macOS even without WiFi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED RENTALS SECTION */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Handpicked & Verified
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Featured Listings in {LAUNCH_CITY}
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Direct owner deals and certified fleet vehicles ready for instantaneous handover.
              </p>
            </div>

            <Link
              to={`/search?category=${activeCategory !== 'ALL' ? activeCategory : ''}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition"
            >
              <span>Explore All {featuredListings.length} Listings</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Grid of Listings */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDisplayListings.slice(0, 8).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {filteredDisplayListings.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                No listings match the current filter selection. Try switching to "All Categories".
              </p>
            </div>
          )}
        </div>
      </section>

      {/* RENTEASE VS TRADITIONAL CLASSIFIEDS COMPARISON TABLE */}
      <section className="border-t border-slate-200/80 bg-white py-14 dark:border-slate-800/80 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Transparency Audit
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              RentEase vs. Traditional Rental Classifieds
            </h2>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              How RentEase solves spam, hidden brokerage, and fake listings in Indian metro cities.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Feature / Standard</th>
                  <th className="py-3 px-4 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30">
                    RentEase Platform
                  </th>
                  <th className="py-3 px-4 text-slate-400">Traditional Classifieds / Portals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    Lister Transparency
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/30 dark:bg-indigo-950/20">
                    Explicit "Direct Owner" vs "Verified Broker" badge on every card.
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Often misleadingly labeled "Owner" by brokers to generate calls.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    Fee Transparency
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/30 dark:bg-indigo-950/20">
                    Exact base rent, deposit, maintenance, taxes itemized before payment.
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Hidden brokerage fees demanded after inspection.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    Title & Asset Verification
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/30 dark:bg-indigo-950/20">
                    Khata/Sale deed for property, RC Book & Insurance for vehicles.
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Unverified crowd-sourced posts with high rates of duplicate photos.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    Security Deposit Protection
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/30 dark:bg-indigo-950/20">
                    Escrow deposit held safely with platform dispute mediation desk.
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Zero assistance if landlord unfairly withholds deposit at move-out.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    Transparent Lister Classification
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/30 dark:bg-indigo-950/20">
                    Explicit Owner vs Broker badge with real uploaded photos & AI concept disclosures.
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Brokers posing as direct owners with undisclosed commissions & fake stock photos.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* LIST PROPERTY CALL TO ACTION BANNER */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 p-8 text-white shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-200 backdrop-blur-xs">
                  <PlusCircle className="h-3.5 w-3.5" /> Direct Owner & Broker Portal
                </div>
                <h3 className="font-display text-2xl font-bold">
                  List Your Property or Vehicle with Verified Protection
                </h3>
                <p className="max-w-xl text-xs text-indigo-200 leading-relaxed">
                  Upload authentic photos, pinpoint your verified location on our map, and leverage Groq AI for instant listing copy generation. Zero hidden broker markups.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/provider"
                  className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-indigo-900 shadow-md hover:bg-indigo-50 transition"
                >
                  Post a Listing Now
                </Link>
                <Link
                  to="/search"
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition"
                >
                  Explore Rentals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
