import api from './axios';

export const login = async (phone, password) => {
  const response = await api.post('/api/auth/login', { phone, password });
  return response.data;
};

export const register = async (name, phone, password) => {
  const response = await api.post('/api/auth/register', { name, phone, password });
  return response.data;
};
