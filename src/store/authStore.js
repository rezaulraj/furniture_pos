import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/axios";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setTokens: (access, refresh) =>
        set({
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: !!access,
        }),

      setUser: (user) => set({ user }),

      register: async (payload) => {
        set({ isLoading: true });
        try {
          const res = await api.post("/auth/register", payload);
          return res.data;
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (payload) => {
        set({ isLoading: true });
        try {
          const res = await api.post("/auth/login", payload);
          const data = res.data?.data;

          set({
            user: data?.user,
            accessToken: data?.tokens?.access,
            refreshToken: data?.tokens?.refresh,
            isAuthenticated: true,
          });

          return res.data;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      hasRole: (roles = []) => {
        const user = get().user;
        if (!user?.role?.role_name) return false;
        return roles.includes(user.role.role_name.toLowerCase());
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
