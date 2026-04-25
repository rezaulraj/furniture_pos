import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useStockAlertStore = create((set) => ({
  lowStockAlerts: [],
  overStockAlerts: [],
  summary: {
    lowStockCount: 0,
    outOfStockCount: 0,
    overStockCount: 0,
  },
  isLoading: false,
  error: "",

  clearError: () => set({ error: "" }),

  fetchLowStockAlerts: async (params = {}) => {
    set({ isLoading: true, error: "" });

    try {
      const res = await api.get("/stock-alerts", { params });
      const lowStockAlerts = res.data?.data || [];

      set({ lowStockAlerts, isLoading: false });
      return lowStockAlerts;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load stock alerts"),
        isLoading: false,
      });
      throw error;
    }
  },

  fetchOverStockAlerts: async (params = {}) => {
    set({ isLoading: true, error: "" });

    try {
      const res = await api.get("/stock-alerts/overstock", { params });
      const overStockAlerts = res.data?.data || [];

      set({ overStockAlerts, isLoading: false });
      return overStockAlerts;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load overstock alerts"),
        isLoading: false,
      });
      throw error;
    }
  },

  fetchStockAlertSummary: async () => {
    set({ error: "" });

    try {
      const res = await api.get("/stock-alerts/summary");
      const summary = res.data?.data || {
        lowStockCount: 0,
        outOfStockCount: 0,
        overStockCount: 0,
      };

      set({ summary });
      return summary;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load alert summary"),
      });
      throw error;
    }
  },

  fetchAllStockAlerts: async (params = {}) => {
    set({ isLoading: true, error: "" });

    try {
      const [lowRes, overRes, summaryRes] = await Promise.all([
        api.get("/stock-alerts", { params }),
        api.get("/stock-alerts/overstock", { params }),
        api.get("/stock-alerts/summary"),
      ]);

      set({
        lowStockAlerts: lowRes.data?.data || [],
        overStockAlerts: overRes.data?.data || [],
        summary: summaryRes.data?.data || {
          lowStockCount: 0,
          outOfStockCount: 0,
          overStockCount: 0,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load stock alert data"),
        isLoading: false,
      });
      throw error;
    }
  },
}));
