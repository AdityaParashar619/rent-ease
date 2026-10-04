import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { OfflineStorage } from '../services/offlineStorage';
import { LAUNCH_CITY } from '../constants';

interface OfflineContextType {
  isOnline: boolean;
  isSimulatingOffline: boolean;
  setIsSimulatingOffline: (sim: boolean) => void;
  offlineQueueCount: number;
  syncOfflineQueue: () => Promise<void>;
  desktopPlatform: 'macos' | 'windows' | 'browser';
  setDesktopPlatform: (p: 'macos' | 'windows' | 'browser') => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isShortcutsModalOpen: boolean;
  setIsShortcutsModalOpen: (open: boolean) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [realOnline, setRealOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatingOffline, setIsSimulatingOffline] = useState<boolean>(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [desktopPlatform, setDesktopPlatformState] = useState<'macos' | 'windows' | 'browser'>(
    OfflineStorage.getDesktopPlatform()
  );
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>(LAUNCH_CITY);

  const effectiveOnline = realOnline && !isSimulatingOffline;

  const updateQueueCount = useCallback(() => {
    const queue = OfflineStorage.getOfflineQueue();
    setOfflineQueueCount(queue.length);
  }, []);

  useEffect(() => {
    OfflineStorage.initCache();
    updateQueueCount();

    const handleOnline = () => setRealOnline(true);
    const handleOffline = () => setRealOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Global desktop keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: Command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // Cmd/Ctrl + /: Keyboard shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      }
      // Esc: Close any modal
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsShortcutsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [updateQueueCount]);

  const setDesktopPlatform = (p: 'macos' | 'windows' | 'browser') => {
    setDesktopPlatformState(p);
    OfflineStorage.setDesktopPlatform(p);
  };

  const syncOfflineQueue = async () => {
    const queue = OfflineStorage.getOfflineQueue();
    if (queue.length === 0) return;

    // Simulate syncing with server
    await new Promise((r) => setTimeout(r, 1200));
    OfflineStorage.clearOfflineQueue();
    updateQueueCount();
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline: effectiveOnline,
        isSimulatingOffline,
        setIsSimulatingOffline,
        offlineQueueCount,
        syncOfflineQueue,
        desktopPlatform,
        setDesktopPlatform,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isShortcutsModalOpen,
        setIsShortcutsModalOpen,
        selectedCity,
        setSelectedCity,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) throw new Error('useOffline must be used within OfflineProvider');
  return context;
};
