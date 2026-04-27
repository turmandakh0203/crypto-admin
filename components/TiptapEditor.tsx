'use client'

import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  NodeViewContent,
} from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import { ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

// ─── Resizable image node view ────────────────────────────────────────────────

const ResizableImageView = ({ node, updateAttributes, selected }: NodeViewProps) => {
  const imgRef  = useRef<HTMLImageElement>(null)
  const startX  = useRef(0)
  const startW  = useRef(0)
  const startMX = useRef(0)
  const startMY = useRef(0)
  const startPX = useRef(0)
  const startPY = useRef(0)

  const align    = (node.attrs.align    as string)         ?? 'center'
  const width    = node.attrs.width    as number | null
  const floating = node.attrs.floating as boolean          ?? false
  const posX     = node.attrs.posX     as number           ?? 20
  const posY     = node.attrs.posY     as number           ?? 20

  // ── Resize ──
  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    startX.current = e.clientX
    startW.current = imgRef.current?.offsetWidth ?? (width ?? 400)
    const onMove = (ev: MouseEvent) =>
      updateAttributes({ width: Math.max(80, startW.current + ev.clientX - startX.current) })
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // ── Drag to reposition (floating mode, зөвхөн selected үед) ──
  const onMoveStart = (e: React.MouseEvent) => {
    if (!floating || !selected) return   // selected биш үед ProseMirror-д өгнө
    e.preventDefault()                   // stopPropagation дуудахгүй — selection-г хадгална
    startMX.current = e.clientX; startMY.current = e.clientY
    startPX.current = posX;      startPY.current = posY
    const onMove = (ev: MouseEvent) => updateAttributes({
      posX: Math.max(0, startPX.current + ev.clientX - startMX.current),
      posY: Math.max(0, startPY.current + ev.clientY - startMY.current),
    })
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const marginStyle: React.CSSProperties =
    align === 'left'  ? { marginRight: 'auto' } :
    align === 'right' ? { marginLeft: 'auto'  } :
                        { margin: '0 auto'     }

  const controls = selected && (
    <>
      {/* float toggle */}
      <button
        type="button" contentEditable={false}
        onMouseDown={e => { e.preventDefault(); updateAttributes({ floating: !floating, posX: 20, posY: 20 }) }}
        style={{
          position: 'absolute', top: 4, right: 4, zIndex: 11,
          background: floating ? '#e63329' : 'rgba(0,0,0,0.55)',
          border: 'none', color: '#fff', fontSize: 9, padding: '2px 5px',
          borderRadius: 2, cursor: 'pointer',
        }}
        title={floating ? 'Документ рүү буцаах' : 'Чөлөөт байршил (absolute)'}
      >{floating ? '📌 fixed' : '📌 float'}</button>

      {/* resize handle */}
      <div
        onMouseDown={onResizeStart}
        style={{
          position: 'absolute', bottom: -4, right: -4,
          width: 10, height: 10,
          background: '#e63329', border: '2px solid #fff',
          cursor: 'nwse-resize', borderRadius: 1, zIndex: 10,
        }}
      />
      {width && (
        <span style={{
          position: 'absolute', bottom: 4, left: 6, fontSize: 9,
          color: '#fff', background: 'rgba(0,0,0,0.5)',
          padding: '1px 4px', borderRadius: 2, pointerEvents: 'none',
        }}>{width}px</span>
      )}
    </>
  )

  // ── Floating mode ──
  if (floating) {
    return (
      <NodeViewWrapper>
        {/* Document-д харагдах placeholder — ProseMirror үүгээр node-г сонгоно */}
        <div style={{
          border: `1px dashed ${selected ? '#e63329' : '#2a2a2a'}`,
          padding: '4px 10px', background: selected ? 'rgba(230,51,41,0.05)' : 'transparent',
          fontSize: 9, color: '#555', display: 'flex', alignItems: 'center', gap: 6,
          userSelect: 'none',
        }}>
          <span>📌 floating image {width ? `(${width}px)` : ''}</span>
          {selected && (
            <button
              type="button" contentEditable={false}
              onMouseDown={e => { e.preventDefault(); updateAttributes({ floating: false }) }}
              style={{ background: 'none', border: '1px solid #333', color: '#aaa', fontSize: 9, padding: '1px 6px', cursor: 'pointer', borderRadius: 2, marginLeft: 4 }}
            >→ блок болгох</button>
          )}
          {selected && (
            <span style={{ color: '#333', fontSize: 9, marginLeft: 'auto' }}>
              2col руу оруулахын тулд эхлээд блок болго
            </span>
          )}
        </div>

        {/* Absolute байрлалтай бодит зураг */}
        <div
          contentEditable={false}
          style={{
            position: 'absolute', top: posY, left: posX, zIndex: 5,
            outline: selected ? '2px solid #e63329' : '1px dashed #555',
            cursor: selected ? 'move' : 'pointer',
            width: 'fit-content',
          }}
          onMouseDown={onMoveStart}
        >
          <img
            ref={imgRef} src={node.attrs.src} alt="" draggable={false}
            width={width ?? undefined}
            style={{ display: 'block', maxWidth: '60vw' }}
          />
          {controls}
        </div>
      </NodeViewWrapper>
    )
  }

  // ── Normal (block) mode ──
  return (
    <NodeViewWrapper>
      <div style={{ display: 'block', position: 'relative', width: 'fit-content', ...marginStyle }}>
        <div data-drag-handle style={{
          position: 'absolute', top: 4, left: 4, zIndex: 10,
          padding: '1px 3px', background: 'rgba(0,0,0,0.55)',
          color: '#aaa', fontSize: 10, cursor: 'grab', borderRadius: 2,
          opacity: selected ? 1 : 0, transition: 'opacity 0.15s', userSelect: 'none',
        }}>⠿</div>
        <img
          ref={imgRef} src={node.attrs.src} alt="" draggable={false}
          width={width ?? undefined}
          style={{
            display: 'block', maxWidth: '100%', cursor: 'default',
            outline: selected ? '2px solid #e63329' : '1px solid #1c1c1c',
          }}
        />
        {controls}
      </div>
    </NodeViewWrapper>
  )
}

// ─── CustomImage extension ────────────────────────────────────────────────────

const CustomImage = Image.extend({
  draggable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        parseHTML: el => (el as HTMLElement).getAttribute('data-align') ?? 'center',
        renderHTML: attrs => ({ 'data-align': attrs.align }),
      },
      width: {
        default: null,
        parseHTML: el => { const w = (el as HTMLElement).getAttribute('width'); return w ? parseInt(w) : null },
        renderHTML: attrs => (attrs.width ? { width: attrs.width } : {}),
      },
      floating: {
        default: false,
        parseHTML: el => (el as HTMLElement).getAttribute('data-floating') === 'true',
        renderHTML: attrs => (attrs.floating ? { 'data-floating': 'true' } : {}),
      },
      posX: {
        default: 20,
        parseHTML: el => parseInt((el as HTMLElement).getAttribute('data-pos-x') ?? '20'),
        renderHTML: attrs => (attrs.floating ? { 'data-pos-x': attrs.posX } : {}),
      },
      posY: {
        default: 20,
        parseHTML: el => parseInt((el as HTMLElement).getAttribute('data-pos-y') ?? '20'),
        renderHTML: attrs => (attrs.floating ? { 'data-pos-y': attrs.posY } : {}),
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView)
  },
})
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Node, mergeAttributes } from '@tiptap/core'
import type { NodeViewProps } from '@tiptap/react'
import { useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { CrossIcon } from './icons'

// ─── Callout custom node ──────────────────────────────────────────────────────

type CalloutType = 'note' | 'warning' | 'example'

const CALLOUT_META: Record<CalloutType, { label: string; color: string; bg: string }> = {
  note:    { label: 'Санамж',      color: '#D4A020', bg: 'rgba(212,160,32,0.08)' },
  warning: { label: 'Анхааруулга', color: '#e63329', bg: 'rgba(230,51,41,0.08)'  },
  example: { label: 'Жишээ',       color: '#3060B0', bg: 'rgba(48,96,176,0.08)'  },
}

const CalloutView = ({ node, deleteNode }: NodeViewProps) => {
  const type = node.attrs.type as CalloutType
  const m    = CALLOUT_META[type]
  return (
    <NodeViewWrapper>
      <div style={{
        position: 'relative', background: m.bg,
        borderLeft: `3px solid ${m.color}`,
        padding: '10px 28px 10px 14px', margin: '10px 0', borderRadius: '0 4px 4px 0',
      }}>
        <button
          type="button" contentEditable={false} onClick={deleteNode}
          style={{
            position: 'absolute', top: 6, right: 6,
            background: 'none', border: '1px solid #2a2a2a', color: '#555',
            width: 18, height: 18, fontSize: 10, cursor: 'pointer', borderRadius: 10,
          }}
          title="Устгах"
        ><CrossIcon className="w-4 h-4" /></button>
        <span contentEditable={false} style={{
          display: 'block', fontSize: 9, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: m.color, marginBottom: 6, fontWeight: 600,
        }}>
          {m.label}
        </span>
        <NodeViewContent style={{ fontSize: 13, color: '#ccc', lineHeight: 1.7 }} />
      </div>
    </NodeViewWrapper>
  )
}

const CalloutExtension = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,
  addAttributes() {
    return {
      type: {
        default: 'note',
        parseHTML: el => {
          const cls = (el as HTMLElement).classList
          if (cls.contains('warning')) return 'warning'
          if (cls.contains('example')) return 'example'
          return 'note'
        },
      },
    }
  },
  parseHTML() {
    return [{
      tag: 'div',
      getAttrs: el => {
        const cls = (el as HTMLElement).classList
        return (cls.contains('note') || cls.contains('warning') || cls.contains('example'))
          ? {}
          : false
      },
    }]
  },
  renderHTML({ node }) {
    return ['div', { class: node.attrs.type as string }, 0]
  },
  addNodeView() {
    return ReactNodeViewRenderer(CalloutView)
  },
})

