import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useSaleStore = create((set) => ({
  sales: [],
  summary: {},
  pagination: {},
  currentSale: null,
  isLoading: false,
  isSubmitting: false,
  error: "",

  clearError: () => set({ error: "" }),

  fetchSales: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/sales", { params });
      const body = res.data;
      
      // If the backend returns { success: true, data: { data: [], meta: {} } }
      const payload = body?.data;
      
      if (payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload) {
        const result = payload.data;
        const isNested = result && typeof result === 'object' && 'data' in result;
        
        set({
          sales: isNested ? result.data : (Array.isArray(result) ? result : []),
          summary: isNested ? result.summary : {},
          pagination: payload.meta || {},
          isLoading: false,
        });
        return isNested ? result.data : result;
      } else {
        const salesArray = Array.isArray(payload) ? payload : (payload?.data || []);
        set({
          sales: salesArray,
          summary: payload?.summary || {},
          pagination: payload?.meta || {},
          isLoading: false,
        });
        return salesArray;
      }
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
