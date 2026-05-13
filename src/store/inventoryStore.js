import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useInventoryStore = create((set) => ({
  inventory: [],
  summary: {},
  pagination: {},
  currentInventory: null,
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  clearError: () => set({ error: "" }),

  fetchInventory: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/inventory", { params });
      const payload = res.data?.data;

      if (payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload) {
        const result = payload.data;
        const isNested = result && typeof result === 'object' && 'data' in result;

        set({
          inventory: isNested ? result.data : (Array.isArray(result) ? result : []),
          summary: isNested ? result.summary : {},
          pagination: payload.meta || {},
          isLoading: false,
        });
        return isNested ? result.data : result;
      } else {
        const data = payload?.data || [];
        set({ inventory: data, summary: payload?.summary || {}, pagination: payload?.meta || {}, isLoading: false });
        return data;
      }
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load inventory"),
        isLoading: false,
      });
      throw error;
    }
  },

  createInventory: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/inventory", payload);
      const item = res.data?.data;

      set((state) => ({
        inventory: [item, ...state.inventory],
        isSubmitting: false,
      }));

      return item;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to create inventory"),
        isSubmitting: false,
      });
      throw error;
    }
  },

  addStock: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/inventory/add-stock", payload);
      const updated = res.data?.data;

      set((state) => ({
        inventory: state.inventory.map((item) =>
          item.inventory_id === updated.inventory_id ? updated : item,
        ),
        isSubmitting: false,
      }));

      return updated;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to add stock"),
        isSubmitting: false,
      });
      throw error;
    }
  },

  updateInventory: async (inventoryId, payload) => {

    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.patch(`/inventory/${inventoryId}`, payload);
      const updated = res.data?.data;

      set((state) => ({
        inventory: state.inventory.map((item) =>
          item.inventory_id === inventoryId ? updated : item,
        ),
        isSubmitting: false,
      }));

      return updated;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to update inventory"),
        isSubmitting: false,
      });
      throw error;
    }
  },

  deleteInventory: async (inventoryId) => {
    set({ isDeleting: true, error: "" });
    try {
      await api.delete(`/inventory/${inventoryId}`);

      set((state) => ({
        inventory: state.inventory.filter(
          (item) => item.inventory_id !== inventoryId,
        ),
        isDeleting: false,
      }));

      return true;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to delete inventory"),
        isDeleting: false,
      });
      throw error;
    }
  },
}));
