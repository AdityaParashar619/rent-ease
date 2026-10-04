import React from 'react';
import { useOffline } from '../../store/offlineContext';
import { DESKTOP_SHORTCUTS } from '../../constants';
import { Keyboard, X } from 'lucide-react';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useOffline();

  if (!isShortcutsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
            <Keyboard className="h-5 w-5" />
            <h3 className="text-base font-display text-slate-900 dark:text-white">Desktop Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {DESKTOP_SHORTCUTS.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 text-sm"
            >
              <span className="text-slate-600 dark:text-slate-300">{sc.description}</span>
              <kbd className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-mono font-semibold text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
          Tip: RentEase is optimized for macOS & Windows desktop operation with seamless offline caching.
        </p>

        <button
          onClick={() => setIsShortcutsModalOpen(false)}
          className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