// ─── CryptoWidget custom node ─────────────────────────────────────────────────

const CryptoWidgetView = ({ node, deleteNode }: NodeViewProps) => (
  <NodeViewWrapper>
    <div contentEditable={false} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '7px 12px', background: '#0f0f0f',
      border: '1px solid #222', borderRadius: 4, margin: '8px 0', userSelect: 'none',
    }}>
      <span style={{ color: '#e63329', fontSize: 14, fontWeight: 700 }}>₿</span>
      <span style={{ color: '#888', fontSize: 11, fontFamily: 'monospace' }}>
        crypto-widget: <strong style={{ color: '#fff' }}>{node.attrs.symbol}</strong>
      </span>
      <button
        type="button" onClick={deleteNode}
        style={{
          marginLeft: 'auto', background: 'none', border: '1px solid #2a2a2a',
          color: '#555', width: 18, height: 18, fontSize: 10, cursor: 'pointer', borderRadius: 10,
        }}
        title="Устгах"
      ><CrossIcon className="w-4 h-4" /></button>
    </div>
  </NodeViewWrapper>
)

const CryptoWidgetExtension = Node.create({
  name: 'cryptoWidget',
  group: 'block',
  atom: true,
  addAttributes() {
    return { symbol: { default: 'BTC_USDT' } }
  },
  parseHTML() {
    return [{ tag: 'crypto-widget' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['crypto-widget', mergeAttributes(HTMLAttributes)]
  },
  addNodeView() {
    return ReactNodeViewRenderer(CryptoWidgetView)
  },
})

// ─── Columns layout node ──────────────────────────────────────────────────────

const ColumnExtension = Node.create({
  name: 'column',
  group: 'block',
  content: 'block+',
  isolating: true,
  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }]
  },
  renderHTML() {
    return ['div', { 'data-type': 'column' }, 0]
  },
})

