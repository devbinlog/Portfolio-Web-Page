'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function usePageView() {
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/v1/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname }),
    }).catch(() => {})
  }, [pathname])
}
