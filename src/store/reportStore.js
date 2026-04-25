import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useReportStore = create((set) => ({
  reports: {},
  isLoading: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchReport: async (reportType, params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get(`/reports/${reportType}`, { params });
      const data = res.data?.data;
      
      set((state) => ({
        reports: {
          ...state.reports,
          [reportType]: data,
        },
        isLoading: false,
      }));
      
      return data;
    } catch (error) {
      const message = normalizeError(error, `Failed to load ${reportType} report`);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  downloadReport: async (reportType, params = {}) => {
    try {
      const res = await api.get(`/reports/${reportType}/export`, {
        params,
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${reportType}-report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      const message = normalizeError(error, "Failed to download report");
      set({ error: message });
      throw error;
    }
  },
}));
