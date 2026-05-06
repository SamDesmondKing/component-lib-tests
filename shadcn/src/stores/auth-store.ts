import { create } from "zustand";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1000));
    if (email && password.length >= 6) {
      set({ token: "mock-jwt-token", isLoading: false });
      return true;
    }
    set({ isLoading: false });
    return false;
  },
  logout: () => set({ token: null }),
}));
