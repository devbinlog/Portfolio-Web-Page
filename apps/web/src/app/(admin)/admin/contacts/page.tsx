'use client'

import { useEffect, useState, useCallback } from 'react'
import { adminApi } from '@/lib/api/admin'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  isRead: boolean
  createdAt: string
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterUnread, setFilterUnread] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [markingId, setMarkingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    adminApi.contacts
      .list(filterUnread)
      .then((data) => setContacts(data as ContactMessage[]))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [filterUnread])

  useEffect(() => {
    load()
  }, [load])

  async function handleMarkRead(id: string) {
    setMarkingId(id)
    try {
      await adminApi.contacts.markRead(id)
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, isRead: true } : c)))
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setMarkingId(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('메시지를 삭제하시겠습니까?')) return
    setDeletingId(id)
    try {
      await adminApi.contacts.delete(id)
      setContacts((prev) => prev.filter((c) => c.id !== id))
      if (expandedId === id) setExpandedId(null)
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setDeletingId(null)
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const unreadCount = contacts.filter((c) => !c.isRead).length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-text-primary">연락 메시지</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-accent-default text-surface-base text-xs rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={filterUnread}
            onChange={(e) => setFilterUnread(e.target.checked)}
            className="w-4 h-4"
          />
          읽지 않은 것만
        </label>
      </div>

      {error && <p className="text-feedback-error text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-surface-elevated rounded-lg animate-pulse" />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-20 text-text-secondary text-sm">
          {filterUnread ? '읽지 않은 메시지가 없습니다.' : '메시지가 없습니다.'}
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`border rounded-lg overflow-hidden transition-colors ${
                !contact.isRead
                  ? 'border-accent-default bg-surface-elevated'
                  : 'border-border-default bg-surface-elevated/50'
              }`}
            >
              {/* 헤더 */}
              <button
                onClick={() => setExpandedId((prev) => (prev === contact.id ? null : contact.id))}
                className="w-full text-left p-4 flex items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!contact.isRead && (
                      <span className="w-2 h-2 rounded-full bg-accent-default shrink-0" />
                    )}
                    <span className="text-sm font-medium text-text-primary">{contact.name}</span>
                    <span className="text-xs text-text-secondary">{contact.email}</span>
                  </div>
                  {contact.subject && (
                    <p className="text-xs text-text-secondary mt-0.5">{contact.subject}</p>
                  )}
                  <p className="text-xs text-text-disabled mt-1">
                    {formatDate(contact.createdAt)}
                  </p>
                </div>
                <span className="text-text-secondary text-xs shrink-0">
                  {expandedId === contact.id ? '▲' : '▼'}
                </span>
              </button>

              {/* 메시지 본문 */}
              {expandedId === contact.id && (
                <div className="px-4 pb-4 border-t border-border-default">
                  <p className="text-sm text-text-primary whitespace-pre-wrap pt-4 leading-relaxed">
                    {contact.message}
                  </p>

                  <div className="flex items-center gap-3 mt-4">
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-xs text-accent-default hover:underline"
                    >
                      답장 보내기
                    </a>

                    {!contact.isRead && (
                      <button
                        onClick={() => handleMarkRead(contact.id)}
                        disabled={markingId === contact.id}
                        className="text-xs text-text-secondary hover:text-text-primary disabled:opacity-50"
                      >
                        {markingId === contact.id ? '...' : '읽음 표시'}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(contact.id)}
                      disabled={deletingId === contact.id}
                      className="text-xs text-feedback-error hover:underline disabled:opacity-50 ml-auto"
                    >
                      {deletingId === contact.id ? '...' : '삭제'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
