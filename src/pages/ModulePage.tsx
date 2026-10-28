import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getModule, getPart, partHex } from '../data/curriculum'
import { useProgress } from '../hooks/useProgress'

export function ModulePage() {
  const { moduleId = '' } = useParams()
  const module = getModule(moduleId)
  const { isRead } = useProgress()

  if (!module) return <Navigate to="/" replace />

  const part = getPart(module.partId)
  const accent = partHex[part.id]

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <nav className="mb-6 flex items-center gap-2 text-[13px] text-ink-400">
        <Link to="/" className="hover:text-ink-200">
          Roadmap
        </Link>
        <span>/</span>
        <span className="text-ink-300">
          Module {module.number}
        </span>
      </nav>

      <header className="mb-10">
        <div
          className="mb-3 inline-block rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider uppercase"
          style={{ background: `${accent}1e`, color: accent }}
        >
          Part {part.id} · {part.title}
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl">
          {module.number}. {module.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-400">{module.description}</p>
      </header>

      <div className="space-y-3">
        {module.concepts.map((c, i) => {
          const read = isRead(module.id, c.id)
          const ready = c.status === 'ready'
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/learn/${module.id}/${c.id}`}
                className="group flex items-start gap-4 rounded-xl border border-ink-700 bg-ink-900 p-5 transition hover:border-ink-600 hover:bg-ink-850"
              >
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-semibold"
                  style={{
                    background: read ? '#34d39922' : `${accent}1a`,
                    color: read ? '#34d399' : accent,
                  }}
                >
                  {read ? '✓' : i + 1}
                </span>
                <span className="flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-base font-semibold text-ink-100 group-hover:text-white">
                      {c.title}
                    </span>
                    {!ready && (
                      <span className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-ink-400 uppercase">
                        Soon
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-400">
                    {c.tagline}
                  </span>
                </span>
                <span className="mt-1 text-ink-500 transition group-hover:translate-x-0.5 group-hover:text-ink-300">
                  →
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
