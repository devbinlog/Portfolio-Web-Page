import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PerformanceStore {
  isReducedMotion: boolean
  isPerformanceMode: boolean
  setReducedMotion: (value: boolean) => void
  setPerformanceMode: (value: boolean) => void
}

export const usePerformanceStore = create<PerformanceStore>()(
  persist(
    (set) => ({
      isReducedMotion: false,
      isPerformanceMode: false,
      setReducedMotion: (value) => set({ isReducedMotion: value }),
      setPerformanceMode: (value) => set({ isPerformanceMode: value }),
    }),
    { name: 'performance-settings' },
  ),
)
