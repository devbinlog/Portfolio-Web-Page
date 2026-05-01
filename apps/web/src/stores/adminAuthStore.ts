import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminAuthStore {
  isAuthenticated: boolean
  accessToken: string | null
  login: (token: string) => void
  logout: () => void
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      login: (token) => set({ isAuthenticated: true, accessToken: token }),
      logout: () => set({ isAuthenticated: false, accessToken: null }),
    }),
    { name: 'admin-auth' },
  ),
)
