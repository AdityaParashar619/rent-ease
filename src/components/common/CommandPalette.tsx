import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffline } from '../../store/offlineContext';
import { useAuth } from '../../store/authContext';
import { useTheme } from '../../store/themeContext';
import {
  Search,
  Home,
  Car,
  Briefcase,
  Sparkles,
  Calendar,
  Heart,
  Moon,
  Sun,
  ShieldCheck,
  UserCheck,
  Building,
  ArrowRight,
} from 'lucide-react';
import { PlatformRole } from '../../types';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, setIsSimulatingOffline, isSimulatingOffline } =
    useOffline();
  const { switchRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    {
      id: 'search-residential',
      title: 'Find Homes & Apartments',
      subtitle: 'Browse 3BHK, 2BHK, Villas, and PGs in Bengaluru',
      icon: Home,
      category: 'Explore',
      action: () => {
        navigate('/search?category=RESIDENTIAL');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'search-vehicles',
      title: 'Rent Cars & Bikes',
      subtitle: 'Self-drive Creta, Thar, Hunter 350, Ather EV',
      icon: Car,
      category: 'Explore',
      action: () => {
        navigate('/search?category=VEHICLE');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'search-commercial',
      title: 'Explore Commercial Spaces & Offices',
      subtitle: 'Shops, 100ft road offices, coworking desks',
      icon: Briefcase,
      category: 'Explore',
      action: () => {
        navigate('/search?category=COMMERCIAL');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'search-venues',
      title: 'Book Event Venues & Banquet Gardens',
      subtitle: 'Wedding lawns, banquet halls, farmhouses',
      icon: Sparkles,
      category: 'Explore',
      action: () => {
        navigate('/search?category=EVENT');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-bookings',
      title: 'My Bookings',
      subtitle: 'View upcoming rentals and receipts',
      icon: Calendar,
      category: 'Navigation',
      action: () => {
        navigate('/dashboard/bookings');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-wishlist',
      title: 'Saved Wishlist',
      subtitle: 'Check pinned properties and rides',
      icon: Heart,
      category: 'Navigation',
      action: () => {
        navigate('/dashboard/wishlist');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-compare',
      title: 'Side-by-Side Comparison',
      subtitle: 'Compare specs across selected items',
      icon: ArrowRight,
      category: 'Navigation',
      action: () => {
        navigate('/compare');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'act-theme',
      title: isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      subtitle: 'Toggle aesthetic appearance',
      icon: isDark ? Sun : Moon,
      category: 'Preferences',
      action: () => {
        toggleTheme();
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'act-offline',
      title: isSimulatingOffline ? 'Disable Offline Simulation (Go Online)' : 'Simulate Offline Mode',
      subtitle: 'Test cached dataset and offline queues',
      icon: ShieldCheck,
      category: 'Developer & Test',
      action: () => {
        setIsSimulatingOffline(!isSimulatingOffline);
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'role-provider',
      title: 'Switch to Provider Persona',
      subtitle: 'Test SaaS Provider listings and earnings console',
      icon: Building,
      category: 'Demo Persona Switch',
      action: () => {
        switchRole('PROVIDER');
        navigate('/provider-dashboard');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'role-admin',
      title: 'Switch to Admin Persona',
      subtitle: 'Test Platform compliance, verifications and disputes',
      icon: UserCheck,
      category: 'Demo Persona Switch',
      action: () => {
        switchRole('ADMIN');
        navigate('/admin');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'role-customer',
      title: 'Switch to Customer Persona',
      subtitle: 'Test customer renting and discovery flow',
      icon: UserCheck,
      category: 'Demo Persona Switch',
      action: () => {
        switchRole('CUSTOMER');
        navigate('/dashboard');
        setIsCommandPaletteOpen(false);
      },
    },
  ];

  const filtered = actions.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-16 backdrop-blur-xs sm:pt-24 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <Search className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <input
            type="text"
            placeholder="Type a command, search categories, or jump to page... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full border-0 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-slate-100"
          />
          <kbd className="hidden rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:inline">
            ESC
          </kbd>
        </div>

        {/* Action Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No matching actions found for "{query}".
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800/80 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/60 dark:text-indigo-400 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-4 py-2 text-xs text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>Desktop Quick Launcher</span>
            <span>•</span>
            <span>Press ⌘K anytime</span>
          </div>
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="hover:text-slate-700 dark:hover:text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
