import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useReturnStore = create((set) => ({
  salesReturns: [],
  purchaseReturns: [],
  isLoading: false,
  isSubmitting: false,
  isUpdating: false,
  error: "",

  clearError: () => set({ error: "" }),

  fetchSalesReturns: async () => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/returns/sales");
      const salesReturns = res.data?.data || [];
      set({ salesReturns, isLoading: false });
      return salesReturns;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load sales returns"),
        isLoading: false,
      });
      throw error;
    }
  },

  createSalesReturn: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/returns/sales", payload);
      const data = res.data?.data;

      set((state) => ({
        salesReturns: [data, ...state.salesReturns],
        isSubmitting: false,
      }));

      return data;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to create sales return"),
        isSubmitting: false,
      });
      throw error;
    }
  },

  approveSalesReturn: async (id, status) => {
    set({ isUpdating: true, error: "" });
    try {
      const res = await api.patch(`/returns/sales/${id}/approve`, { status });
      const data = res.data?.data;

      set((state) => ({
        salesReturns: state.salesReturns.map((item) =>
          item.return_id === id ? data : item,
        ),
        isUpdating: false,
      }));

      return data;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to update sales return"),
        isUpdating: false,
      });
      throw error;
    }
  },

  fetchPurchaseReturns: async () => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/returns/purchases");
      const purchaseReturns = res.data?.data || [];
      set({ purchaseReturns, isLoading: false });
      return purchaseReturns;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load purchase returns"),
        isLoading: false,
      });
      throw error;
    }
  },

  createPurchaseReturn: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/returns/purchases", payload);
      const data = res.data?.data;

      set((state) => ({
        purchaseReturns: [data, ...state.purchaseReturns],
        isSubmitting: false,
      }));

      return data;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to create purchase return"),
        isSubmitting: false,
      });
      throw error;
    }
  },

  approvePurchaseReturn: async (id, status) => {
    set({ isUpdating: true, error: "" });
    try {
      const res = await api.patch(`/returns/purchases/${id}/approve`, {
        status,
      });
      const data = res.data?.data;

      set((state) => ({
        purchaseReturns: state.purchaseReturns.map((item) =>
          item.return_id === id ? data : item,
        ),
        isUpdating: false,
      }));

      return data;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to update purchase return"),
        isUpdating: false,
      });
      throw error;
    }
  },
}));
