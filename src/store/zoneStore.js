import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useZoneStore = create((set) => ({
  zones: [],
  isLoading: false,
  error: null,

  fetchZones: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/zones`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      set({ zones: res.data.data || res.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch zones",
        isLoading: false,
      });
    }
  },

  createZone: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/zones`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      set((state) => ({
        zones: [...state.zones, res.data.data || res.data],
        isLoading: false,
      }));
      return res.data.data || res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to create zone",
        isLoading: false,
      });
      throw err;
    }
  },
}));
