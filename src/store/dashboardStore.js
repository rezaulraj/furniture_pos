import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useDashboardStore = create((set) => ({
  stats: null,
  recentSales: [],
  recentPurchases: [],
  isLoading: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchDashboardStats: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/dashboard/stats", { params });
      const stats = res.data?.data || null;
      set({ stats, isLoading: false });
      return stats;
    } catch (error) {
      const message = normalizeError(error, "Failed to load dashboard stats");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchRecentActivities: async () => {
    set({ isLoading: true, error: "" });
    try {
      const [salesRes, purchasesRes] = await Promise.all([
        api.get("/sales", { params: { limit: 5 } }),
        api.get("/purchases", { params: { limit: 5 } }),
      ]);
      
      set({ 
        recentSales: salesRes.data?.data || [], 
        recentPurchases: purchasesRes.data?.data || [],
        isLoading: false 
      });
    } catch (error) {
      const message = normalizeError(error, "Failed to load recent activities");
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));
