import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useReturnStore = create((set) => ({
  returns: [],
  isLoading: false,
  isSubmitting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchReturns: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/returns", { params });
      const returns = res.data?.data || [];
      set({ returns, isLoading: false });
      return returns;
    } catch (error) {
      const message = normalizeError(error, "Failed to load returns");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createReturn: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/returns", payload);
      const returnData = res.data?.data;

      set((state) => ({
        returns: [returnData, ...state.returns],
        isSubmitting: false,
      }));

      return returnData;
    } catch (error) {
      const message = normalizeError(error, "Failed to create return");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },
}));
