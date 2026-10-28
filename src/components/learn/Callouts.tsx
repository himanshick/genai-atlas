import type { ReactNode } from 'react'

interface CalloutProps {
  title?: string
  children: ReactNode
}

function CalloutBase({
  icon,
  label,
  accent,
  title,
  children,
}: CalloutProps & { icon: string; label: string; accent: string }) {
  return (
    <aside
      className="my-6 rounded-xl border p-5"
      style={{
        borderColor: `${accent}44`,
        background: `linear-gradient(135deg, ${accent}14, transparent 60%)`,
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span aria-hidden className="text-lg leading-none">
          {icon}
        </span>
        <span
          className="font-display text-xs font-semibold tracking-widest uppercase"
          style={{ color: accent }}
        >
          {title ?? label}
        </span>
      </div>
      <div className="text-[15px] leading-relaxed text-ink-200">{children}</div>
    </aside>
  )
}

/** A real-world analogy that makes the concept click. */
export function Analogy(props: CalloutProps) {
  return <CalloutBase icon="💡" label="Analogy" accent="#fbbf24" {...props} />
}

/** Why this concept matters in practice. */
export function WhyItMatters(props: CalloutProps) {
  return <CalloutBase icon="🎯" label="Why it matters" accent="#34d399" {...props} />
}

/** A common misconception, corrected. */
export function Misconception(props: CalloutProps) {
  return <CalloutBase icon="🚫" label="Common misconception" accent="#f87171" {...props} />
}

/** The single most important idea on the page. */
export function KeyIdea(props: CalloutProps) {
  return <CalloutBase icon="🔑" label="Key idea" accent="#a78bfa" {...props} />
}

/** Optional deeper detail, collapsed by default. */
export function DeepDive({ title = 'Deep dive', children }: CalloutProps) {
  return (
    <details className="group my-6 rounded-xl border border-ink-700 bg-ink-900 open:bg-ink-850">
      <summary className="cursor-pointer list-none p-5 font-display text-sm font-semibold text-ink-300 select-none hover:text-ink-100">
        <span className="mr-2 inline-block transition-transform group-open:rotate-90">▸</span>
        {title}
      </summary>
      <div className="border-t border-ink-800 p-5 pt-4 text-[15px] leading-relaxed text-ink-300">
        {children}
      </div>
    </details>
  )
}
