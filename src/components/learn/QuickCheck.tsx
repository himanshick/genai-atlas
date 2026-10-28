import { useState } from 'react'
import { motion } from 'framer-motion'

export interface QuizQuestion {
  question: string
  options: string[]
  /** Index into options. */
  answer: number
  /** Shown after answering, explains why. */
  explanation: string
}

/** A small multiple-choice self-check with instant feedback. */
export function QuickCheck({ questions }: { questions: QuizQuestion[] }) {
  return (
    <div className="my-10">
      <h3 className="mb-4 font-display text-lg font-bold text-ink-100">🧠 Quick check</h3>
      <div className="space-y-4">
        {questions.map((q, i) => (
          <Question key={i} q={q} index={i} />
        ))}
      </div>
    </div>
  )
}

function Question({ q, index }: { q: QuizQuestion; index: number }) {
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  const correct = picked === q.answer

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900 p-5">
      <p className="mb-3 text-[15px] font-medium text-ink-100">
        <span className="mr-2 font-mono text-sm text-ink-400">Q{index + 1}</span>
        {q.question}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {q.options.map((opt, i) => {
          const isPick = picked === i
          const isAnswer = answered && i === q.answer
          return (
            <button
              key={i}
              onClick={() => !answered && setPicked(i)}
              disabled={answered}
              className="rounded-lg border px-4 py-2.5 text-left text-sm transition"
              style={{
                borderColor: isAnswer
                  ? '#34d39988'
                  : isPick
                    ? '#f8717188'
                    : 'var(--color-ink-700)',
                background: isAnswer
                  ? '#34d39918'
                  : isPick
                    ? '#f8717118'
                    : 'transparent',
                color:
                  isAnswer || isPick ? 'var(--color-ink-100)' : 'var(--color-ink-300)',
                cursor: answered ? 'default' : 'pointer',
              }}
            >
              {opt}
              {isAnswer && ' ✓'}
              {isPick && !correct && ' ✗'}
            </button>
          )
        })}
      </div>
      {answered && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-lg bg-ink-850 p-3 text-sm leading-relaxed text-ink-300"
        >
          <span className={correct ? 'font-semibold text-emerald-400' : 'font-semibold text-red-400'}>
            {correct ? 'Correct! ' : 'Not quite. '}
          </span>
          {q.explanation}
        </motion.p>
      )}
    </div>
  )
}
