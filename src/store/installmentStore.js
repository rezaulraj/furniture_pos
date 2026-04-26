import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useInstallmentStore = create((set) => ({
  installments: [],
  isLoading: false,
  isSubmitting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchInstallments: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/installments", { params });
      const installments = res.data?.data || [];
      set({ installments, isLoading: false });
      return installments;
    } catch (error) {
      const message = normalizeError(error, "Failed to load installments");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchInstallmentById: async (id) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get(`/installments/${id}`);
      const installment = res.data?.data;
      set({ isLoading: false });
      return installment;
    } catch (error) {
      const message = normalizeError(error, "Failed to load installment");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createInstallmentPlan: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/installments/plan", payload);
      const data = res.data?.data;
      set({ isSubmitting: false });
      return data;
    } catch (error) {
      const message = normalizeError(error, "Failed to create installment plan");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  payInstallment: async (installmentId, payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post(`/installments/${installmentId}/payments`, payload);
      const updatedInstallment = res.data?.data;

      set((state) => ({
        installments: state.installments.map((item) =>
          item.installment_id === installmentId ? updatedInstallment : item,
        ),
        isSubmitting: false,
      }));

      return updatedInstallment;
    } catch (error) {
      const message = normalizeError(error, "Failed to pay installment");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },
}));
