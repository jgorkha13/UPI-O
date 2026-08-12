import React, { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getWallet } from '../api/wallet';
import { getAllOfflineTransactions } from '../services/offlineService';
import { syncOfflineTransactions } from '../services/syncService';
import { getCachedWallet, setCachedWallet } from '../utils/walletCache';

export const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [walletVersion, setWalletVersion] = useState(0);

  const loadPending = useCallback(async () => {
    const pending = await getAllOfflineTransactions();
    setPendingTransactions(pending);
    return pending;
  }, []);

  const refreshWallet = useCallback(async () => {
    if (!navigator.onLine) return getCachedWallet();

    try {
      const wallet = await getWallet();
      setCachedWallet(wallet);
      setWalletVersion((v) => v + 1);
      return wallet;
    } catch {
      return getCachedWallet();
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  useEffect(() => {
    if (!isOnline) return;

    const syncPending = async () => {
      const pending = await getAllOfflineTransactions();
      if (pending.length === 0) return;

      const token = localStorage.getItem('token');
      if (!token) return;

      const results = await syncOfflineTransactions(pending, token);
      const synced = results.filter((r) => r.status === 'SUCCESS');
      const failed = results.filter((r) => r.status === 'FAILED');
      const dropped = results.filter((r) => r.status === 'DROPPED');

      await loadPending();
      if (synced.length > 0) {
        await refreshWallet();
        toast.success(`${synced.length} offline transaction(s) synced`);
      }
      if (dropped.length > 0) {
        await refreshWallet();
        toast.error(
          `${dropped.length} queued payment(s) removed — ${dropped[0].error || 'could not sync'}`
        );
      }
      if (failed.length > 0) {
        toast.error(`${failed.length} transaction(s) failed to sync — will retry`);
      }
    };

    syncPending();
  }, [isOnline, loadPending, refreshWallet]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        pendingTransactions,
        setPendingTransactions,
        walletVersion,
        refreshWallet,
        refreshPending: loadPending,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};
