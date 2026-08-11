import api from './axios';

export const getWallet = async () => {
  const { data } = await api.get('/api/wallet');
  return data;
};

export const addMoney = async (amount) => {
  const { data } = await api.post('/api/wallet/add', { amount });
  return data;
};
