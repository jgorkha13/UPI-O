import api from './axios';

export const sendMoney = async (receiverPhone, amount) => {
  const { data } = await api.post('/api/transactions', { receiverPhone, amount });
  return data;
};

export const getTransactions = async () => {
  const { data } = await api.get('/api/transactions');
  return data;
};
