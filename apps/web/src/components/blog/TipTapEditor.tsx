'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

interface TipTapEditorProps {
  content: object | null
  onChange: (json: object) => void
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: '내용을 입력하세요...' }),
    ],
    content: content ?? undefined,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
  })

  if (!editor) return null

  function addImage() {
    const url = window.prompt('이미지 URL을 입력하세요')
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }

  function setLink() {
    const prev = editor?.getAttributes('link').href
    const url = window.prompt('링크 URL을 입력하세요', prev)
    if (url === null) return
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const btn = (active: boolean) =>
    `px-2 py-1 rounded text-xs transition-colors ${
      active
        ? 'bg-accent-default text-surface-base'
        : 'bg-surface-input text-text-primary hover:bg-border-default'
    }`

  return (
    <div className="border border-border-default rounded-lg overflow-hidden">
      {/* 툴바 */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-border-default bg-surface-elevated">
        {/* 제목 */}
        <button className={btn(editor.isActive('heading', { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} type="button">H1</button>
        <button className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} type="button">H2</button>
        <button className={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} type="button">H3</button>

        <span className="w-px bg-border-default mx-1" />

        {/* 텍스트 스타일 */}
        <button className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} type="button"><strong>B</strong></button>
        <button className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} type="button"><em>I</em></button>
        <button className={btn(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()} type="button"><u>U</u></button>
        <button className={btn(editor.isActive('strike'))} onClick={() => editor.chain().focus().toggleStrike().run()} type="button"><s>S</s></button>

        <span className="w-px bg-border-default mx-1" />

        {/* 정렬 */}
        <button className={btn(editor.isActive({ textAlign: 'left' }))} onClick={() => editor.chain().focus().setTextAlign('left').run()} type="button">≡L</button>
        <button className={btn(editor.isActive({ textAlign: 'center' }))} onClick={() => editor.chain().focus().setTextAlign('center').run()} type="button">≡C</button>
        <button className={btn(editor.isActive({ textAlign: 'right' }))} onClick={() => editor.chain().focus().setTextAlign('right').run()} type="button">≡R</button>

        <span className="w-px bg-border-default mx-1" />

        {/* 리스트 */}
        <button className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()} type="button">• 목록</button>
        <button className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()} type="button">1. 목록</button>

        <span className="w-px bg-border-default mx-1" />

        {/* 블록 */}
        <button className={btn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()} type="button">❝</button>
        <button className={btn(editor.isActive('codeBlock'))} onClick={() => editor.chain().focus().toggleCodeBlock().run()} type="button">{`</>`}</button>
        <button className={btn(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()} type="button">── 구분선</button>

        <span className="w-px bg-border-default mx-1" />

        {/* 미디어/링크 */}
        <button className={btn(false)} onClick={addImage} type="button">🖼 이미지</button>
        <button className={btn(editor.isActive('link'))} onClick={setLink} type="button">🔗 링크</button>

        <span className="w-px bg-border-default mx-1" />

        {/* 색상 */}
        <label className="flex items-center gap-1 text-xs text-text-secondary">
          글자색
          <input
            type="color"
            className="w-6 h-6 rounded cursor-pointer border-0"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>

        <span className="w-px bg-border-default mx-1" />

        {/* 글씨 크기 */}
        <select
          className="text-xs bg-surface-input text-text-primary rounded px-1 py-1 border border-border-default"
          onChange={(e) => {
            editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()
          }}
          defaultValue=""
        >
          <option value="" disabled>크기</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* 에디터 본문 */}
      <div className="bg-surface-base">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
