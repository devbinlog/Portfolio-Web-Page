'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { THEME_3D_CONFIG } from '@/lib/world/theme3d'

interface SignalOrbProps {
  theme: 'dark' | 'light'
  hovered: boolean
  onClick: () => void
  onPointerEnter: () => void
  onPointerLeave: () => void
}

export function SignalOrb({
  theme,
  hovered,
  onClick,
  onPointerEnter,
  onPointerLeave,
}: SignalOrbProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const cfg = THEME_3D_CONFIG[theme]

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.3
    }
  })

  return (
    <group>
      {/* BaseForm: 구체 */}
      <mesh onClick={onClick} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color={cfg.orb.color}
          emissive={cfg.orb.emissive}
          emissiveIntensity={hovered ? cfg.orb.emissiveIntensity * 2 : cfg.orb.emissiveIntensity}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* AccentLayer: 링 */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.2, 0.018, 8, 48]} />
        <meshStandardMaterial
          color={cfg.orb.ringColor}
          emissive={cfg.orb.emissive}
          emissiveIntensity={hovered ? cfg.orb.emissiveIntensity : cfg.orb.emissiveIntensity * 0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Highlight Ring: hover 시 표시 */}
      {hovered && (
        <mesh>
          <torusGeometry args={[1.05, 0.012, 8, 48]} />
          <meshBasicMaterial color={cfg.orb.highlightColor} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}
