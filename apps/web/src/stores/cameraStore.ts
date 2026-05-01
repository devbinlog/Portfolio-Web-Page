import { create } from 'zustand'
import type { CameraState } from '@portfolio/types'

interface CameraStore {
  state: CameraState
  setState: (state: CameraState) => void
}

export const useCameraStore = create<CameraStore>((set) => ({
  state: 'intro',
  setState: (state) => set({ state }),
}))
