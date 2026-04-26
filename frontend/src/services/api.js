import axios from 'axios';

const API = axios.create({
  baseURL: 'https://escape-room-vgd1.onrender.com/api',
});

API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
