import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnyListing } from '../types';

interface WishlistContextType {
  wishlistIds: string[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (listing: AnyListing) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rentease_wishlist');
      return saved ? JSON.parse(saved) : ['list_res_01', 'list_veh_01'];
    } catch {
      return ['list_res_01', 'list_veh_01'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rentease_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn(e);
    }
  }, [wishlistIds]);

  const isWishlisted = (id: string) => wishlistIds.includes(id);

  const toggleWishlist = (listing: AnyListing) => {
    setWishlistIds((prev) => {
      if (prev.includes(listing.id)) {
        return prev.filter((id) => id !== listing.id);
      } else {
        return [...prev, listing.id];
      }
    });
  };

  const clearWishlist = () => {
    setWishlistIds([]);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistIds, isWishlisted, toggleWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
