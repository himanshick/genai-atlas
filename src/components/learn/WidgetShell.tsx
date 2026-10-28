import type { ReactNode } from 'react'

/**
 * Frame for an interactive playground: title bar, "try it" hint, content area.
 */
export function WidgetShell({
  title,
  hint,
  children,
  accent = '#a78bfa',
}: {
  title: string
  hint?: string
  children: ReactNode
  accent?: string
}) {
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-ink-800 px-5 py-3.5">
        <span
          className="rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wider uppercase"
          style={{ background: `${accent}22`, color: accent }}
        >
          Interactive
        </span>
        <h4 className="font-display text-[15px] font-semibold text-ink-100">{title}</h4>
        {hint && <span className="text-xs text-ink-400">{hint}</span>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

/** Labeled range slider used inside widgets. */
export function LabeledSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  accent = '#a78bfa',
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  display?: string
  accent?: string
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink-300">{label}</span>
        <span className="font-mono text-sm" style={{ color: accent }}>
          {display ?? value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
        style={{ accentColor: accent }}
      />
    </label>
  )
}
