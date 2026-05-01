'use client'

import { useRouter } from 'next/navigation'
import ProjectForm from '@/components/sections/admin/ProjectForm'
import type { ProjectDetail } from '@portfolio/types'

export default function AdminProjectNewPage() {
  const router = useRouter()

  function handleSuccess(project: ProjectDetail) {
    router.push(`/admin/projects/${project.id}`)
  }

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-xs text-text-secondary hover:text-text-primary mb-4 block"
        >
          ← 목록으로
        </button>
        <h1 className="text-xl font-semibold text-text-primary">새 프로젝트</h1>
      </div>

      <ProjectForm onSuccess={handleSuccess} />
    </div>
  )
}
