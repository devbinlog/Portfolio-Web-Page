import type { Metadata } from 'next'
import { AdminLoginForm } from '@/components/sections/admin/AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-dvh bg-surface-base flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <h1 className="text-xl font-semibold text-text-primary mb-8">관리자 로그인</h1>
        <AdminLoginForm />
      </div>
    </div>
  )
}
