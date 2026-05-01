import { create } from 'zustand'
import { useWorldStore } from './worldStore'

interface OverlayStore {
  isOpen: boolean
  projectId: string | null
  openOverlay: (projectId: string) => void
  closeOverlay: () => void
}

export const useOverlayStore = create<OverlayStore>((set) => ({
  isOpen: false,
  projectId: null,
  openOverlay: (projectId) => {
    set({ isOpen: true, projectId })
    useWorldStore.getState().setPhase('overlay')
  },
  closeOverlay: () => {
    set({ isOpen: false, projectId: null })
    useWorldStore.getState().returnToWorld()
  },
}))
