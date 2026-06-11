import { useState, useCallback } from 'react';
import { getUrlAnalytics } from '../api/urls';
import { getOverview } from '../api/analytics';

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(async (urlId) => {
    setLoading(true);
    try {
      const { data } = await getUrlAnalytics(urlId);
      setAnalytics(data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getOverview();
      setOverview(data.data);
    } catch (error) {
      console.error('Failed to fetch overview:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { analytics, overview, loading, fetchAnalytics, fetchOverview };
};
