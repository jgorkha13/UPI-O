import api from './axios';

export const lookupUserByPhone = async (phone) => {
  const { data } = await api.get('/api/users/lookup', { params: { phone } });
  return data;
};
