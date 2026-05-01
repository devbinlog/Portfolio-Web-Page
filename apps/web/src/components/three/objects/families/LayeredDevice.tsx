'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { THEME_3D_CONFIG } from '@/lib/world/theme3d'

interface LayeredDeviceProps {
  theme: 'dark' | 'light'
  hovered: boolean
  onClick: () => void
  onPointerEnter: () => void
  onPointerLeave: () => void
}

/**
 * LayeredDevice — Design 카테고리용 오브젝트 패밀리
 * 얇은 박스 레이어 스택 + 테두리 엣지 + 부유 효과
 */
export function LayeredDevice({
  theme,
  hovered,
  onClick,
  onPointerEnter,
  onPointerLeave,
}: LayeredDeviceProps) {
  const groupRef = useRef<THREE.Group>(null)
  const layer1Ref = useRef<THREE.Mesh>(null)
  const layer2Ref = useRef<THREE.Mesh>(null)
  const layer3Ref = useRef<THREE.Mesh>(null)
  const cfg = THEME_3D_CONFIG[theme]

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()

    // 전체 그룹 천천히 회전
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
    }

    // 레이어별 미세 진동 (hover 시 벌어짐)
    const spread = hovered ? 0.38 : 0.24
    const breathe = Math.sin(t * 0.8) * 0.02

    if (layer1Ref.current) {
      layer1Ref.current.position.y = spread + breathe
    }
    if (layer2Ref.current) {
      layer2Ref.current.position.y = breathe * 0.5
    }
    if (layer3Ref.current) {
      layer3Ref.current.position.y = -(spread + breathe)
    }
  })

  const layerGeo: [number, number, number] = [1.4, 0.12, 1.0]

  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* 상단 레이어 */}
      <mesh ref={layer1Ref} position={[0, 0.24, 0]}>
        <boxGeometry args={layerGeo} />
        <meshStandardMaterial
          color={cfg.device.color}
          emissive={cfg.device.emissive}
          emissiveIntensity={hovered ? cfg.device.emissiveIntensity * 2 : cfg.device.emissiveIntensity}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* 중간 레이어 */}
      <mesh ref={layer2Ref} position={[0, 0, 0]} scale={[0.88, 1, 0.88]}>
        <boxGeometry args={layerGeo} />
        <meshStandardMaterial
          color={cfg.device.layerColor}
          emissive={cfg.device.emissive}
          emissiveIntensity={hovered ? cfg.device.emissiveIntensity * 1.5 : cfg.device.emissiveIntensity * 0.6}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>

      {/* 하단 레이어 */}
      <mesh ref={layer3Ref} position={[0, -0.24, 0]} scale={[0.72, 1, 0.72]}>
        <boxGeometry args={layerGeo} />
        <meshStandardMaterial
          color={cfg.device.color}
          emissive={cfg.device.emissive}
          emissiveIntensity={hovered ? cfg.device.emissiveIntensity * 1.2 : cfg.device.emissiveIntensity * 0.4}
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>

      {/* 엣지 라인 (hover 시) */}
      {hovered && (
        <mesh>
          <boxGeometry args={[1.5, 0.85, 1.1]} />
          <meshBasicMaterial
            color={cfg.device.highlightColor}
            transparent
            opacity={0.12}
            wireframe
          />
        </mesh>
      )}
    </group>
  )
}
