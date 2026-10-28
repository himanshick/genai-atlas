import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export interface Step {
  title: string
  /** Visual for this step — usually an SVG scene. */
  visual: ReactNode
  /** Explanation shown under the visual. */
  caption: ReactNode
}

/**
 * A click-through animated explainer: user steps forward/back through
 * stages of a diagram, each with its own caption.
 */
export function StepThrough({ steps, accent = '#a78bfa' }: { steps: Step[]; accent?: string }) {
  const [index, setIndex] = useState(0)
  const step = steps[index]

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
      {/* Progress dots */}
      <div className="flex items-center gap-2 border-b border-ink-800 px-5 py-3">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Step ${i + 1}: ${s.title}`}
            className="h-2.5 rounded-full transition-all duration-300"
            style={{
              width: i === index ? 28 : 10,
              background: i === index ? accent : i < index ? `${accent}88` : 'var(--color-ink-700)',
            }}
          />
        ))}
        <span className="ml-auto font-mono text-xs text-ink-400">
          {index + 1} / {steps.length}
        </span>
      </div>

      {/* Visual */}
      <div className="relative min-h-[260px] bg-ink-950/60">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-center p-6"
          >
            {step.visual}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Caption + controls */}
      <div className="border-t border-ink-800 p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="mb-1.5 font-display text-base font-semibold" style={{ color: accent }}>
              {step.title}
            </h4>
            <div className="text-[15px] leading-relaxed text-ink-300">{step.caption}</div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="rounded-lg border border-ink-700 px-4 py-2 text-sm font-medium text-ink-300 transition hover:border-ink-600 hover:text-ink-100 disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
            disabled={index === steps.length - 1}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-ink-950 transition disabled:opacity-30"
            style={{ background: accent }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
