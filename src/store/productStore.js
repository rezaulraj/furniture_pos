import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

const toFormData = (payload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  return formData;
};

export const useProductStore = create((set) => ({
  products: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/products", { params });
      const { data, meta } = res.data?.data || { data: [], meta: {} };
      set({ products: data, pagination: meta, isLoading: false });
      return data;
    } catch (error) {
      const message = normalizeError(error, "Failed to load products");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createProduct: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const formData = toFormData(payload);

      const res = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const product = res.data?.data;

      set((state) => ({
        products: [product, ...state.products],
        isSubmitting: false,
      }));

      return product;
    } catch (error) {
      const message = normalizeError(error, "Failed to create product");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  updateProduct: async (productId, payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const formData = toFormData(payload);

      const res = await api.patch(`/products/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const product = res.data?.data;

      set((state) => ({
        products: state.products.map((item) =>
          item.product_id === productId ? product : item,
        ),
        isSubmitting: false,
      }));

      return product;
    } catch (error) {
      const message = normalizeError(error, "Failed to update product");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    set({ isDeleting: true, error: "" });
    try {
      await api.delete(`/products/${productId}`);

      set((state) => ({
        products: state.products.filter(
          (item) => item.product_id !== productId,
        ),
        isDeleting: false,
      }));

      return true;
    } catch (error) {
      const message = normalizeError(error, "Failed to delete product");
      set({ error: message, isDeleting: false });
      throw error;
    }
  },
}));
