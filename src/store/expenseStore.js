import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useExpenseStore = create((set) => ({
  expenses: [],
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchExpenses: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/expenses", { params });
      const expenses = res.data?.data || [];
      set({ expenses, isLoading: false });
      return expenses;
    } catch (error) {
      const message = normalizeError(error, "Failed to load expenses");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createExpense: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/expenses", payload);
      const expense = res.data?.data;

      set((state) => ({
        expenses: [expense, ...state.expenses],
        isSubmitting: false,
      }));

      return expense;
    } catch (error) {
      const message = normalizeError(error, "Failed to create expense");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  updateExpense: async (expenseId, payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.patch(`/expenses/${expenseId}`, payload);
      const expense = res.data?.data;

      set((state) => ({
        expenses: state.expenses.map((item) =>
          item.expense_id === expenseId ? expense : item,
        ),
        isSubmitting: false,
      }));

      return expense;
    } catch (error) {
      const message = normalizeError(error, "Failed to update expense");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  deleteExpense: async (expenseId) => {
    set({ isDeleting: true, error: "" });
    try {
      await api.delete(`/expenses/${expenseId}`);

      set((state) => ({
        expenses: state.expenses.filter((item) => item.expense_id !== expenseId),
        isDeleting: false,
      }));

      return true;
    } catch (error) {
      const message = normalizeError(error, "Failed to delete expense");
      set({ error: message, isDeleting: false });
      throw error;
    }
  },
}));
