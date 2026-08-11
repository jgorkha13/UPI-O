const CACHE_KEY = 'upio_wallet_cache';

export const getCachedWallet = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCachedWallet = (wallet) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(wallet));
};

export const adjustCachedWallet = (amount, { isOffline = false } = {}) => {
  const cached = getCachedWallet();
  if (!cached) return null;

  const updated = {
    ...cached,
    balance: Math.max(0, Number(cached.balance) - amount),
    lastSyncAt: new Date().toISOString(),
  };

  if (isOffline) {
    updated.offlineSpent = Number(cached.offlineSpent || 0) + amount;
  }

  setCachedWallet(updated);
  return updated;
};

export const creditCachedWallet = (amount) => {
  const cached = getCachedWallet();
  if (!cached) return null;

  const updated = {
    ...cached,
    balance: Number(cached.balance) + amount,
    lastSyncAt: new Date().toISOString(),
  };

  setCachedWallet(updated);
  return updated;
};
