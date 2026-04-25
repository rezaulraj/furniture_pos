import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useTranslationStore = create((set) => ({
  translations: {},
  languages: [],
  isLoading: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchLanguages: async () => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/translations/languages");
      const languages = res.data?.data || [];
      set({ languages, isLoading: false });
      return languages;
    } catch (error) {
      const message = normalizeError(error, "Failed to load languages");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchTranslations: async (langCode) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get(`/translations/${langCode}`);
      const translations = res.data?.data || {};
      
      set((state) => ({
        translations: {
          ...state.translations,
          [langCode]: translations,
        },
        isLoading: false,
      }));
      
      return translations;
    } catch (error) {
      const message = normalizeError(error, `Failed to load translations for ${langCode}`);
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));
