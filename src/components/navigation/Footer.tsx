import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Monitor, Heart } from 'lucide-react';
import { LAUNCH_CITY } from '../../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand & Mission */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-display font-bold text-white">
                R
              </div>
              <span className="font-display text-xl font-bold text-slate-900 dark:text-white">
                RentEase
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              RentEase is a production-grade Java Full Stack rental web platform designed for verified residential, vehicle, commercial, and event venue rentals with complete escrow transparency and zero-brokerage direct-owner options.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Multi-Layer Verified</span>
              </div>
              <div className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                <MapPin className="h-3.5 w-3.5" />
                <span>Live in {LAUNCH_CITY}</span>
              </div>
            </div>
          </div>

          {/* Rental Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Categories
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/search?category=RESIDENTIAL" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Residential Homes & PGs
                </Link>
              </li>
              <li>
                <Link to="/search?category=VEHICLE" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Self-Drive Cars & Bikes
                </Link>
              </li>
              <li>
                <Link to="/search?category=COMMERCIAL" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Retail Shops & Offices
                </Link>
              </li>
              <li>
                <Link to="/search?category=EVENT" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Marriage Gardens & Venues
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Comparison Tool
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  About RentEase
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  How RentEase Works
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Safety & Trust Standards
                </Link>
              </li>
              <li>
                <Link to="/provider-dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  List Your Property or Fleet
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Admin & Compliance Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Support & Legal
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/help" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/cancellation-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Refund & Dispute Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between border-t border-slate-100 pt-6 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:flex-row">
          <p>© 2026 RentEase Technologies Inc. All rights reserved.</p>
          <div className="mt-2 flex items-center gap-4 sm:mt-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Real-World Full Stack Web Architecture
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Powered by Spring Boot 3 & React
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
