import axios from 'axios';
import { deleteOfflineTransaction } from './offlineService';

export const syncOfflineTransactions = async (pendingTransactions, token) => {
  const results = [];

  for (const tx of pendingTransactions) {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/transactions',
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
