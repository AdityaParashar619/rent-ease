import React, { useState, useEffect } from 'react';
import { AnyListing, Booking } from '../../types';
import { useAuth } from '../../store/authContext';
import { useOffline } from '../../store/offlineContext';
import { bookingService } from '../../services/bookingService';
import { PLATFORM_FEES } from '../../constants';
import {
  X,
  Calendar,
  User,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Download,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  WifiOff,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingModalProps {
  listing: AnyListing;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ listing, isOpen, onClose }) => {
  const { user } = useAuth();
  const { isOnline } = useOffline();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Form State
  const [startDate, setStartDate] = useState<string>('2026-09-20');
  const [endDate, setEndDate] = useState<string>('2026-09-23');
  const [durationUnits, setDurationUnits] = useState<number>(3);
  const [customerName, setCustomerName] = useState<string>(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '+91 98765 43210');
  const [customerEmail, setCustomerEmail] = useState<string>(user?.email || '');
  const [notes, setNotes] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [includeInsuranceAddon, setIncludeInsuranceAddon] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      if (!customerName && user.name) setCustomerName(user.name);
      if (!customerEmail && user.email) setCustomerEmail(user.email);
      if (user.phone && customerPhone === '+91 98765 43210') setCustomerPhone(user.phone);
    }
  }, [user]);

  if (!isOpen) return null;

  // Price calculations
  const baseAmount = listing.price * durationUnits;
  const addonAmount = includeInsuranceAddon ? (listing.category === 'VEHICLE' ? 499 : 1200) : 0;
  const serviceFee = Math.round((baseAmount * PLATFORM_FEES.serviceFeePercent) / 100);
  const taxes = Math.round((serviceFee * PLATFORM_FEES.gstTaxPercent) / 100);
  const securityDeposit = listing.securityDeposit;
  const totalAmount = baseAmount + addonAmount + serviceFee + taxes + securityDeposit - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'RENTEASE2026' || promoCode.trim().toUpperCase() === 'FIRSTRENT') {
      setDiscount(Math.min(1500, Math.round(baseAmount * 0.1)));
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try "FIRSTRENT" or "RENTEASE2026"');
      setDiscount(0);
    }
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);

    const bookingPayload: Omit<Booking, 'id' | 'createdAt'> = {
      listingId: listing.id,
      listingTitle: listing.title,
      listingCategory: listing.category,
      listingImage: listing.images[0],
      customerId: user?.id || 'usr_guest',
      customerName: customerName.trim() || user?.name || 'Guest Renter',
      customerPhone: customerPhone.trim() || '+91 98765 43210',
      customerEmail: customerEmail.trim() || user?.email || 'guest@rentease.in',
      providerId: listing.listerId,
      providerName: listing.listerName,
      startDate,
      endDate,
      durationString: `${durationUnits} ${listing.priceUnit.replace('/', '')}s`,
      baseAmount,
      serviceFee,
      securityDeposit,
      taxes,
      discountAmount: discount,
      totalAmount,
      status: 'CONFIRMED',
      paymentStatus: 'SUCCESSFUL',
      paymentMethod,
      transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      notes,
    };

    const res = await bookingService.createBooking(bookingPayload);
    setIsSubmitting(false);

    if (res.success && res.data) {
      setConfirmedBooking(res.data);
      setStep(6);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Offline indicator if booking offline */}
        {!isOnline && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60">
            <WifiOff className="h-4 w-4 shrink-0" />
            <span>
              Offline Mode: Your booking and agreement will be verified locally and cached for seamless sync when you re-establish internet connection.
            </span>
          </div>
        )}

        {/* Multi-step progress bar (Steps 1 to 5) */}
        {step <= 5 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <span className={step === 1 ? 'text-indigo-600 dark:text-indigo-400' : ''}>1. Dates</span>
              <span className={step === 2 ? 'text-indigo-600 dark:text-indigo-400' : ''}>2. Details</span>
              <span className={step === 3 ? 'text-indigo-600 dark:text-indigo-400' : ''}>3. Add-ons</span>
              <span className={step === 4 ? 'text-indigo-600 dark:text-indigo-400' : ''}>4. Price</span>
              <span className={step === 5 ? 'text-indigo-600 dark:text-indigo-400' : ''}>5. Pay</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: Rental Details & Dates */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Rental Schedule & Duration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your required schedule for "{listing.title}".
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Start Date / Move-in
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  End Date / Handover
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Duration ({listing.priceUnit.replace('/', '')}s)
              </label>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="36"
                  value={durationUnits}
                  onChange={(e) => setDurationUnits(Math.max(1, Number(e.target.value)))}
                  className="w-24 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <span className="text-xs text-slate-500">
                  Rate: ₹{listing.price.toLocaleString('en-IN')} {listing.priceUnit}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Refundable Deposit:</span>{' '}
              ₹{listing.securityDeposit.toLocaleString('en-IN')} (Safely held in escrow, returned immediately upon check-out).
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Customer Information */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Renter Information & Verification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provide renter details for digital agreement generation.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name (as per Govt ID)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Special Instructions or Handover Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Flight arrives at 8 AM, preferred key pickup time..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Add-ons */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Optional Protection & Services
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose optional add-ons to ensure complete peace of mind.
            </p>

            <div className="space-y-3 pt-2">
              <label
                className={`flex items-start justify-between rounded-2xl border p-4 cursor-pointer transition ${
                  includeInsuranceAddon
                    ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={includeInsuranceAddon}
                    onChange={(e) => setIncludeInsuranceAddon(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">
                      RentEase Assure Protection Plan
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Covers accidental wear & tear up to ₹50,000, 24/7 roadside or property technician assistance, and zero deduction on minor blemishes.
                    </div>
                  </div>
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white shrink-0 ml-2">
                  +₹{listing.category === 'VEHICLE' ? '499' : '1,200'}
                </span>
              </label>

              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 text-xs text-slate-500">
                <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Transparent Rental Guarantee Included Free</span>
                </div>
                <p className="mt-1">
                  All listings are covered by our standard mediation desk, verified inspection record, and 100% digital receipts.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
              >
                <span>View Price Summary</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Price Summary & Breakdown */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Transparent Price Summary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear itemization with zero hidden fees.
            </p>

            {/* Price Ledger */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/70 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Base Rent ({durationUnits} × ₹{listing.price.toLocaleString('en-IN')})</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{baseAmount.toLocaleString('en-IN')}</span>
              </div>

              {includeInsuranceAddon && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>RentEase Assure Protection</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{addonAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Platform Service Fee ({PLATFORM_FEES.serviceFeePercent}%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{serviceFee.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Applicable Taxes (18% GST on Fee)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{taxes.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Refundable Security Deposit</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{securityDeposit.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Promotional Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline dark:border-slate-700">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Total Payable Amount</span>
                <span className="font-display text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Promo code input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code (e.g. FIRSTRENT)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs uppercase font-medium dark:border-slate-700 dark:bg-slate-800"
              />
              <button
                onClick={handleApplyPromo}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-[11px] text-rose-500">{promoError}</p>}
            {discount > 0 && <p className="text-[11px] text-emerald-600 font-medium">Promo code applied successfully!</p>}

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
              >
                <span>Proceed to Pay</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Payment Gateway Simulation */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Secure Payment Gateway
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select payment method to complete rental escrow authorization.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                { id: 'UPI', label: 'Instant UPI (Google Pay, PhonePe, Paytm, QR)', sub: 'Fastest & Zero Fee' },
                { id: 'CARD', label: 'Credit / Debit Card (Visa, Mastercard, RuPay)', sub: 'Supports EMI on HDFC, ICICI, SBI' },
                { id: 'NETBANKING', label: 'NetBanking (Top 40 Indian Banks)', sub: 'HDFC, ICICI, SBI, Axis, Kotak' },
              ].map((pm) => (
                <label
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id as any)}
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
                    paymentMethod === pm.id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === pm.id}
                      onChange={() => {}}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">
                        {pm.label}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{pm.sub}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              🔒 256-bit SSL encrypted escrow transaction. Funds are transferred to provider only after verified key handover.
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Authorize & Pay ₹{totalAmount.toLocaleString('en-IN')}</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Confirmation Page */}
        {step === 6 && confirmedBooking && (
          <div className="space-y-5 text-center py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                Booking Confirmed!
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Booking ID:{' '}
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {confirmedBooking.id}
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-800 dark:bg-slate-800/70 text-xs space-y-2">
              <div className="font-semibold text-slate-900 dark:text-white text-sm">
                {confirmedBooking.listingTitle}
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Dates:</span>
                <span className="font-medium">{confirmedBooking.startDate} to {confirmedBooking.endDate}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Provider:</span>
                <span className="font-medium">{confirmedBooking.providerName}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Payment Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {confirmedBooking.paymentStatus} ({confirmedBooking.transactionId})
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Total Amount:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{confirmedBooking.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  onClose();
                  navigate(`/dashboard/bookings`);
                }}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
              >
                View My Bookings
              </button>

              <button
                onClick={() => {
                  alert(`Receipt for booking ${confirmedBooking.id} generated!`);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                <Download className="h-4 w-4" />
                <span>Download Receipt</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  navigate(`/dashboard/messages`);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Message Host</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
