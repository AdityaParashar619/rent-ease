import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './store/themeContext';
import { OfflineProvider } from './store/offlineContext';
import { AuthProvider } from './store/authContext';
import { WishlistProvider } from './store/wishlistContext';
import { CompareProvider } from './store/compareContext';

import { OfflineBanner } from './components/common/OfflineBanner';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { CommandPalette } from './components/common/CommandPalette';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';

import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { ComparePage } from './pages/ComparePage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { ProviderDashboardPage } from './pages/ProviderDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SafetyPage } from './pages/SafetyPage';
import { PolicyPage } from './pages/PolicyPage';
import { LoginPage } from './pages/LoginPage';

export default function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <OfflineProvider>
          <AuthProvider>
            <WishlistProvider>
              <CompareProvider>
                <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 font-sans">
                  {/* Offline Warning & Cached Mode Banner (only shown if disconnected) */}
                  <OfflineBanner />

                  {/* Main Web Platform Navbar */}
                  <Navbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

                  {/* Page Content Body */}
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/listing/:id" element={<ListingDetailPage />} />
                      <Route path="/compare" element={<ComparePage />} />
                      <Route path="/dashboard" element={<CustomerDashboardPage />} />
                      <Route path="/provider-dashboard" element={<ProviderDashboardPage />} />
                      <Route path="/admin" element={<AdminDashboardPage />} />
                      <Route path="/how-it-works" element={<HowItWorksPage />} />
                      <Route path="/safety" element={<SafetyPage />} />
                      <Route path="/policies" element={<PolicyPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>

                  {/* Footer */}
                  <Footer />

                  {/* Global Desktop Modals: Command Palette & Keyboard Shortcuts */}
                  <CommandPalette
                    isOpen={isCommandPaletteOpen}
                    onClose={() => setIsCommandPaletteOpen(false)}
                  />
                  <KeyboardShortcutsModal
                    isOpen={isShortcutsOpen}
                    onClose={() => setIsShortcutsOpen(false)}
                  />
                </div>
              </CompareProvider>
            </WishlistProvider>
          </AuthProvider>
        </OfflineProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
