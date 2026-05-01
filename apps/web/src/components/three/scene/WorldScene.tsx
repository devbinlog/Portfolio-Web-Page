'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { useTheme } from 'next-themes'
import type { ProjectSummary } from '@portfolio/types'
import { useWorldStore } from '@/stores/worldStore'
import { WorldLighting } from '../lighting/WorldLighting'
import { IdentityCore } from '../objects/IdentityCore'
import { ProjectObject } from '../objects/ProjectObject'
import { AmbientParticles } from '../objects/AmbientParticles'
import { SceneCamera } from '../camera/SceneCamera'
import { WORLD_OBJECT_CONFIGS } from '@/lib/world/configs'

interface WorldSceneProps {
  projects: ProjectSummary[]
}

/**
 * 인트로 트리거 — Canvas 내부 컴포넌트.
 * 마운트 시 'initial' → 'intro' 페이즈로 전환해 카메라 인트로를 시작.
 */
function IntroTrigger() {
  const phase = useWorldStore((s) => s.phase)
  const setPhase = useWorldStore((s) => s.setPhase)

  useEffect(() => {
    if (phase === 'initial') {
      // 짧은 딜레이 후 인트로 시작 (Canvas 렌더 안정화 대기)
      const timer = setTimeout(() => {
        setPhase('intro')
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [phase, setPhase])

  return null
}

export function WorldScene({ projects }: WorldSceneProps) {
  const { resolvedTheme } = useTheme()
  const theme = (resolvedTheme as 'dark' | 'light') || 'dark'

  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      camera={{ fov: 60, near: 0.1, far: 200, position: [0, 18, 22] }}
    >
      <Suspense fallback={null}>
        <IntroTrigger />
        <SceneCamera />
        <WorldLighting theme={theme} />

        {/* 배경 앰비언트 파티클 */}
        <AmbientParticles theme={theme} />

        {/* Identity Core */}
        <IdentityCore theme={theme} />

        {/* Featured 프로젝트 오브젝트 */}
        {projects.map((project) => {
          const config = WORLD_OBJECT_CONFIGS[project.slug]
          if (!config) return null
          return (
            <ProjectObject
              key={project.id}
              project={project}
              position={config.position}
              cameraTarget={config.cameraTarget}
              theme={theme}
            />
          )
        })}
      </Suspense>
    </Canvas>
  )
}
