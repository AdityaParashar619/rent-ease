import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  FileCheck,
  CreditCard,
  Key,
  Building,
  UserCheck,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const renterSteps = [
    {
      step: '01',
      title: 'Discover Verified Assets',
      desc: 'Browse hundreds of residential apartments, self-drive vehicles, offices, and wedding venues in Bengaluru with guaranteed authentic photos and verified title deeds.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Choose Lister Model with Zero Ambiguity',
      desc: 'Select "Direct Owner" listings for zero brokerage fees or "Verified Broker" for managed assistance with platform fee capping.',
      icon: UserCheck,
    },
    {
      step: '03',
      title: 'Review Transparent Price Breakdown',
      desc: 'See the exact ledger breakdown: Base rent, refundable deposit, GST, and maintenance before spending a single rupee. No surprises at the door.',
      icon: CreditCard,
    },
    {
      step: '04',
      title: 'Digital Agreement & Escrow Payment',
      desc: 'Digitally e-sign standardized tenancy contracts and pay through 256-bit SSL encrypted escrow. Landlord receives funds only after verified handover.',
      icon: Lock,
    },
    {
      step: '05',
      title: 'Check-in & Deposit Protection',
      desc: 'Complete digital condition checklist at handover. Your security deposit is backed by the RentEase Mediation Desk upon departure.',
      icon: Key,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-5xl">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <ShieldCheck className="h-3.5 w-3.5" /> RentEase Standard
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            How RentEase Works
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A frictionless, multi-category rental experience built for desktop transparency and safety.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-12 space-y-6">
          {renterSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-slate-300"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-display text-xl font-black">
                  {s.step}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-indigo-500" />
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition"
          >
            <span>Start Exploring Listings</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
