'use client'

import { THEME_3D_CONFIG } from '@/lib/world/theme3d'

interface WorldLightingProps {
  theme: 'dark' | 'light'
}

export function WorldLighting({ theme }: WorldLightingProps) {
  const cfg = THEME_3D_CONFIG[theme]

  return (
    <>
      <ambientLight color={cfg.ambient.color} intensity={cfg.ambient.intensity} />
      <directionalLight
        color={cfg.directional.color}
        intensity={cfg.directional.intensity}
        position={[8, 12, 8]}
      />
      <pointLight
        color={cfg.pointLight.color}
        intensity={cfg.pointLight.intensity}
        position={[0, 2, 2]}
        distance={12}
        decay={2}
      />
      <hemisphereLight
        color={cfg.hemi.sky}
        groundColor={cfg.hemi.ground}
        intensity={cfg.hemi.intensity}
      />
    </>
  )
}
