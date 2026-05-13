import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useStockTransferStore = create((set) => ({
  transfers: [],
  pagination: {},
  currentTransfer: null,
  isLoading: false,
  isSubmitting: false,
  isUpdating: false,
  error: "",

  clearError: () => set({ error: "" }),

  fetchTransfers: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/transfers", { params });
      const payload = res.data?.data;
      if (payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload) {
        const result = payload.data;
        const isNested = result && typeof result === 'object' && 'data' in result;
        const list = isNested ? result.data : (Array.isArray(result) ? result : []);
        set({ transfers: list, pagination: payload.meta || {}, isLoading: false });
        return list;
      }
      const list = Array.isArray(payload) ? payload : (payload?.data || []);
      set({ transfers: list, pagination: payload?.meta || {}, isLoading: false });
      return list;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load stock transfers"),
        isLoading: false,
      });
      throw error;
    }
  },

  fetchTransferById: async (id) => {
    set({ isLoading: true, error: "", currentTransfer: null });
    try {
      const res = await api.get(`/transfers/${id}`);
      const transfer = res.data?.data || null;
      set({ currentTransfer: transfer, isLoading: false });
      return transfer;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load stock transfer"),
        isLoading: false,
      });
      throw error;
    }
  },

  createTransfer: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/transfers", payload);
      const transfer = res.data?.data;

      set((state) => ({
        transfers: [transfer, ...state.transfers],
        isSubmitting: false,
      }));

      return transfer;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to create stock transfer"),
        isSubmitting: false,
      });
      throw error;
    }
  },

  updateTransferStatus: async (id, payload) => {
    set({ isUpdating: true, error: "" });
    try {
      const res = await api.patch(`/transfers/${id}/status`, payload);
      const updated = res.data?.data;

      set((state) => ({
        transfers: state.transfers.map((item) =>
          item.transfer_id === id ? updated : item,
        ),
        currentTransfer:
          state.currentTransfer?.transfer_id === id
            ? updated
            : state.currentTransfer,
        isUpdating: false,
      }));

      return updated;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to update transfer status"),
        isUpdating: false,
      });
      throw error;
    }
  },
}));
