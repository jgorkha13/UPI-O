// IndexedDB wrapper for offline transactions
const DB_NAME = 'UPIODB';
const STORE_NAME = 'offlineTransactions';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'nonce' });
      }
    };
  });
};

export const saveOfflineTransaction = async (transaction) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(transaction);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const getAllOfflineTransactions = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const deleteOfflineTransaction = async (nonce) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(nonce);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};
