import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rax_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('rax_token', token);
  } else {
    localStorage.removeItem('rax_token');
  }
};
export default api;
