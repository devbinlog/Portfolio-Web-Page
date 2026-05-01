'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useCameraStore } from '@/stores/cameraStore'
import { useWorldStore } from '@/stores/worldStore'
import { WORLD_OBJECT_CONFIGS } from '@/lib/world/configs'

// 허브 기본 카메라 위치
const HUB_POSITION = new THREE.Vector3(0, 3, 14)
const HUB_LOOKAT = new THREE.Vector3(0, 0, 0)

// 인트로 시작 위치 (하늘 위에서 내려오는 느낌)
const INTRO_START_POSITION = new THREE.Vector3(0, 18, 22)
const INTRO_START_LOOKAT = new THREE.Vector3(0, 0, 0)

// hover 시 약간 앞으로 당기는 오프셋
const HOVER_OFFSET = 0.6

export function SceneCamera() {
  const { camera } = useThree()
  const cameraState = useCameraStore((s) => s.state)
  const setCameraState = useCameraStore((s) => s.setState)
  const worldPhase = useWorldStore((s) => s.phase)
  const focusedProjectId = useWorldStore((s) => s.focusedProjectId)
  const hoveredProjectId = useWorldStore((s) => s.hoveredProjectId)
  const setPhase = useWorldStore((s) => s.setPhase)

  const targetPos = useRef(HUB_POSITION.clone())
  const targetLook = useRef(HUB_LOOKAT.clone())
  const currentLook = useRef(HUB_LOOKAT.clone())
  const introProgress = useRef(0)
  const isIntroComplete = useRef(false)

  // 인트로: 카메라를 시작 위치에 즉시 배치
  useEffect(() => {
    if (worldPhase === 'initial') {
      camera.position.copy(INTRO_START_POSITION)
      currentLook.current.copy(INTRO_START_LOOKAT)
      camera.lookAt(currentLook.current)
      introProgress.current = 0
      isIntroComplete.current = false
    }
  }, [camera, worldPhase])

  // 월드 페이즈 → 카메라 목표 업데이트
  useEffect(() => {
    switch (worldPhase) {
      case 'intro':
        targetPos.current.copy(HUB_POSITION)
        targetLook.current.copy(HUB_LOOKAT)
        setCameraState('intro')
        break

      case 'idle':
        targetPos.current.copy(HUB_POSITION)
        targetLook.current.copy(HUB_LOOKAT)
        setCameraState('hub_default')
        break

      case 'hover':
        // hover만으로는 큰 이동 없이 살짝 앞으로
        if (hoveredProjectId) {
          const config = WORLD_OBJECT_CONFIGS[hoveredProjectId]
          if (config) {
            const dir = new THREE.Vector3(...config.cameraTarget.lookAt)
              .sub(HUB_POSITION)
              .normalize()
            targetPos.current
              .copy(HUB_POSITION)
              .addScaledVector(dir, HOVER_OFFSET)
            targetLook.current.set(...config.cameraTarget.lookAt)
          }
        }
        setCameraState('hover_soft_follow')
        break

      case 'focus':
        if (focusedProjectId) {
          const config = WORLD_OBJECT_CONFIGS[focusedProjectId]
          if (config) {
            targetPos.current.set(...config.cameraTarget.position)
            targetLook.current.set(...config.cameraTarget.lookAt)
            setCameraState('project_focus_move')
          }
        }
        break

      case 'overlay':
        // 오버레이가 열리면 카메라를 프로젝트 focus hold로 전환
        setCameraState('project_focus_hold')
        break

      default:
        break
    }
  }, [worldPhase, focusedProjectId, hoveredProjectId, setCameraState])

  useFrame((_, delta) => {
    if (worldPhase === 'initial') return

    // 인트로: 가속 -> 감속 easing
    if (worldPhase === 'intro' && !isIntroComplete.current) {
      introProgress.current = Math.min(introProgress.current + delta * 0.35, 1)
      const eased = easeInOutCubic(introProgress.current)
      camera.position.lerpVectors(INTRO_START_POSITION, HUB_POSITION, eased)
      currentLook.current.lerp(HUB_LOOKAT, 0.04)
      camera.lookAt(currentLook.current)

      if (introProgress.current >= 1) {
        isIntroComplete.current = true
        setPhase('idle')
        setCameraState('hub_default')
      }
      return
    }

    // 일반 lerp 이동
    const lerpSpeed = cameraState === 'project_focus_move' ? 0.04 : 0.025
    camera.position.lerp(targetPos.current, lerpSpeed)
    currentLook.current.lerp(targetLook.current, lerpSpeed * 1.2)
    camera.lookAt(currentLook.current)
  })

  return null
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
