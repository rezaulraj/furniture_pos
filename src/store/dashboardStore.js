import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useDashboardStore = create((set) => ({
  summary: null,
  isLoading: false,
  error: "",

  clearError: () => set({ error: "" }),

  fetchDashboardSummary: async (params = {}) => {
    set({ isLoading: true, error: "" });

    try {
      const res = await api.get("/dashboard/summary", { params });
      const summary = res.data?.data || null;

      set({ summary, isLoading: false });
      return summary;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load dashboard summary"),
        isLoading: false,
      });
      throw error;
    }
  },
}));
