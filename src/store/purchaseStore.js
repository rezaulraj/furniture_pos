import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const usePurchaseStore = create((set) => ({
  purchases: [],
  pagination: {},
  currentPurchase: null,
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  clearError: () => set({ error: "" }),

  fetchPurchases: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/purchases", { params });
      const body = res.data;
      const payload = body?.data;

      if (payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload) {
        set({
          purchases: payload.data || [],
          pagination: payload.meta || {},
          isLoading: false,
        });
        return payload.data;
      } else {
        const purchasesArray = Array.isArray(payload) ? payload : (payload?.data || []);
        set({
          purchases: purchasesArray,
          pagination: payload?.meta || {},
          isLoading: false,
        });
        return purchasesArray;
      }
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load purchases"),
        isLoading: false,
      });
      throw error;
    }
  },

  fetchPurchaseById: async (id) => {
    set({ isLoading: true, error: "", currentPurchase: null });
    try {
      const res = await api.get(`/purchases/${id}`);
      const purchase = res.data?.data || null;
      set({ currentPurchase: purchase, isLoading: false });
      return purchase;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load purchase"),
        isLoading: false,
      });
      throw error;
    }
  },

  createPurchase: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/purchases", payload);
      const purchase = res.data?.data;

      set((state) => ({
        purchases: [purchase, ...state.purchases],
        isSubmitting: false,
      }));

      return purchase;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to create purchase"),
        isSubmitting: false,
      });
      throw error;
    }
  },
}));
