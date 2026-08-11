import api from '../api/axios';
import { deleteOfflineTransaction } from './offlineService';

export const syncOfflineTransactions = async (pendingTransactions, token) => {
  const results = [];

  for (const tx of pendingTransactions) {
    try {
      const response = await api.post(
        '/api/transactions',
        {
          receiverPhone: tx.receiverPhone,
          amount: tx.amount,
          nonce: tx.nonce,
          isOffline: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await deleteOfflineTransaction(tx.nonce);
      results.push({ nonce: tx.nonce, status: 'SUCCESS', data: response.data });
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      results.push({ nonce: tx.nonce, status: 'FAILED', error: message });
    }
  }

  return results;
};
