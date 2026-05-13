import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useCustomerStore = create((set) => ({
  customers: [],
  currentCustomer: null,
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  clearError: () => set({ error: "" }),

  fetchCustomers: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/customers", { params });
      const { data, meta } = res.data?.data || { data: [], meta: {} };
      set({ customers: data, pagination: meta, isLoading: false });
      return data;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load customers"),
        isLoading: false,
      });
      throw error;
    }
  },

  fetchCustomerById: async (id) => {
    set({ isLoading: true, error: "", currentCustomer: null });
    try {
      const res = await api.get(`/customers/${id}`);
      set({ currentCustomer: res.data?.data || null, isLoading: false });
      return res.data?.data;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load customer"),
        isLoading: false,
      });
      throw error;
    }
  },

  createCustomer: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/customers", payload);
      const customer = res.data?.data;
      set((state) => ({
        customers: [customer, ...state.customers],
        isSubmitting: false,
      }));
      return customer;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to create customer"),
        isSubmitting: false,
      });
      throw error;
    }
  },

  updateCustomer: async (id, payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.patch(`/customers/${id}`, payload);
      const updated = res.data?.data;
      set((state) => ({
        customers: state.customers.map((c) =>
          c.customer_id === id ? updated : c,
        ),
        currentCustomer:
          state.currentCustomer?.customer_id === id
            ? updated
            : state.currentCustomer,
        isSubmitting: false,
      }));
      return updated;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to update customer"),
        isSubmitting: false,
      });
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    set({ isDeleting: true, error: "" });
    try {
      await api.delete(`/customers/${id}`);
      set((state) => ({
        customers: state.customers.map((c) =>
          c.customer_id === id ? { ...c, is_active: false } : c,
        ),
        isDeleting: false,
      }));
      return true;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to delete customer"),
        isDeleting: false,
      });
      throw error;
    }
  },
}));
