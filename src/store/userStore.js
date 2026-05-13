import { create } from "zustand";
import api from "../lib/axios";

const normalizeError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.errors ||
  error?.message ||
  fallback;

export const useUserStore = create((set) => ({
  users: [],
  summary: {},
  currentUser: null,
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  error: "",

  clearError: () => set({ error: "" }),

  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: "" });
    try {
      const res = await api.get("/users", { params });
      const payload = res.data?.data;

      if (payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload) {
        const result = payload.data;
        const isNested = result && typeof result === 'object' && 'data' in result;
        set({
          users: isNested ? result.data : (Array.isArray(result) ? result : []),
          summary: isNested ? result.summary : {},
          pagination: payload.meta || {},
          isLoading: false,
        });
        return isNested ? result.data : result;
      } else {
        const data = Array.isArray(payload) ? payload : (payload?.data || payload || []);
        set({ users: data, summary: payload?.summary || {}, pagination: payload?.meta || {}, isLoading: false });
        return data;
      }
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load users"),
        isLoading: false,
      });
      throw error;
    }
  },

  fetchUserById: async (userId) => {
    set({ isLoading: true, error: "", currentUser: null });
    try {
      const res = await api.get(`/users/${userId}`);
      const user = res.data?.data || null;
      set({ currentUser: user, isLoading: false });
      return user;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to load user"),
        isLoading: false,
      });
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
      set({
        error: normalizeError(error, "Failed to create user"),
        isSubmitting: false,
      });
      throw error;
    }
  },

  updateUser: async (userId, payload) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.put(`/users/${userId}`, payload);
      const user = res.data?.data;

      set((state) => ({
        users: state.users.map((item) =>
          item.users_id === Number(userId) ? user : item,
        ),
        currentUser: user,
        isSubmitting: false,
      }));

      return user;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to update user"),
        isSubmitting: false,
      });
      throw error;
    }
  },

  toggleUserStatus: async (userId) => {
    set({ isSubmitting: true, error: "" });
    try {
      const res = await api.patch(`/users/${userId}/toggle-status`);
      const updated = res.data?.data;

      set((state) => ({
        users: state.users.map((item) =>
          item.users_id === Number(userId)
            ? { ...item, is_active: updated.is_active }
            : item,
        ),
        isSubmitting: false,
      }));

      return updated;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to update status"),
        isSubmitting: false,
      });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    set({ isDeleting: true, error: "" });
    try {
      await api.delete(`/users/${userId}`);

      set((state) => ({
        users: state.users.filter((item) => item.users_id !== Number(userId)),
        isDeleting: false,
      }));

      return true;
    } catch (error) {
      set({
        error: normalizeError(error, "Failed to delete user"),
        isDeleting: false,
      });
      throw error;
    }
  },
}));
