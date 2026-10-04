import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, Scale, CheckCircle2, UserCheck, FileCheck } from 'lucide-react';

export const SafetyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" /> RentEase Trust Matrix
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Safety & Verification Standards
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Our comprehensive 3-tier inspection protocol safeguards every rental transaction against fraud, duplicate listings, and unfair deposit withholdings.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Tier 1: Identity & KYC
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every host and renter must complete instant government biometric verification (Aadhaar, Driving License, or Passport) before listing or booking.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <FileCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Tier 2: Title & RC Deed
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Properties require recent Khata/Tax receipts or registered sale deeds. Vehicles require valid Commercial RC and active Comprehensive Insurance policies.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Tier 3: Escrow & Mediation
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Security deposits remain safely locked in escrow until move-out inspection. Any dispute is independently audited by our Trust & Resolution Desk.
            </p>
          </div>
        </div>

        {/* Protection Checklist */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Consumer Rights & Zero-Spam Guarantee
          </h3>
          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>No Phone Spam:</strong> Your direct phone number is never broadcast publicly. Communication is mediated securely until booking confirmation.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Strict Lister Classification:</strong> Brokers caught claiming to be "Direct Owners" to evade zero-brokerage rules face instant permanent ban.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Instant Cancellation Window:</strong> Free 24-hour cancellation on long-term residential leases before move-in date.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
