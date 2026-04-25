import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useStockTransferStore = create((set) => ({
  transfers: [],
  isLoading: false,
  isSubmitting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchTransfers: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/transfers", { params });
      const transfers = res.data?.data || [];
      set({ transfers, isLoading: false });
      return transfers;
    } catch (error) {
      const message = normalizeError(error, "Failed to load stock transfers");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createTransfer: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/transfers", payload);
      const transfer = res.data?.data;

      set((state) => ({
        transfers: [transfer, ...state.transfers],
        isSubmitting: false,
      }));

      return transfer;
    } catch (error) {
      const message = normalizeError(error, "Failed to create stock transfer");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },
}));
