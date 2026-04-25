import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useUserStore = create((set) => ({
  users: [],
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  clearError: () => set({ error: "" }),
  setError: (error) => set({ error }),

  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/users", { params });
      const users = res.data?.data || [];
      set({ users, isLoading: false });
      return users;
    } catch (error) {
      const message = normalizeError(error, "Failed to load users");
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createUser: async (payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.post("/users", payload);
      const user = res.data?.data;

      set((state) => ({
        users: [user, ...state.users],
        isSubmitting: false,
      }));

      return user;
    } catch (error) {
      const message = normalizeError(error, "Failed to create user");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  updateUser: async (userId, payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.patch(`/users/${userId}`, payload);
      const user = res.data?.data;

      set((state) => ({
        users: state.users.map((item) =>
          item.id === userId ? user : item,
        ),
        isSubmitting: false,
      }));

      return user;
    } catch (error) {
      const message = normalizeError(error, "Failed to update user");
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    set({ isDeleting: true, error: "" });
    try {
      await api.delete(`/users/${userId}`);

      set((state) => ({
        users: state.users.filter((item) => item.id !== userId),
        isDeleting: false,
      }));

      return true;
    } catch (error) {
      const message = normalizeError(error, "Failed to delete user");
      set({ error: message, isDeleting: false });
      throw error;
    }
  },
}));
