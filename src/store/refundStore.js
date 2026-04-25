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

  processRefund: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/refunds", payload);
      const refund = res.data?.data;

      set((state) => ({
        refunds: [refund, ...state.refunds],
        isSubmitting: false,
      }));

      return refund;
    } catch (error) {
      const message = normalizeError(error, "Failed to process refund");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },
}));