const ColumnsExtension = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column{2,4}',
  parseHTML() {
    return [{ tag: 'div[data-type="columns"]' }]
  },
  renderHTML() {
    return ['div', { 'data-type': 'columns' }, 0]
  },
})

// ─── Toolbar helpers ──────────────────────────────────────────────────────────

function TBtn({ active, disabled, onClick, title, children }: {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  title?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={`tiptap-tbtn${active ? ' active' : ''}`}
      onMouseDown={e => { e.preventDefault(); onClick() }}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  )
}

const Sep = () => <span className="tiptap-sep" />

// ─── TiptapEditor ─────────────────────────────────────────────────────────────

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function TiptapEditor({ value, onChange, placeholder }: Props) {
  const [linkUrl,    setLinkUrl]    = useState('')
  const [showLink,   setShowLink]   = useState(false)
  const [showWidget, setShowWidget] = useState(false)
  const [wSymbol,    setWSymbol]    = useState('BTC_USDT')
  const [showImage,  setShowImage]  = useState(false)
  const [imageUrl,   setImageUrl]   = useState('')
  const [uploading,  setUploading]  = useState(false)
  const [uploadErr,  setUploadErr]  = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      CustomImage.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: placeholder ?? 'Мэдээний агуулга энд...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      CalloutExtension,
      CryptoWidgetExtension,
      ColumnExtension,
      ColumnsExtension,
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: 'tiptap-content' } },
  })

  const applyLink = useCallback(() => {
    if (linkUrl.trim()) editor?.chain().focus().setLink({ href: linkUrl.trim() }).run()
    setLinkUrl(''); setShowLink(false)
  }, [editor, linkUrl])

  const addWidget = useCallback(() => {
    if (wSymbol.trim()) {
      editor?.chain().focus().insertContent({
        type: 'cryptoWidget', attrs: { symbol: wSymbol.trim() },
      }).run()
    }
    setShowWidget(false)
  }, [editor, wSymbol])

  const insertCallout = (type: CalloutType) =>
    editor?.chain().focus().insertContent({
      type: 'callout', attrs: { type },
      content: [{ type: 'paragraph' }],
    }).run()

  const insertImageUrl = useCallback(() => {
    if (imageUrl.trim()) {
      editor?.chain().focus().setImage({ src: imageUrl.trim() }).run()
    }
    setImageUrl(''); setShowImage(false)
  }, [editor, imageUrl])

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    setUploadErr('')
    const ext  = file.name.split('.').pop()
    const path = `news/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('Images').upload(path, file, { upsert: true })
    if (error) {
      setUploadErr(error.message)
    } else {
      const { data } = supabase.storage.from('Images').getPublicUrl(path)
      editor?.chain().focus().setImage({ src: data.publicUrl }).run()
      setShowImage(false)
      setUploadErr('')
    }
    setUploading(false)
  }, [editor])

  if (!editor) return null

  return (
    <div className="tiptap-wrap">
      {/* ── Toolbar ── */}
      <div className="tiptap-toolbar">
        <TBtn active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</TBtn>
        <TBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</TBtn>
        <TBtn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</TBtn>
        <Sep />
        <TBtn active={editor.isActive('bold')}      onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></TBtn>
        <TBtn active={editor.isActive('italic')}    onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></TBtn>
        <TBtn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></TBtn>
        <TBtn active={editor.isActive('strike')}    onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></TBtn>
        <TBtn active={editor.isActive('code')}      onClick={() => editor.chain().focus().toggleCode().run()} title="Inline code">`</TBtn>
        <Sep />
        {/* Color picker */}
        <label className="tiptap-color-btn" title="Текстийн өнгө">
          <span className="tiptap-color-swatch" style={{ background: editor.getAttributes('textStyle').color ?? '#ffffff' }} />
          <span>A</span>
          <input
            type="color"
            className="tiptap-color-input"
            value={editor.getAttributes('textStyle').color ?? '#e63329'}
            onInput={e => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
          />
        </label>
        <TBtn onClick={() => editor.chain().focus().unsetColor().run()} title="Өнгө арилгах">A×</TBtn>
        <Sep />
        <TBtn active={editor.isActive('bulletList')}  onClick={() => editor.chain().focus().toggleBulletList().run()} title="Жагсаалт">• ≡</TBtn>
        <TBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Дугаарласан">1 ≡</TBtn>
        <TBtn active={editor.isActive('blockquote')}  onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Иш">"</TBtn>
        <TBtn active={editor.isActive('codeBlock')}   onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code block">{'</>'}</TBtn>
        <Sep />
        <TBtn active={editor.isActive({ textAlign: 'left' })}   onClick={() => editor.chain().focus().setTextAlign('left').run()}   title="Зүүн">≡←</TBtn>
        <TBtn active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Голлуулах">≡↔</TBtn>
        <TBtn active={editor.isActive({ textAlign: 'right' })}  onClick={() => editor.chain().focus().setTextAlign('right').run()}  title="Баруун">≡→</TBtn>
        <Sep />
        <TBtn
          active={editor.isActive('link') || showLink}
          onClick={() => editor.isActive('link') ? editor.chain().focus().unsetLink().run() : setShowLink(v => !v)}
          title="Холбоос"
        >🔗</TBtn>
        <TBtn active={showImage} onClick={() => setShowImage(v => !v)} title="Зураг оруулах">🖼</TBtn>
        <Sep />
        {/* Custom blocks */}
        <TBtn onClick={() => insertCallout('note')}    title="Санамж блок нэмэх">+note</TBtn>
        <TBtn onClick={() => insertCallout('warning')} title="Анхааруулга блок нэмэх">+warn</TBtn>
        <TBtn onClick={() => insertCallout('example')} title="Жишээ блок нэмэх">+ex</TBtn>
        <TBtn active={showWidget} onClick={() => setShowWidget(v => !v)} title="Crypto widget нэмэх">+₿</TBtn>
        <TBtn
          onClick={() => editor.chain().focus().insertContent({
            type: 'columns',
            content: [
              { type: 'column', content: [{ type: 'paragraph' }] },
              { type: 'column', content: [{ type: 'paragraph' }] },
            ],
          }).run()}
          title="2 баганат layout нэмэх"
        >⫿ 2col</TBtn>
        <Sep />
        <TBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Буцаах">↩</TBtn>
        <TBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Дахин">↪</TBtn>
      </div>

      {/* ── Link popbar ── */}
      {showLink && (
        <div className="tiptap-popbar">
          <input
            className="tiptap-pop-input"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyLink()}
            placeholder="https://..."
            autoFocus
          />
          <button className="tiptap-pop-ok"     onClick={applyLink}>Нэмэх</button>
          <button className="tiptap-pop-cancel" onClick={() => { setShowLink(false); setLinkUrl('') }}>✕</button>
        </div>
      )}

      {/* ── Image popbar ── */}
      {showImage && (
        <div className="tiptap-popbar" style={{ flexWrap: 'wrap', gap: 6 }}>
          <input
            className="tiptap-pop-input"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && insertImageUrl()}
            placeholder="https://... (зургийн URL)"
            autoFocus
          />
          <button className="tiptap-pop-ok" onClick={insertImageUrl}>Нэмэх</button>
          <span style={{ color: '#333', fontSize: 10, alignSelf: 'center' }}>эсвэл</span>
          <button
            className="tiptap-pop-ok"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >{uploading ? 'Хадгалж...' : '📁 Файл'}</button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) { uploadFile(e.target.files[0]); e.target.value = '' } }} />
          <button className="tiptap-pop-cancel" onClick={() => { setShowImage(false); setImageUrl(''); setUploadErr('') }}>✕</button>
          {uploadErr && (
            <span style={{ width: '100%', color: '#e63329', fontSize: 10, fontFamily: 'monospace' }}>
              ✕ {uploadErr}
            </span>
          )}
        </div>
      )}

      {/* ── Widget popbar ── */}
      {showWidget && (
        <div className="tiptap-popbar">
          <input
            className="tiptap-pop-input"
            value={wSymbol}
            onChange={e => setWSymbol(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && addWidget()}
            placeholder="BTC_USDT"
          />
          <button className="tiptap-pop-ok"     onClick={addWidget}>Нэмэх</button>
          <button className="tiptap-pop-cancel" onClick={() => setShowWidget(false)}>✕</button>
        </div>
      )}

      {/* ── Image bubble menu ── */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive('image')}
      >
        <div className="tiptap-bubble">
          {(['left', 'center', 'right'] as const).map(a => (
            <button
              key={a}
              type="button"
              className={`tiptap-bubble-btn${editor.getAttributes('image').align === a ? ' active' : ''}`}
              onMouseDown={e => { e.preventDefault(); editor.chain().focus().updateAttributes('image', { align: a }).run() }}
              title={a === 'left' ? 'Зүүн' : a === 'center' ? 'Голлуулах' : 'Баруун'}
            >
              {a === 'left' ? '⬡←' : a === 'center' ? '⬡↔' : '⬡→'}
            </button>
          ))}
          <span className="tiptap-sep" />
          <button
            type="button"
            className="tiptap-bubble-btn"
            onMouseDown={e => { e.preventDefault(); editor.chain().focus().deleteSelection().run() }}
            title="Зураг устгах"
            style={{ color: '#e63329' }}
          >delete</button>
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </div>
  )
}
