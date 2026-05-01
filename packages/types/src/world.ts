export type WorldPhase =
  | 'initial'
  | 'intro'
  | 'idle'
  | 'hover'
  | 'focus'
  | 'overlay'
  | 'detail'

export type CameraState =
  | 'intro'
  | 'hub_default'
  | 'hover_soft_follow'
  | 'project_focus_move'
  | 'project_focus_hold'
  | 'detail_overlay_hold'
  | 'reset_move'

export type Theme = 'dark' | 'light'

export interface WorldObjectConfig {
  projectId: string
  position: [number, number, number]
  cameraTarget: {
    position: [number, number, number]
    lookAt: [number, number, number]
  }
}
