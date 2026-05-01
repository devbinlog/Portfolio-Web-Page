interface PlaceholderSlotProps {
  type: 'video' | 'image' | 'document'
  label: string | null
  title?: string
}

const ICONS = {
  video: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm14.553 1.106A1 1 0 0016 8v4a1 1 0 00.553.894l2 1A1 1 0 0020 13V7a1 1 0 00-1.447-.894l-2 1z" />
    </svg>
  ),
  image: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
    </svg>
  ),
  document: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
    </svg>
  ),
}

const DEFAULT_LABELS = {
  video: '영상 준비 중입니다',
  image: '이미지 준비 중입니다',
  document: '문서 준비 중입니다',
}

export function PlaceholderSlot({ type, label, title }: PlaceholderSlotProps) {
  const displayLabel = label || DEFAULT_LABELS[type]

  return (
    <div
      className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-border-default bg-surface-input"
      role="status"
      aria-label={displayLabel}
    >
      <span className="text-text-disabled shrink-0">{ICONS[type]}</span>
      <div>
        {title && <p className="text-sm text-text-secondary mb-0.5">{title}</p>}
        <p className="text-xs text-text-disabled">{displayLabel}</p>
      </div>
    </div>
  )
}
