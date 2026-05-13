import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useSupplierStore = create((set) => ({
  suppliers: [],
  summary: {},
  currentSupplier: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchSuppliers: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/suppliers", { params });
      const payload = res.data?.data;
      
      if (payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload) {
        const result = payload.data;
        const isNested = result && typeof result === 'object' && 'data' in result;
        
        set({
          suppliers: isNested ? result.data : (Array.isArray(result) ? result : []),
          summary: isNested ? result.summary : {},
          pagination: payload.meta || {},
          isLoading: false,
        });
        return isNested ? result.data : result;
      } else {
        const data = payload?.data || [];
        set({
          suppliers: data,
          summary: payload?.summary || {},
          pagination: payload?.meta || {},
          isLoading: false,
        });
        return data;
      }
    } catch (error) {
      const message = normalizeError(error, "Failed to load suppliers");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchSupplierById: async (supplierId) => {
    set({ isLoading: true, error: "", currentSupplier: null });
    try {
      const res = await api.get(`/suppliers/${supplierId}`);
      const supplier = res.data?.data || null;
      set({ currentSupplier: supplier, isLoading: false });
      return supplier;
    } catch (error) {
      const message = normalizeError(error, "Failed to load supplier");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createSupplier: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/suppliers", payload);
      const supplier = res.data?.data;

      set((state) => ({
        suppliers: [supplier, ...state.suppliers],
        isSubmitting: false,
      }));

      return supplier;
    } catch (error) {
      const message = normalizeError(error, "Failed to create supplier");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  updateSupplier: async (supplierId, payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.patch(`/suppliers/${supplierId}`, payload);
      const updatedSupplier = res.data?.data;

      set((state) => ({
        suppliers: state.suppliers.map((item) =>
          item.supplier_id === supplierId ? updatedSupplier : item,
        ),
        currentSupplier:
          state.currentSupplier?.supplier_id === supplierId
            ? updatedSupplier
            : state.currentSupplier,
        isSubmitting: false,
      }));

      return updatedSupplier;
    } catch (error) {
      const message = normalizeError(error, "Failed to update supplier");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  deleteSupplier: async (supplierId) => {
    set({ isDeleting: true, error: "" });
    try {
      await api.delete(`/suppliers/${supplierId}`);

      set((state) => ({
        suppliers: state.suppliers.map((item) =>
          item.supplier_id === supplierId
            ? { ...item, is_active: false }
            : item,
        ),
        currentSupplier:
          state.currentSupplier?.supplier_id === supplierId
            ? { ...state.currentSupplier, is_active: false }
            : state.currentSupplier,
        isDeleting: false,
      }));

      return true;
    } catch (error) {
      const message = normalizeError(error, "Failed to delete supplier");
      set({ error: message, isDeleting: false });
      throw error;
    }
  },
}));
