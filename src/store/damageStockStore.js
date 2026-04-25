import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useDamageStockStore = create((set) => ({
  damageStocks: [],
  isLoading: false,
  isSubmitting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchDamageStocks: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/damage-stock", { params });
      const damageStocks = res.data?.data || [];
      set({ damageStocks, isLoading: false });
      return damageStocks;
    } catch (error) {
      const message = normalizeError(error, "Failed to load damage stocks");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  reportDamage: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/damage-stock", payload);
      const damageStock = res.data?.data;

      set((state) => ({
        damageStocks: [damageStock, ...state.damageStocks],
        isSubmitting: false,
      }));

      return damageStock;
    } catch (error) {
      const message = normalizeError(error, "Failed to report damage stock");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },
}));
