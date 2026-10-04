import { AnyListing, ApiResponse, SearchFiltersState, ListingStatus } from '../types';
import { OfflineStorage } from './offlineStorage';
import { apiClient } from './api/apiClient';

export const listingService = {
  // Get all listings with optional multi-filter query
  async getListings(filters?: Partial<SearchFiltersState>): Promise<ApiResponse<AnyListing[]>> {
    // Attempt REST endpoint if backend is configured
    try {
      const response = await apiClient.get<AnyListing[]>('/listings', filters as Record<string, string | number | boolean>);
      if (response.success && response.data && response.data.length > 0) {
        return response;
      }
    } catch {
      // Backend not running, use offline cached dataset
    }

    // Offline / Mock fallback filter engine
    let results = OfflineStorage.getCachedListings();

    if (filters) {
      if (filters.city) {
        results = results.filter(
          (item) => item.location.city.toLowerCase() === filters.city!.toLowerCase()
        );
      }

      if (filters.category && filters.category !== 'ALL') {
        results = results.filter((item) => item.category === filters.category);
      }

      if (filters.locality && filters.locality !== 'ALL') {
        results = results.filter((item) =>
          item.location.locality.toLowerCase().includes(filters.locality!.toLowerCase())
        );
      }

      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        results = results.filter(
          (item) =>
            item.title.toLowerCase().includes(kw) ||
            item.description.toLowerCase().includes(kw) ||
            item.location.locality.toLowerCase().includes(kw)
        );
      }

      if (filters.minPrice !== undefined) {
        results = results.filter((item) => item.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        results = results.filter((item) => item.price <= filters.maxPrice!);
      }

      if (filters.listerType && filters.listerType !== 'ALL') {
        results = results.filter((item) => item.listerType === filters.listerType);
      }

      if (filters.verifiedOnly) {
        results = results.filter((item) => item.isVerified);
      }

      if (filters.minRating) {
        results = results.filter((item) => item.rating >= filters.minRating!);
      }

      // Residential Sub-Filters
      if (filters.category === 'RESIDENTIAL' && filters.resType && filters.resType !== 'ALL') {
        results = results.filter(
          (item) => item.category === 'RESIDENTIAL' && item.subType === filters.resType
        );
      }
      if (filters.bedrooms && filters.bedrooms !== 'ANY') {
        results = results.filter(
          (item) => item.category === 'RESIDENTIAL' && item.bedrooms >= Number(filters.bedrooms)
        );
      }

      // Vehicle Sub-Filters
      if (filters.category === 'VEHICLE' && filters.vehType && filters.vehType !== 'ALL') {
        results = results.filter(
          (item) => item.category === 'VEHICLE' && item.subType === filters.vehType
        );
      }
      if (filters.transmission && filters.transmission !== 'ANY') {
        results = results.filter(
          (item) => item.category === 'VEHICLE' && item.transmission === filters.transmission
        );
      }

      // Sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price_asc':
            results.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            results.sort((a, b) => b.price - a.price);
            break;
          case 'rating_desc':
            results.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          default:
            // Relevance: verified & featured first
            results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
        }
      }
    }

    return {
      success: true,
      message: 'Listings fetched successfully',
      data: results,
      pagination: {
        page: 1,
        pageSize: results.length,
        totalElements: results.length,
        totalPages: 1,
      },
    };
  },

  async getListingById(id: string): Promise<ApiResponse<AnyListing | null>> {
    try {
      const response = await apiClient.get<AnyListing>(`/listings/${id}`);
      if (response.success && response.data) return response;
    } catch {
      // Fallback
    }

    const cached = OfflineStorage.getCachedListings();
    const found = cached.find((item) => item.id === id) || null;

    if (found) {
      OfflineStorage.addRecentlyViewed(found.id);
      return {
        success: true,
        message: 'Listing retrieved',
        data: found,
      };
    }

    return {
      success: false,
      message: 'Listing not found',
      data: null,
    };
  },

  async createListing(listingData: Partial<AnyListing>): Promise<ApiResponse<AnyListing>> {
    try {
      const response = await apiClient.post<AnyListing>('/listings', listingData);
      if (response.success && response.data) {
        OfflineStorage.saveListing(response.data);
        return response;
      }
    } catch {
      // Fallback
    }

    const newListing = {
      ...listingData,
      id: `list_${Date.now()}`,
      status: 'PENDING_VERIFICATION',
      isVerified: false,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    } as AnyListing;

    OfflineStorage.saveListing(newListing);

    return {
      success: true,
      message: 'Listing submitted for verification',
      data: newListing,
    };
  },

  async getFeaturedListings(): Promise<ApiResponse<AnyListing[]>> {
    const res = await this.getListings();
    const featured = res.data.filter((item) => item.featured).slice(0, 6);
    return {
      success: true,
      message: 'Featured listings retrieved',
      data: featured,
    };
  },

  async updateListingStatus(id: string, status: ListingStatus): Promise<ApiResponse<AnyListing | null>> {
    const cached = OfflineStorage.getCachedListings();
    const item = cached.find((l) => l.id === id);
    if (item) {
      item.status = status;
      OfflineStorage.saveListing(item);
      return { success: true, message: 'Status updated', data: item };
    }
    return { success: false, message: 'Listing not found', data: null };
  },
};
