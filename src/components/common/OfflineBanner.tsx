import React from 'react';
import { useOffline } from '../../store/offlineContext';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline, offlineQueueCount, syncOfflineQueue, setIsSimulatingOffline, isSimulatingOffline } =
    useOffline();
  const [syncing, setSyncing] = React.useState(false);

  if (isOnline && offlineQueueCount === 0) return null;

  const handleSync = async () => {
    setSyncing(true);
    await syncOfflineQueue();
    setSyncing(false);
  };

  return (
    <div className="bg-amber-500/90 text-amber-950 dark:bg-amber-600/90 dark:text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between shadow-xs transition">
      <div className="flex items-center gap-2">
        <WifiOff className="h-3.5 w-3.5" />
        <span>
          {!isOnline
            ? 'Desktop Offline Mode Active — Browsing and booking from encrypted local cache.'
            : `${offlineQueueCount} booking(s) pending sync to server.`}
        </span>
        {isSimulatingOffline && (
          <span className="rounded bg-amber-900/20 px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider">
            Simulation
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isSimulatingOffline && (
          <button
            onClick={() => setIsSimulatingOffline(false)}
            className="underline hover:opacity-80 text-[11px]"
          >
            Re-enable Online
          </button>
        )}
        {offlineQueueCount > 0 && isOnline && (
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1 rounded bg-amber-950 px-2 py-0.5 text-white hover:bg-black transition text-[11px]"
          >
            <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
            Sync Now
          </button>
        )}
      </div>
    </div>
  );
};
