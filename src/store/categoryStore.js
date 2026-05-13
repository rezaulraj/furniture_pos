import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useCategoryStore = create((set, get) => ({
  categories: [],
  summary: {},
  pagination: null,
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  setError: (error) => set({ error }),
  clearError: () => set({ error: "" }),

  fetchCategories: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/categories", { params });
      const payload = res.data?.data;

      if (payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload) {
        const result = payload.data;
        const isNested = result && typeof result === 'object' && 'data' in result;
        set({
          categories: isNested ? result.data : (Array.isArray(result) ? result : []),
          summary: isNested ? result.summary : {},
          pagination: payload.meta || null,
          isLoading: false,
        });
        return isNested ? result.data : result;
      } else {
        const data = payload?.data || payload || [];
        set({ categories: Array.isArray(data) ? data : [], summary: payload?.summary || {}, pagination: payload?.meta || null, isLoading: false });
        return Array.isArray(data) ? data : [];
      }
    } catch (error) {
      const message = normalizeError(error, "Failed to load categories");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createCategory: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/categories", payload);
      const newCategory = res.data?.data;

      set((state) => ({
        categories: [newCategory, ...state.categories],
        isSubmitting: false,
      }));

      return newCategory;
    } catch (error) {
      const message = normalizeError(error, "Failed to create category");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  updateCategory: async (categoryId, payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.patch(`/categories/${categoryId}`, payload);
      const updatedCategory = res.data?.data;

      set((state) => ({
        categories: state.categories.map((item) =>
          item.category_id === categoryId ? updatedCategory : item,
        ),
        isSubmitting: false,
      }));

      return updatedCategory;
    } catch (error) {
      const message = normalizeError(error, "Failed to update category");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  deleteCategory: async (categoryId) => {
    set({ isDeleting: true, error: "" });
    try {
      await api.delete(`/categories/${categoryId}`);

      set((state) => ({
        categories: state.categories.map((item) =>
          item.category_id === categoryId
            ? { ...item, is_active: false }
            : item,
        ),
        isDeleting: false,
      }));

      return true;
    } catch (error) {
      const message = normalizeError(error, "Failed to delete category");
      set({ error: message, isDeleting: false });
      throw error;
    }
  },
}));
