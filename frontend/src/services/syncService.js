import api from '../api/axios';
import { deleteOfflineTransaction } from './offlineService';

const NON_RETRYABLE = [
  'receiver not found',
  'cannot send money to yourself',
  'duplicate nonce',
  'already processed',
  'insufficient balance',
  'offline spending limit',
];

const shouldDropFailedSync = (message = '') => {
  const lower = message.toLowerCase();
  return NON_RETRYABLE.some((phrase) => lower.includes(phrase));
};

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
      if (shouldDropFailedSync(message)) {
        await deleteOfflineTransaction(tx.nonce);
        results.push({ nonce: tx.nonce, status: 'DROPPED', error: message });
      } else {
        results.push({ nonce: tx.nonce, status: 'FAILED', error: message });
      }
    }
  }

  return results;
};
