import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useStockAlertStore = create((set) => ({
  alerts: [],
  isLoading: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchAlerts: async () => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/stock-alerts");
      const alerts = res.data?.data || [];
      set({ alerts, isLoading: false });
      return alerts;
    } catch (error) {
      const message = normalizeError(error, "Failed to load stock alerts");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));
