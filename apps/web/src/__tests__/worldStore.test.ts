import { describe, it, expect, beforeEach } from 'vitest'

// zustand 스토어 직접 테스트
describe('worldStore', () => {
  beforeEach(async () => {
    // 모듈 캐시 초기화
    vi.resetModules()
  })

  it('초기 상태는 initial', async () => {
    const { useWorldStore } = await import('@/stores/worldStore')
    const state = useWorldStore.getState()
    expect(state.phase).toBe('initial')
    expect(state.hoveredProjectId).toBeNull()
    expect(state.focusedProjectId).toBeNull()
  })

  it('setHovered → hover 페이즈', async () => {
    const { useWorldStore } = await import('@/stores/worldStore')
    useWorldStore.getState().setPhase('idle')
    useWorldStore.getState().setHovered('bandstage')

    const state = useWorldStore.getState()
    expect(state.phase).toBe('hover')
    expect(state.hoveredProjectId).toBe('bandstage')
  })

  it('setHovered(null) → idle 페이즈', async () => {
    const { useWorldStore } = await import('@/stores/worldStore')
    useWorldStore.getState().setPhase('idle')
    useWorldStore.getState().setHovered('bandstage')
    useWorldStore.getState().setHovered(null)

    const state = useWorldStore.getState()
    expect(state.phase).toBe('idle')
    expect(state.hoveredProjectId).toBeNull()
  })

  it('setFocused → focus 페이즈', async () => {
    const { useWorldStore } = await import('@/stores/worldStore')
    useWorldStore.getState().setFocused('muse')

    const state = useWorldStore.getState()
    expect(state.phase).toBe('focus')
    expect(state.focusedProjectId).toBe('muse')
  })

  it('returnToWorld → idle + null', async () => {
    const { useWorldStore } = await import('@/stores/worldStore')
    useWorldStore.getState().setFocused('muse')
    useWorldStore.getState().returnToWorld()

    const state = useWorldStore.getState()
    expect(state.phase).toBe('idle')
    expect(state.focusedProjectId).toBeNull()
    expect(state.hoveredProjectId).toBeNull()
  })
})

// vi를 import
import { vi } from 'vitest'
