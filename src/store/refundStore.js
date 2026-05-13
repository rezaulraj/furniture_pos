import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useRefundStore = create((set) => ({
  refunds: [],
  pagination: {},
  isLoading: false,
  isSubmitting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchRefunds: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/refunds", { params });
      const payload = res.data?.data;
      if (payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload) {
        const result = payload.data;
        const isNested = result && typeof result === 'object' && 'data' in result;
        const list = isNested ? result.data : (Array.isArray(result) ? result : []);
        set({ refunds: list, pagination: payload.meta || {}, isLoading: false });
        return list;
      }
      const list = Array.isArray(payload) ? payload : (payload?.data || []);
      set({ refunds: list, pagination: payload?.meta || {}, isLoading: false });
      return list;
    } catch (error) {
      const message = normalizeError(error, "Failed to load refunds");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchSalesRefundById: async (id) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get(`/refunds/sales/${id}`);
      const refund = res.data?.data;
      set({ isLoading: false });
      return refund;
    } catch (error) {
      const message = normalizeError(error, "Failed to load sales refund detail");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchPurchaseRefundById: async (id) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get(`/refunds/purchase/${id}`);
      const refund = res.data?.data;
      set({ isLoading: false });
      return refund;
    } catch (error) {
      const message = normalizeError(error, "Failed to load purchase refund detail");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));
