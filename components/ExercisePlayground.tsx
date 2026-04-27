'use client'
import { useState } from 'react'

type InputConfig = {
  id: string
  label: string
  default?: string
  type?: 'text' | 'number' | 'textarea'
}

type ActionConfig = {
  label: string
  style?: 'green' | 'yellow' | 'red' | 'blue' | 'accent'
  fn: string
}

export type ExerciseConfig = {
  title?: string
  inputs: InputConfig[]
  actions: ActionConfig[]
}

const ACTION_COLORS: Record<string, string> = {
  green:  'bg-[#50D880]/10 text-[#50D880] hover:border hover:border-[#3fc46a] border-[#50D880]',
  yellow: 'bg-[#D4A020]/10 text-[#D4A020] hover:border hover:border-[#b88a18] border-[#D4A020]',
  red:    'bg-[#e63329]/10 text-[#e63329] hover:border hover:border-[#c42820] border-[#e63329]',
  blue:   'bg-[#3060B0]/10 text-[#3060B0] hover:border hover:border-[#254e96] border-[#3060B0]',
  accent: 'bg-[#e63329]/10 text-[#e63329] hover:border hover:border-[#c42820] border-[#e63329]',
}

type Props = { config: ExerciseConfig }

export default function ExercisePlayground({ config }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(config.inputs.map(i => [i.id, i.default ?? '']))
  )
  const [output, setOutput] = useState<string | null>(null)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAction = (action: ActionConfig) => {
    try {
      const fn = new Function('inputs', action.fn)
      const result = fn(values)
      setOutput(result == null ? '' : String(result))
      setActiveAction(action.label)
      setError(null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Алдаа гарлаа')
      setOutput(null)
    }
  }

  return (
    <div className="mt-8 border border-[#1c1c1c] overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 h-9 border-b border-[#1c1c1c] bg-[#0d0d0d]">
        <div className="w-2 h-2 rounded-full bg-[#50D880]" />
        <span className="text-[9px] tracking-[0.1em] uppercase text-[#555] font-mono">
          {config.title ?? 'Туршилт хийх'}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-4 bg-[#080808]">

        {/* Оролтууд */}
        {config.inputs.map(input => (
          <div key={input.id}>
            <label className="block mb-1.5">
              <span className="text-[8px] tracking-[0.14em] uppercase font-mono text-[#e63329] bg-[rgba(230,51,41,0.08)] border border-[rgba(230,51,41,0.25)] px-2 py-1">
                {input.label}
              </span>
            </label>
            {input.type === 'textarea' ? (
              <textarea
                value={values[input.id]}
                onChange={e => setValues(v => ({ ...v, [input.id]: e.target.value }))}
                rows={4}
                className="adm-textarea"
              />
            ) : (
              <input
                type={input.type ?? 'text'}
                value={values[input.id]}
                onChange={e => setValues(v => ({ ...v, [input.id]: e.target.value }))}
                className="adm-input"
              />
            )}
          </div>
        ))}

        {/* Товчнууд */}
        <div className="flex items-center gap-3 flex-wrap">
          {config.actions.map(action => (
            <button
              key={action.label}
              onClick={() => handleAction(action)}
              className={`px-5 py-2 text-[12px] font-bold tracking-wide transition-colors border ${ACTION_COLORS[action.style ?? 'accent'] ?? ACTION_COLORS.accent}`}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Гаралт */}
        {(output !== null || error) && (
          <div className="border border-[#1c1c1c] overflow-hidden">
            <div className={`flex items-center justify-between px-3 py-1.5 border-b border-[#1c1c1c] ${error ? 'bg-[rgba(230,51,41,0.08)]' : 'bg-[#0d0d0d]'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-[#e63329]' : 'bg-[#50D880]'}`} />
                <span className={`text-[8px] tracking-[0.14em] uppercase font-mono ${error ? 'text-[#e63329]' : 'text-[#50D880]'}`}>
                  {error ? 'Алдаа' : `${activeAction} — Үр дүн`}
                </span>
              </div>
              <button
                onClick={() => { setOutput(null); setError(null) }}
                className="text-[10px] text-[#555] hover:text-[#aaa] font-mono transition-colors"
              >
                ✕
              </button>
            </div>
            <pre className={`px-4 py-4 font-mono text-[12px] leading-[1.9] whitespace-pre-wrap bg-[#050505] overflow-x-auto ${error ? 'text-[#e63329]' : 'text-[#f0ece0]'}`}>
              {error ?? output}
            </pre>
          </div>
        )}

      </div>
    </div>
  )
}
