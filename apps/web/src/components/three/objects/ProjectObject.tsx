'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import type { ProjectSummary, WorldObjectConfig, ObjectFamily } from '@portfolio/types'
import { useWorldStore } from '@/stores/worldStore'
import { useOverlayStore } from '@/stores/overlayStore'
import { usePerformanceStore } from '@/stores/performanceStore'
import { THEME_3D_CONFIG } from '@/lib/world/theme3d'
import { SignalOrb } from './families/SignalOrb'
import { DataCrystal } from './families/DataCrystal'
import { LayeredDevice } from './families/LayeredDevice'

interface ProjectObjectProps {
  project: ProjectSummary
  position: [number, number, number]
  cameraTarget: WorldObjectConfig['cameraTarget']
  theme: 'dark' | 'light'
}

interface FamilyProps {
  theme: 'dark' | 'light'
  hovered: boolean
  onClick: () => void
  onPointerEnter: () => void
  onPointerLeave: () => void
}

function ObjectFamily({
  family,
  ...props
}: FamilyProps & { family: ObjectFamily }) {
  switch (family) {
    case 'data_crystal':
      return <DataCrystal {...props} />
    case 'layered_device':
      return <LayeredDevice {...props} />
    case 'signal_orb':
    default:
      return <SignalOrb {...props} />
  }
}

export function ProjectObject({ project, position, cameraTarget, theme }: ProjectObjectProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const floatOffset = useRef(Math.random() * Math.PI * 2)

  const setHoveredId = useWorldStore((s) => s.setHovered)
  const setFocusedId = useWorldStore((s) => s.setFocused)
  const openOverlay = useOverlayStore((s) => s.openOverlay)
  const isReducedMotion = usePerformanceStore((s) => s.isReducedMotion)
  const cfg = THEME_3D_CONFIG[theme]

  // 카테고리 → 오브젝트 패밀리 결정
  const family: ObjectFamily = project.category.objectFamily

  useFrame(({ clock }) => {
    if (!groupRef.current || isReducedMotion) return
    const t = clock.getElapsedTime()
    groupRef.current.position.y =
      position[1] + Math.sin(t * 0.5 + floatOffset.current) * 0.08
    const targetScale = hovered ? 1.1 : 1.0
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08,
    )
  })

  const handleClick = () => {
    setFocusedId(project.slug)
    openOverlay(project.slug)
  }

  const handlePointerEnter = () => {
    setHovered(true)
    setHoveredId(project.slug)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerLeave = () => {
    setHovered(false)
    setHoveredId(null)
    document.body.style.cursor = 'auto'
  }

  return (
    <group ref={groupRef} position={position}>
      <ObjectFamily
        family={family}
        theme={theme}
        hovered={hovered}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />

      <Text
        position={[0, -1.6, 0]}
        fontSize={0.18}
        color={hovered ? cfg.label.hoveredColor : cfg.label.defaultColor}
        anchorX="center"
        anchorY="middle"
        font="/fonts/GeistMono-Regular.woff"
      >
        {project.title}
      </Text>
    </group>
  )
}
