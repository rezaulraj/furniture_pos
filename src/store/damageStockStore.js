import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useDamageStockStore = create((set) => ({
  damageStocks: [],
  pagination: {},
  summary: {},
  isLoading: false,
  isSubmitting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchDamageStocks: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/damage-stock", { params });
      const payload = res.data?.data;
      if (payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload) {
        const result = payload.data;
        const isNested = result && typeof result === 'object' && 'data' in result;
        const list = isNested ? result.data : (Array.isArray(result) ? result : []);
        set({
          damageStocks: list,
          summary: isNested ? result.summary : {},
          pagination: payload.meta || {},
          isLoading: false
        });
        return list;
      }
      const list = Array.isArray(payload) ? payload : [];
      set({ damageStocks: list, isLoading: false });
      return list;
    } catch (error) {
      const message = normalizeError(error, "Failed to load damage stocks");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchDamageById: async (id) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get(`/damage-stock/${id}`);
      const damageStock = res.data?.data;
      set({ isLoading: false });
      return damageStock;
    } catch (error) {
      const message = normalizeError(error, "Failed to load damage stock detail");
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

  updateDamageStatus: async (id, status) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.patch(`/damage-stock/${id}/status`, { status });
      const updated = res.data?.data;

      set((state) => ({
        damageStocks: state.damageStocks.map((item) =>
          item.damage_id === id ? updated : item,
        ),
        isSubmitting: false,
      }));

      return updated;
    } catch (error) {
      const message = normalizeError(error, "Failed to update damage status");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },
}));
