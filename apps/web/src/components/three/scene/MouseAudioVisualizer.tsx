'use client'

import { useEffect, useRef } from 'react'

interface Ripple {
  x: number; y: number
  radius: number; maxRadius: number
  opacity: number; speed: number
}

interface Pluck {
  x: number; amplitude: number
  born: number; freq: number; decay: number
}

interface GString {
  y: number; plucks: Pluck[]
  baseFreq: number; lineWidth: number
  baseOpacity: number; ambientPhase: number
}

export function MouseAudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const NAV_HEIGHT      = 72
    const TOUCH_THRESHOLD = 38

    // ── 6줄 초기화 ───────────────────────────────────
    const strings: GString[] = []

    const buildStrings = () => {
      strings.length = 0
      const H = canvas.height
      for (let i = 0; i < 6; i++) {
        const t = i / 5
        strings.push({
          y:            H * (0.15 + t * 0.70),
          plucks:       [],
          baseFreq:     16 - i * 1.8,
          lineWidth:    1,
          baseOpacity:  0.055 + i * 0.012,
          ambientPhase: i * 0.92,
        })
      }
    }

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      buildStrings()
    }
    resize()
    window.addEventListener('resize', resize)

    // ── 마우스 상태 ──────────────────────────────────
    const mouse    = { x: -2000, y: -2000 }
    const prev     = { x: -2000, y: -2000 }
    const inZone   = [false, false, false, false, false, false]
    const lastPX   = [-9999, -9999, -9999, -9999, -9999, -9999]
    const ripples: Ripple[] = []
    let lastRippleAt = 0
    let frameId: number

    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY < NAV_HEIGHT) return
      prev.x  = mouse.x; prev.y  = mouse.y
      mouse.x = e.clientX; mouse.y = e.clientY
      const speed = Math.hypot(mouse.x - prev.x, mouse.y - prev.y)
      const now   = performance.now()

      // ── 리플 (원본과 동일) ─────────────────────────
      if (now - lastRippleAt > 75) {
        ripples.push({
          x: mouse.x, y: mouse.y,
          radius: 2, maxRadius: 70 + Math.random() * 60,
          opacity: 0.55, speed: 1.6 + Math.random() * 1.4,
        })
        lastRippleAt = now
      }

      // ── 기타 줄 플럭 ──────────────────────────────
      for (let i = 0; i < strings.length; i++) {
        const s     = strings[i]
        const distY = Math.abs(mouse.y - s.y)
        const wasIn = inZone[i]
        const isIn  = distY < TOUCH_THRESHOLD
        inZone[i]   = isIn
        if (!isIn) continue
        const dx = Math.abs(mouse.x - lastPX[i])
        if (wasIn && dx < 85) continue
        const sign = mouse.y >= s.y ? 1 : -1
        const amp  = sign * (1 - distY / TOUCH_THRESHOLD) * (14 + Math.min(speed, 24))
        s.plucks.push({
          x: mouse.x, amplitude: amp, born: now,
          freq:  s.baseFreq + (Math.random() - 0.5) * 2.5,
          decay: 2.6 + Math.random() * 1.4,
        })
        lastPX[i] = mouse.x
      }
    }

    window.addEventListener('mousemove', onMouseMove)

    // ── 테마 색상 ─────────────────────────────────────
    const getColors = () => {
      const dark = document.documentElement.classList.contains('dark')
      return dark
        ? { wave: '160,160,220', ripple: '170,170,255' }
        : { wave: '30,30,80',   ripple: '40,40,140'   }
    }

    // ── 렌더 루프 ─────────────────────────────────────
    const draw = () => {
      frameId = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const c  = getColors()
      const W  = canvas.width
      const H  = canvas.height
      const now = performance.now()

      // ── 1. 기타 6줄 (원본 파형 로직 기반 + 플럭 추가) ──
      for (let i = 0; i < strings.length; i++) {
        const s = strings[i]

        // 만료 플럭 정리
        s.plucks = s.plucks.filter(p =>
          Math.exp(-p.decay * (now - p.born) / 1000) > 0.004
        )

        const spread = W * 0.13
        const active = s.plucks.length > 0
        const alpha  = active
          ? Math.min(s.baseOpacity * 4, 0.50)
          : s.baseOpacity

        ctx.beginPath()
        ctx.strokeStyle = `rgba(${c.wave},${alpha})`
        ctx.lineWidth   = s.lineWidth

        for (let x = 0; x <= W; x += 4) {
          // 기타 줄 플럭 변위만 반영 (ambient 파형 제거 → 직선 기타줄)
          let pluck = 0
          for (const p of s.plucks) {
            const t   = (now - p.born) / 1000
            const env = Math.exp(-((x - p.x) ** 2) / (2 * spread * spread))
            pluck += p.amplitude * env * Math.sin(p.freq * t) * Math.exp(-p.decay * t)
          }

          const y = s.y + pluck
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // ── 2. 리플 (원본과 완전 동일) ───────────────────
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        r.radius  += r.speed
        r.opacity -= 0.013
        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1)
          continue
        }
        const progress = r.radius / r.maxRadius
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${c.ripple},${r.opacity * (1 - progress * 0.5)})`
        ctx.lineWidth   = 1.4 * (1 - progress * 0.65)
        ctx.stroke()
      }

      // ── 3. 히어로 텍스트 영역 자연스럽게 비우기 ─────
      // lg:px-16(64px) 기준, max-w-xl(576px) 텍스트 블록 중심에 타원 배치
      const hcx     = Math.min(360, W * 0.26)   // 타원 중심 X
      const hcy     = H * 0.5                    // 타원 중심 Y (수직 중앙)
      const hrx     = Math.min(420, W * 0.31)   // X 반경
      const hry     = Math.min(210, H * 0.28)   // Y 반경
      const feather = 85                          // 경계 페더링 (px)

      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.translate(hcx, hcy)
      ctx.scale(1, hry / hrx)
      const g = ctx.createRadialGradient(
        0, 0, Math.max(0, hrx - feather),
        0, 0, hrx,
      )
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(0, 0, hrx, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    draw()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-30 pointer-events-none"
      aria-hidden="true"
    />
  )
}
