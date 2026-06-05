import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

// ─── Generic fetch hook ────────────────────────────────────────────────────────
export const useFetch = (url, options = {}) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(url, options);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// ─── Lessons hook ─────────────────────────────────────────────────────────────
export const useLessons = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return useFetch(`/lessons${query ? `?${query}` : ''}`);
};

// ─── Quiz hook ────────────────────────────────────────────────────────────────
export const useQuiz = (count = 10, category = '') => {
  const query = `?count=${count}${category ? `&category=${category}` : ''}`;
  return useFetch(`/quizzes/random${query}`);
};

// ─── Vocabulary hook ──────────────────────────────────────────────────────────
export const useVocabulary = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return useFetch(`/vocabulary${query ? `?${query}` : ''}`);
};

// ─── Progress hooks ────────────────────────────────────────────────────────────
export const useDashboardSummary = () => useFetch('/progress/summary');
export const useWeeklyProgress   = () => useFetch('/progress/weekly');

// ─── Leaderboard hook ─────────────────────────────────────────────────────────
export const useLeaderboard = () => useFetch('/users/leaderboard');

// ─── Submit hook (POST/PUT/DELETE) ────────────────────────────────────────────
export const useSubmit = () => {
  const [loading, setLoading] = useState(false);

  const submit = async (method, url, body = null, successMsg = '') => {
    try {
      setLoading(true);
      const res = await api[method](url, body);
      if (successMsg) toast.success(successMsg);
      return { ok: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast.error(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
};
