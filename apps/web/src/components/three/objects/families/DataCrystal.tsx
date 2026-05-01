'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { THEME_3D_CONFIG } from '@/lib/world/theme3d'

interface DataCrystalProps {
  theme: 'dark' | 'light'
  hovered: boolean
  onClick: () => void
  onPointerEnter: () => void
  onPointerLeave: () => void
}

/**
 * DataCrystal — AI 카테고리용 오브젝트 패밀리
 * 다면체 크리스탈 + 회전하는 내부 코어 + 에너지 링
 */
export function DataCrystal({
  theme,
  hovered,
  onClick,
  onPointerEnter,
  onPointerLeave,
}: DataCrystalProps) {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const cfg = THEME_3D_CONFIG[theme]

  useFrame((_, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.25
      outerRef.current.rotation.x += delta * 0.1
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.5
      innerRef.current.rotation.z += delta * 0.3
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.6
    }
  })

  return (
    <group>
      {/* 외부 크리스탈 (icosahedron) */}
      <mesh
        ref={outerRef}
        onClick={onClick}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial
          color={cfg.crystal.color}
          emissive={cfg.crystal.emissive}
          emissiveIntensity={hovered ? cfg.crystal.emissiveIntensity * 2.2 : cfg.crystal.emissiveIntensity}
          roughness={0.1}
          metalness={0.6}
          wireframe={false}
        />
      </mesh>

      {/* 내부 코어 (octahedron) */}
      <mesh ref={innerRef} scale={0.42}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={cfg.crystal.edgeColor}
          emissive={cfg.crystal.emissive}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.0}
          metalness={0.9}
        />
      </mesh>

      {/* 에너지 링 */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.016, 8, 48]} />
        <meshStandardMaterial
          color={cfg.crystal.edgeColor}
          emissive={cfg.crystal.emissive}
          emissiveIntensity={hovered ? 0.6 : 0.2}
          roughness={0.2}
        />
      </mesh>

      {/* hover 하이라이트 */}
      {hovered && (
        <mesh>
          <icosahedronGeometry args={[0.95, 1]} />
          <meshBasicMaterial
            color={cfg.crystal.highlightColor}
            transparent
            opacity={0.08}
            wireframe
          />
        </mesh>
      )}
    </group>
  )
}
