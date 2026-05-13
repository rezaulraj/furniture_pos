import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useBranchStore = create((set, get) => ({
  branches: [],
  currentBranch: null,
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchBranches: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/branches", { params });
      const { data, meta } = res.data?.data || { data: [], meta: {} };
      set({ branches: data, pagination: meta, isLoading: false });
      return data;
    } catch (error) {
      const message = normalizeError(error, "Failed to load branches");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchBranchById: async (branchId) => {
    set({ isLoading: true, error: "", currentBranch: null });
    try {
      const res = await api.get(`/branches/${branchId}`);
      const branch = res.data?.data || null;
      set({ currentBranch: branch, isLoading: false });
      return branch;
    } catch (error) {
      const message = normalizeError(error, "Failed to load branch");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createBranch: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/branches", payload);
      const branch = res.data?.data;

      set((state) => ({
        branches: [branch, ...state.branches],
        isSubmitting: false,
      }));

      return branch;
    } catch (error) {
      const message = normalizeError(error, "Failed to create branch");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  updateBranch: async (branchId, payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.put(`/branches/${branchId}`, payload);
      const updatedBranch = res.data?.data;

      set((state) => ({
        branches: state.branches.map((item) =>
          item.store_id === branchId ? updatedBranch : item,
        ),
        currentBranch:
          state.currentBranch?.store_id === branchId
            ? updatedBranch
            : state.currentBranch,
        isSubmitting: false,
      }));

      return updatedBranch;
    } catch (error) {
      const message = normalizeError(error, "Failed to update branch");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  deleteBranch: async (branchId) => {
    set({ isDeleting: true, error: "" });
    try {
      await api.delete(`/branches/${branchId}`);

      set((state) => ({
        branches: state.branches.map((item) =>
          item.store_id === branchId ? { ...item, is_active: false } : item,
        ),
        currentBranch:
          state.currentBranch?.store_id === branchId
            ? { ...state.currentBranch, is_active: false }
            : state.currentBranch,
        isDeleting: false,
      }));

      return true;
    } catch (error) {
      const message = normalizeError(error, "Failed to delete branch");
      set({ error: message, isDeleting: false });
      throw error;
    }
  },
}));
