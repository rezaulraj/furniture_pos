import { create } from "zustand";
import api from "../lib/axios";

export const useDamageStore = create((set, get) => ({
  damages: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchDamages: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/damage-stock", { params });
      set({ damages: res.data?.data || [] });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch damage reports" });
    } finally {
      set({ isLoading: false });
    }
  },

  reportDamage: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await api.post("/damage-stock", payload);
      const newDamage = res.data?.data;
      set((state) => ({ damages: [newDamage, ...state.damages] }));
      return newDamage;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to report damage";
      set({ error: msg });
      throw new Error(msg);
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateDamageStatus: async (id, payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await api.patch(`/damage-stock/${id}/status`, payload);
      const updated = res.data?.data;
      set((state) => ({
        damages: state.damages.map((d) => (d.damage_id === id ? updated : d)),
      }));
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update status";
      set({ error: msg });
      throw new Error(msg);
    } finally {
      set({ isSubmitting: false });
    }
  },

  clearError: () => set({ error: null }),
}));
