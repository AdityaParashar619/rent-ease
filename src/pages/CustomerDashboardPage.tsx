import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/authContext';
import { useWishlist } from '../store/wishlistContext';
import { bookingService } from '../services/bookingService';
import { listingService } from '../services/listingService';
import { paymentService } from '../services/platformServices';
import { Booking, AnyListing, PaymentRecord } from '../types';
import { ListingCard } from '../components/listings/ListingCard';
import {
  Calendar,
  Heart,
  CreditCard,
  FileText,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  AlertTriangle,
  ArrowRight,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerDashboardPage: React.FC<{ initialTab?: string }> = ({ initialTab = 'bookings' }) => {
  const { user } = useAuth();
  const { wishlistIds } = useWishlist();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlistListings, setWishlistListings] = useState<AnyListing[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState<Booking | null>(null);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      // Load bookings
      const bRes = await bookingService.getBookingsForUser(user.id);
      if (bRes.success && bRes.data) setBookings(bRes.data);

      // Load all listings to filter wishlist
      const lRes = await listingService.getListings();
      if (lRes.success && lRes.data) {
        setWishlistListings(lRes.data.filter((item) => wishlistIds.includes(item.id)));
      }

      // Load payments
      const pRes = await paymentService.getPaymentHistory();
      if (pRes.success && pRes.data) setPayments(pRes.data);
    };

    loadData();
  }, [user?.id, wishlistIds]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you wish to cancel this rental booking? Refund will be processed as per platform policy.')) {
      return;
    }
    const res = await bookingService.cancelBooking(bookingId, 'Cancelled by customer via dashboard.');
    if (res.success && user) {
      const bRes = await bookingService.getBookingsForUser(user.id);
      if (bRes.success && bRes.data) setBookings(bRes.data);
      alert('Booking cancelled. Refund of security deposit initiated.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-16 px-4 transition-colors flex items-center justify-center">
        <div className="max-w-md w-full text-center rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <User className="h-8 w-8" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Please Sign In
          </h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Sign in to view your bookings, saved rentals, payment receipts, and dispute history.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition text-center"
            >
              Sign In to Your Account
            </Link>
            <Link
              to="/search"
              className="w-full rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition text-center"
            >
              Explore Available Rentals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* Profile Banner */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </h1>
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {user.role}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>{user.email}</span>
                  <span>•</span>
                  <span>{user.phone}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5" /> Aadhaar KYC Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
                <span className="text-slate-400 font-medium">Active Rentals</span>
                <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {bookings.filter((b) => b.status === 'CONFIRMED').length}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
                <span className="text-slate-400 font-medium">Saved Items</span>
                <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {wishlistIds.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold space-x-2 sm:space-x-4 mb-6 overflow-x-auto">
          {[
            { id: 'bookings', label: 'My Bookings', icon: Calendar, count: bookings.length },
            { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, count: wishlistListings.length },
            { id: 'payments', label: 'Payments & Receipts', icon: CreditCard, count: payments.length },
            { id: 'documents', label: 'Rental Agreements', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-3 py-3 transition whitespace-nowrap ${
                  active
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <Calendar className="mx-auto h-8 w-8 text-slate-400" />
                <h3 className="mt-2 font-bold text-slate-800 dark:text-white text-sm">
                  No active or past bookings
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  You haven't reserved any apartments, vehicles, or event venues yet.
                </p>
                <Link
                  to="/search"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
                >
                  <span>Explore Listings</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              bookings.map((booking) => {
                const isConfirmed = booking.status === 'CONFIRMED';
                const isCompleted = booking.status === 'COMPLETED';
                const isCancelled = booking.status === 'CANCELLED';

                return (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={booking.listingImage}
                        alt={booking.listingTitle}
                        className="h-20 w-24 rounded-xl object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                              isConfirmed
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : isCompleted
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {booking.status}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">{booking.id}</span>
                        </div>

                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {booking.listingTitle}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {booking.startDate} to {booking.endDate} ({booking.durationString})
                          </span>
                          <span>•</span>
                          <span>Provider: {booking.providerName}</span>
                        </div>

                        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          Total Paid: ₹{booking.totalAmount.toLocaleString('en-IN')} (Security Deposit: ₹{booking.securityDeposit.toLocaleString('en-IN')})
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-center">
                      <button
                        onClick={() => setSelectedBookingForReceipt(booking)}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Receipt</span>
                      </button>

                      <Link
                        to={`/listing/${booking.listingId}`}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                      >
                        View Asset
                      </Link>

                      {isConfirmed && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: SAVED WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistListings.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <Heart className="mx-auto h-8 w-8 text-slate-400" />
                <h3 className="mt-2 font-bold text-slate-800 dark:text-white text-sm">
                  Wishlist is empty
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Click the heart icon on any listing to pin items here for easy access.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {wishlistListings.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PAYMENTS & INVOICES */}
        {activeTab === 'payments' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">
              Escrow & Transaction Ledger
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
                  <th className="py-2.5 px-3">Transaction ID</th>
                  <th className="py-2.5 px-3">Booking Reference</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Base Rent</th>
                  <th className="py-2.5 px-3">Security Deposit</th>
                  <th className="py-2.5 px-3">Total Paid</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {p.transactionId}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                      {p.bookingId}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{p.date}</td>
                    <td className="py-3 px-3 font-medium">{p.method}</td>
                    <td className="py-3 px-3">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-slate-500">₹{p.depositHeld.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      ₹{p.totalPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: RENTAL AGREEMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                Digital Rental Agreements
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Legally binding digital agreements generated with electronic signatures for all confirmed bookings.
              </p>

              <div className="space-y-3 text-xs">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          Rental Agreement — {b.listingTitle}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          E-Signed by {b.customerName} & {b.providerName} • ID: {b.id}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Opening digital PDF agreement for ${b.id}`)}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>View PDF</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RECEIPT MODAL */}
      {selectedBookingForReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Official Rental Receipt
              </div>
              <button
                onClick={() => setSelectedBookingForReceipt(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Receipt No:</span>
                <span className="font-mono font-bold text-indigo-600">{selectedBookingForReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Booking Reference:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedBookingForReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Listing:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedBookingForReceipt.listingTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Period:</span>
                <span>{selectedBookingForReceipt.startDate} to {selectedBookingForReceipt.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Provider:</span>
                <span>{selectedBookingForReceipt.providerName}</span>
              </div>

              <div className="border-t border-slate-100 pt-3 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span>Base Rent:</span>
                  <span>₹{selectedBookingForReceipt.baseAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee & GST:</span>
                  <span>₹{(selectedBookingForReceipt.serviceFee + selectedBookingForReceipt.taxes).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit (Held in Escrow):</span>
                  <span>₹{selectedBookingForReceipt.securityDeposit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold text-sm text-slate-900 dark:text-white">
                  <span>Total Amount Paid:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    ₹{selectedBookingForReceipt.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Receipt downloaded to your desktop downloads folder.');
                setSelectedBookingForReceipt(null);
              }}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Print / Save PDF Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
