import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000/api',
});
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsedUser = JSON.parse(user);
    config.headers['x-user-id'] = parsedUser._id;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;