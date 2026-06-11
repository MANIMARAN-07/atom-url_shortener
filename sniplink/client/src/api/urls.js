import api from './axios';

export const createUrl = (data) => api.post('/urls', data);
export const getUrls = (page = 1, limit = 10) => api.get(`/urls?page=${page}&limit=${limit}`);
export const deleteUrl = (id) => api.delete(`/urls/${id}`);
export const updateUrl = (id, data) => api.patch(`/urls/${id}`, data);
export const getUrlAnalytics = (id) => api.get(`/urls/${id}/analytics`);
export const getQrCode = (id) => api.get(`/urls/${id}/qr`);

export const bulkUpload = (file) => {
  const formData = new FormData();
  formData.append('csv', file);
  return api.post('/urls/bulk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
