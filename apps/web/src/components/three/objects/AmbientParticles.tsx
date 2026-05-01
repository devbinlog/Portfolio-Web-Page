'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePerformanceStore } from '@/stores/performanceStore'

interface AmbientParticlesProps {
  count?: number
  theme: 'dark' | 'light'
}

/**
 * AmbientParticles — 배경 공간감을 주는 부유 파티클
 * 랜덤 구체 형태로 월드 공간에 배치, 느리게 회전
 */
export function AmbientParticles({ count = 80, theme }: AmbientParticlesProps) {
  const ref = useRef<THREE.Points>(null)
  const isReducedMotion = usePerformanceStore((s) => s.isReducedMotion)

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // 구형 분포로 배치
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 8 + Math.random() * 14

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5
      pos[i * 3 + 2] = radius * Math.cos(phi)

      sz[i] = 0.015 + Math.random() * 0.025
    }

    return [pos, sz]
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current || isReducedMotion) return
    // 매우 느린 자전
    ref.current.rotation.y = clock.getElapsedTime() * 0.012
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.007) * 0.05
  })

  const color = theme === 'dark' ? '#888888' : '#aaaaaa'

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.04}
        sizeAttenuation
        transparent
        opacity={theme === 'dark' ? 0.35 : 0.2}
        depthWrite={false}
      />
    </points>
  )
}
