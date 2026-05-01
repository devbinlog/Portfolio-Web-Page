'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { THEME_3D_CONFIG } from '@/lib/world/theme3d'
import { usePerformanceStore } from '@/stores/performanceStore'

interface IdentityCoreProps {
  theme: 'dark' | 'light'
}

export function IdentityCore({ theme }: IdentityCoreProps) {
  const cfg = THEME_3D_CONFIG[theme].core
  const isReducedMotion = usePerformanceStore((s) => s.isReducedMotion)

  const coreRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (isReducedMotion) return
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.2
    if (ring1Ref.current) ring1Ref.current.rotation.z -= delta * 0.15
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.1
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Core Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial
          color={cfg.color}
          emissive={cfg.emissive}
          emissiveIntensity={cfg.emissiveIntensity}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Outer Ring 1 */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.0, 0.02, 8, 64]} />
        <meshStandardMaterial
          color={cfg.ringColor}
          emissive={cfg.emissive}
          emissiveIntensity={cfg.emissiveIntensity * 0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Outer Ring 2 */}
      <mesh ref={ring2Ref} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[2.5, 0.015, 8, 64]} />
        <meshStandardMaterial
          color={cfg.ringColor}
          emissive={cfg.emissive}
          emissiveIntensity={cfg.emissiveIntensity * 0.3}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}
