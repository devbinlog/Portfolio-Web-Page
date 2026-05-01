import { create } from 'zustand'
import type { WorldPhase } from '@portfolio/types'

interface WorldStore {
  phase: WorldPhase
  hoveredProjectId: string | null
  focusedProjectId: string | null
  setPhase: (phase: WorldPhase) => void
  setHovered: (projectId: string | null) => void
  setFocused: (projectId: string | null) => void
  returnToWorld: () => void
}

export const useWorldStore = create<WorldStore>((set) => ({
  phase: 'initial',
  hoveredProjectId: null,
  focusedProjectId: null,
  setPhase: (phase) => set({ phase }),
  setHovered: (projectId) =>
    set((state) => {
      // overlay/focus/detail 상태일 때는 hover 무시
      if (['overlay', 'focus', 'detail'].includes(state.phase)) {
        return { hoveredProjectId: projectId }
      }
      return {
        hoveredProjectId: projectId,
        phase: projectId ? 'hover' : 'idle',
      }
    }),
  setFocused: (projectId) =>
    set({ focusedProjectId: projectId, phase: projectId ? 'focus' : 'idle' }),
  returnToWorld: () =>
    set({ phase: 'idle', focusedProjectId: null, hoveredProjectId: null }),
}))
