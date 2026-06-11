import api from './axios';

export const signupUser = (data) => api.post('/auth/signup', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const refreshToken = (refreshToken) => api.post('/auth/refresh', { refreshToken });
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.patch('/auth/profile', data);
export const changePassword = (data) => api.patch('/auth/password', data);
