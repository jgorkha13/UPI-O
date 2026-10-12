import api from './axios';

export const rechargeMobile = async (payload) => {
  const { data } = await api.post('/api/transactions/recharge', payload);
  return data;
};
