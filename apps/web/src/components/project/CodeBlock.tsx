'use client'

import { useState } from 'react'
import type { CodeSnippet } from '@portfolio/types'

interface CodeBlockProps {
  snippet: CodeSnippet
  index: number
}

export function CodeBlock({ snippet, index }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const lines = snippet.code.split('\n')

  return (
    <div className="rounded-lg border border-border-default overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-input border-b border-border-default">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-text-disabled">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-sm font-semibold text-text-primary">{snippet.title}</span>
          <span className="text-xs font-mono text-text-disabled px-1.5 py-0.5 bg-surface-elevated rounded">
            {snippet.language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs font-mono text-text-disabled hover:text-text-secondary transition-colors"
          aria-label="코드 복사"
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>

      {/* 코드 영역 */}
      <div className="overflow-x-auto bg-surface-base">
        <table className="min-w-full text-xs font-mono leading-5">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-surface-input transition-colors">
                <td
                  className="select-none text-right text-text-disabled px-4 py-0 w-10 border-r border-border-default"
                  style={{ minWidth: '2.5rem' }}
                >
                  {i + 1}
                </td>
                <td className="px-4 py-0 text-text-secondary whitespace-pre">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 설명 */}
      {snippet.explanation && (
        <div className="px-5 py-4 bg-surface-elevated border-t border-border-default">
          <p className="text-xs text-text-secondary leading-relaxed">{snippet.explanation}</p>
        </div>
      )}
    </div>
  )
}

interface KeyCodeSectionProps {
  snippets: CodeSnippet[]
  sectionNum: string
}

export function KeyCodeSection({ snippets, sectionNum }: KeyCodeSectionProps) {
  if (!snippets.length) return null

  return (
    <section className="mb-14 pb-14 border-b border-border-default">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-text-disabled">{sectionNum}</span>
        <span className="text-sm font-mono text-text-secondary">—</span>
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Key Code</h2>
      </div>
      <div className="space-y-6">
        {snippets.map((snippet, i) => (
          <CodeBlock key={i} snippet={snippet} index={i} />
        ))}
      </div>
    </section>
  )
}
