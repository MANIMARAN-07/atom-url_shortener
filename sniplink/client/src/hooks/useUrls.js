import { useState, useCallback } from 'react';
import { getUrls, createUrl, deleteUrl, updateUrl } from '../api/urls';

export const useUrls = () => {
  const [urls, setUrls] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchUrls = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getUrls(page);
      setUrls(data.data.urls);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch URLs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addUrl = async (urlData) => {
    const { data } = await createUrl(urlData);
    return data;
  };

  const removeUrl = async (id) => {
    await deleteUrl(id);
    setUrls((prev) => prev.filter((u) => u._id !== id));
  };

  const editUrl = async (id, updates) => {
    const { data } = await updateUrl(id, updates);
    setUrls((prev) => prev.map((u) => (u._id === id ? data.data.url : u)));
    return data;
  };

  return { urls, pagination, loading, fetchUrls, addUrl, removeUrl, editUrl };
};
