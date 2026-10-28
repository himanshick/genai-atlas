import type { ReactNode } from 'react'

/** A titled section of a concept page. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return (
    <section className="mt-12 first:mt-0">
      <h2
        id={id}
        className="mb-4 scroll-mt-24 font-display text-2xl font-bold text-ink-100"
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

/** Body paragraph with comfortable reading styles. */
export function P({ children }: { children: ReactNode }) {
  return <p className="my-4 text-[16px] leading-[1.8] text-ink-300">{children}</p>
}

/** Inline emphasized technical term. */
export function Term({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-ink-100">{children}</strong>
}

/** Inline code / token styling. */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-[0.85em] text-ink-100">
      {children}
    </code>
  )
}

/** Bulleted list with breathing room. */
export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="my-4 space-y-2.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[16px] leading-[1.7] text-ink-300">
          <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** End-of-page summary of the essential points. */
export function Takeaways({ items }: { items: ReactNode[] }) {
  return (
    <section className="mt-12 rounded-2xl border border-ink-700 bg-ink-900 p-6">
      <h2 className="mb-4 font-display text-lg font-bold text-ink-100">
        ✦ If you remember nothing else
      </h2>
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink-200">
            <span className="font-mono text-sm font-semibold text-ink-400">{i + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
