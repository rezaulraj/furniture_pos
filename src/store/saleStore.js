import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useSaleStore = create((set) => ({
  sales: [],
  currentSale: null,
  isLoading: false,
  isSubmitting: false,
  error: "",

  clearError: () => set({ error: "" }),

  fetchSales: async () => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/sales");
      const sales = res.data?.data || [];
      set({ sales, isLoading: false });
      return sales;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load sales"),
        isLoading: false,
      });
      throw error;
    }
  },

  fetchSaleById: async (id) => {
    set({ isLoading: true, error: "", currentSale: null });
    try {
      const res = await api.get(`/sales/${id}`);
      const sale = res.data?.data || null;
      set({ currentSale: sale, isLoading: false });
      return sale;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load sale"),
        isLoading: false,
      });
      throw error;
    }
  },

  createSale: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/sales", payload);
      const sale = res.data?.data;

      set((state) => ({
        sales: [sale, ...state.sales],
        isSubmitting: false,
      }));

      return sale;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to create sale"),
        isSubmitting: false,
      });
      throw error;
    }
  },
}));
