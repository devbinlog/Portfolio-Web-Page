import type { WorldObjectConfig } from '@portfolio/types'

// 슬러그 → 월드 오브젝트 설정
export const WORLD_OBJECT_CONFIGS: Record<string, WorldObjectConfig> = {
  bandstage: {
    projectId: 'bandstage',
    position: [-6, 0.5, -2],
    cameraTarget: {
      position: [-5, 1, 4],
      lookAt: [-6, 0.5, -2],
    },
  },
  pageofartist: {
    projectId: 'pageofartist',
    position: [6, -0.5, -3],
    cameraTarget: {
      position: [5, 0, 4],
      lookAt: [6, -0.5, -3],
    },
  },
  muse: {
    projectId: 'muse',
    position: [0, 1.0, -8],
    cameraTarget: {
      position: [1, 2, -2],
      lookAt: [0, 1, -8],
    },
  },
}
