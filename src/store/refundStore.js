import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useRefundStore = create((set) => ({
  refunds: [],
  isLoading: false,
  isSubmitting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchRefunds: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/refunds", { params });
      const refunds = res.data?.data || [];
      set({ refunds, isLoading: false });
      return refunds;
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
