import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import { listingService } from '../services/listingService';
import { bookingService } from '../services/bookingService';
import { AnyListing, Booking } from '../types';
import { CreateListingModal } from '../components/listings/CreateListingModal';
import { Link } from 'react-router-dom';
import {
  Plus,
  Building,
  Car,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Layers,
  Check,
  ShieldCheck,
  AlertCircle,
  Eye,
  LogIn,
  Edit2,
} from 'lucide-react';
import { LAUNCH_CITY } from '../constants';

export const ProviderDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [providerListings, setProviderListings] = useState<AnyListing[]>([]);
  const [incomingBookings, setIncomingBookings] = useState<Booking[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    const loadProviderData = async () => {
      const lRes = await listingService.getListings();
      if (lRes.success && lRes.data) {
        setProviderListings(lRes.data);
      }

      const bRes = await bookingService.getBookingsForUser(user?.id || 'usr_cust_01');
      if (bRes.success && bRes.data) {
        setIncomingBookings(bRes.data);
      }
    };
    loadProviderData();
  }, [user]);

  const handleListingCreated = async (newListing: AnyListing) => {
    const res = await listingService.createListing(newListing);
    if (res.success && res.data) {
      setProviderListings((prev) => [res.data!, ...prev]);
      setSuccessToast(`"${res.data.title}" has been published live to the marketplace!`);
      setTimeout(() => setSuccessToast(null), 5000);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'TEMPORARILY_UNAVAILABLE' : 'ACTIVE';
    const res = await listingService.updateListingStatus(id, nextStatus as any);
    if (res.success && res.data) {
      setProviderListings((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: nextStatus as any } : item))
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Provider & Host Console</span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">
              Asset Portfolio & Rental Operations
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage listings, verify tenant agreements, and track escrow payouts.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-98"
          >
            <Plus className="h-4 w-4" />
            <span>List New Asset</span>
          </button>
        </div>

        {/* METRICS ROW */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-400">Total Monthly Revenue</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-2xl font-black text-slate-900 dark:text-white">
                ₹1,84,000
              </span>
              <span className="text-xs font-bold text-emerald-600">+12% MoM</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-400">Active Listings</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-2xl font-black text-slate-900 dark:text-white">
                {providerListings.length}
              </span>
              <span className="text-xs font-medium text-slate-500">Live in Bengaluru</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-400">Pending Booking Requests</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {incomingBookings.length}
              </span>
              <span className="text-xs font-bold text-indigo-600">Requires Action</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-400">Escrow Security Deposits</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ₹4,20,000
              </span>
              <span className="text-xs font-medium text-slate-500">Protected</span>
            </div>
          </div>
        </div>

        {/* MANAGED LISTINGS TABLE */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
          <div className="flex items-center justify-between pb-4">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              My Rental Listings
            </h3>
            <span className="text-xs text-slate-400">Showing {providerListings.length} properties/assets</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 uppercase font-bold text-[11px] text-slate-400">
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Lister Model</th>
                <th className="py-2.5 px-3">Tariff</th>
                <th className="py-2.5 px-3">Deposit</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {providerListings.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="h-10 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400">{item.location.locality}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold uppercase text-slate-600 dark:text-slate-300">
                    {item.category}
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {item.listerType}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    ₹{item.price.toLocaleString('en-IN')} {item.priceUnit}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    ₹{item.securityDeposit.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {item.status} (Click to toggle)
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => alert(`Editing listing: ${item.title}`)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* INCOMING BOOKING REQUESTS */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">
            Rental Bookings & Handover Approvals
          </h3>

          <div className="space-y-3 text-xs">
            {incomingBookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {b.listingTitle}
                    </span>
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {b.paymentStatus}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-1">
                    Customer: <span className="font-semibold text-slate-700 dark:text-slate-300">{b.customerName}</span> • Phone: {b.customerPhone}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Period: {b.startDate} to {b.endDate} • Amount: ₹{b.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Booking ${b.id} approved. Agreement dispatched to ${b.customerName}.`)}
                    className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approve Handover</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* CREATE & PUBLISH LISTING MODAL */}
      <CreateListingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onListingCreated={handleListingCreated}
      />
    </div>
  );
};
