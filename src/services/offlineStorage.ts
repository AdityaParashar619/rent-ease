import { AnyListing, Booking } from '../types';
import { MOCK_LISTINGS } from '../data/mockListings';
import { MOCK_BOOKINGS } from '../data/mockBookings';

const KEYS = {
  LISTINGS: 'rentease_cached_listings',
  BOOKINGS: 'rentease_cached_bookings',
  OFFLINE_QUEUE: 'rentease_offline_booking_queue',
  RECENTLY_VIEWED: 'rentease_recently_viewed_ids',
  SAVED_SEARCHES: 'rentease_saved_searches',
  THEME: 'rentease_theme',
};

export interface SavedSearch {
  id: string;
  queryTitle: string;
  category: string;
  filters: Record<string, unknown>;
  createdAt: string;
}

export class OfflineStorage {
  // Purge any legacy mock listings (from old demo versions)
  static initCache(): void {
    try {
      const stored = localStorage.getItem(KEYS.LISTINGS);
      if (stored) {
        const parsed: AnyListing[] = JSON.parse(stored);
        // If stored listings contain the old mock IDs, purge them to ensure a clean real-data start
        const cleaned = parsed.filter(
          (l) => !l.id.startsWith('list_res_') && !l.id.startsWith('list_veh_') && !l.id.startsWith('list_com_') && !l.id.startsWith('list_evn_')
        );
        localStorage.setItem(KEYS.LISTINGS, JSON.stringify(cleaned));
      } else {
        localStorage.setItem(KEYS.LISTINGS, JSON.stringify(MOCK_LISTINGS));
      }

      const storedBookings = localStorage.getItem(KEYS.BOOKINGS);
      if (storedBookings) {
        const parsedB: Booking[] = JSON.parse(storedBookings);
        const cleanedB = parsedB.filter((b) => !b.id.startsWith('bk_0') && !b.id.startsWith('book_'));
        localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(cleanedB));
      } else {
        localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(MOCK_BOOKINGS));
      }
    } catch (e) {
      console.warn('LocalStorage not accessible for cache init', e);
    }
  }

  static getCachedListings(): AnyListing[] {
    try {
      this.initCache();
      const data = localStorage.getItem(KEYS.LISTINGS);
      if (!data) return [];
      const listings: AnyListing[] = JSON.parse(data);
      // Ensure no legacy dummy listings are returned
      return listings.filter(
        (l) => !l.id.startsWith('list_res_') && !l.id.startsWith('list_veh_') && !l.id.startsWith('list_com_') && !l.id.startsWith('list_evn_')
      );
    } catch {
      return [];
    }
  }

  static saveListing(listing: AnyListing): void {
    try {
      const listings = this.getCachedListings();
      const index = listings.findIndex((l) => l.id === listing.id);
      if (index >= 0) {
        listings[index] = listing;
      } else {
        listings.unshift(listing);
      }
      localStorage.setItem(KEYS.LISTINGS, JSON.stringify(listings));
    } catch (e) {
      console.warn('Failed to cache listing', e);
    }
  }

  static deleteListing(id: string): void {
    try {
      const listings = this.getCachedListings().filter((l) => l.id !== id);
      localStorage.setItem(KEYS.LISTINGS, JSON.stringify(listings));
    } catch (e) {
      console.warn('Failed to delete listing', e);
    }
  }

  static getCachedBookings(): Booking[] {
    try {
      const data = localStorage.getItem(KEYS.BOOKINGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addBooking(booking: Booking, isOffline: boolean = false): void {
    try {
      const bookings = this.getCachedBookings();
      bookings.unshift(booking);
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));

      if (isOffline) {
        const queue = this.getOfflineQueue();
        queue.unshift(booking);
        localStorage.setItem(KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
      }
    } catch (e) {
      console.warn('Failed to save booking', e);
    }
  }

  static getOfflineQueue(): Booking[] {
    try {
      const data = localStorage.getItem(KEYS.OFFLINE_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static clearOfflineQueue(): void {
    try {
      localStorage.removeItem(KEYS.OFFLINE_QUEUE);
    } catch (e) {
      console.warn(e);
    }
  }

  // Recently Viewed Listings
  static addRecentlyViewed(listingId: string): void {
    try {
      const raw = localStorage.getItem(KEYS.RECENTLY_VIEWED);
      let ids: string[] = raw ? JSON.parse(raw) : [];
      ids = [listingId, ...ids.filter((id) => id !== listingId)].slice(0, 8);
      localStorage.setItem(KEYS.RECENTLY_VIEWED, JSON.stringify(ids));
    } catch (e) {
      console.warn(e);
    }
  }

  static getRecentlyViewedIds(): string[] {
    try {
      const raw = localStorage.getItem(KEYS.RECENTLY_VIEWED);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // Saved Searches
  static getSavedSearches(): SavedSearch[] {
    try {
      const raw = localStorage.getItem(KEYS.SAVED_SEARCHES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static addSavedSearch(search: SavedSearch): void {
    try {
      const list = this.getSavedSearches();
      list.unshift(search);
      localStorage.setItem(KEYS.SAVED_SEARCHES, JSON.stringify(list));
    } catch (e) {
      console.warn(e);
    }
  }

  static getDesktopPlatform(): 'macos' | 'windows' | 'browser' {
    try {
      const stored = localStorage.getItem('rentease_desktop_platform');
      if (stored === 'macos' || stored === 'windows' || stored === 'browser') return stored;
    } catch {}
    if (typeof navigator !== 'undefined') {
      if (navigator.userAgent.includes('Mac')) return 'macos';
      if (navigator.userAgent.includes('Win')) return 'windows';
    }
    return 'browser';
  }

  static setDesktopPlatform(p: 'macos' | 'windows' | 'browser'): void {
    try {
      localStorage.setItem('rentease_desktop_platform', p);
    } catch {}
  }
}
