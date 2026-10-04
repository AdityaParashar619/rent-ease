import React, { createContext, useContext, useState } from 'react';
import { AnyListing } from '../types';

interface CompareContextType {
  compareItems: AnyListing[];
  addToCompare: (listing: AnyListing) => boolean;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<AnyListing[]>([]);

  const addToCompare = (listing: AnyListing): boolean => {
    // Check if category matches existing items
    if (compareItems.length > 0 && compareItems[0].category !== listing.category) {
      alert(`You can only compare listings within the same category (${compareItems[0].category}). Please clear comparison list first.`);
      return false;
    }

    if (compareItems.length >= 4) {
      alert('Maximum 4 items can be compared simultaneously.');
      return false;
    }

    if (!compareItems.some((item) => item.id === listing.id)) {
      setCompareItems((prev) => [...prev, listing]);
      return true;
    }
    return false;
  };

  const removeFromCompare = (id: string) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (id: string) => compareItems.some((item) => item.id === id);

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
};
