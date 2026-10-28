import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { modules, parts, partHex, totalConcepts, readyConcepts } from '../data/curriculum'
import { useProgress } from '../hooks/useProgress'

export function HomePage() {
  const { isRead, readCount } = useProgress()

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <HeroBackdrop />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <p className="mb-4 font-mono text-xs tracking-[0.25em] text-part2 uppercase">
            An explorable atlas of Generative AI
          </p>
          <h1 className="max-w-2xl font-display text-4xl leading-tight font-bold tracking-tight text-ink-100 sm:text-5xl">
            Every GenAI concept.
            <br />
            <span className="bg-gradient-to-r from-part1 via-part2 to-part5 bg-clip-text text-transparent">
              Explained so anyone gets it.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-300">
            From "what is a neural network" to diffusion models, agents and mixture-of-experts —
            every idea taught with plain language, moving diagrams and things you can poke. Always
            the <em>why</em> and the <em>how</em>, never just the what.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/learn/what-is-genai/ai-ml-dl-genai"
              className="rounded-xl bg-part2 px-6 py-3 font-display text-sm font-bold text-ink-950 transition hover:brightness-110"
            >
              Start learning →
            </Link>
            <div className="flex gap-6 text-sm text-ink-400">
              <Stat value={modules.length} label="modules" />
              <Stat value={totalConcepts} label="concepts" />
              <Stat value={readyConcepts} label="live now" />
              {readCount > 0 && <Stat value={readCount} label="you've read" />}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---- Roadmap ---- */}
      <div className="space-y-16">
        {parts.map((part, pi) => {
          const partModules = modules.filter((m) => m.partId === part.id)
          const accent = partHex[part.id]
          return (
            <motion.section
              key={part.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: pi * 0.03 }}
            >
              <div className="mb-6 flex items-center gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold"
                  style={{ background: `${accent}1e`, color: accent }}
                >
                  {part.id}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink-100">{part.title}</h2>
                  <p className="text-sm text-ink-400">{part.subtitle}</p>
                </div>
                <div
                  className="ml-4 hidden h-px flex-1 sm:block"
                  style={{ background: `linear-gradient(to right, ${accent}55, transparent)` }}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {partModules.map((m) => {
                  const done = m.concepts.filter((c) => isRead(m.id, c.id)).length
                  const ready = m.concepts.some((c) => c.status === 'ready')
                  return (
                    <Link
                      key={m.id}
                      to={`/learn/${m.id}`}
                      className="group relative overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 p-5 transition hover:-translate-y-0.5 hover:border-ink-600"
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-0.5 opacity-60"
                        style={{ background: accent }}
                      />
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-mono text-xs font-semibold" style={{ color: accent }}>
                          {String(m.number).padStart(2, '0')}
                        </span>
                        <h3 className="font-display text-[17px] font-bold text-ink-100 group-hover:text-white">
                          {m.title}
                        </h3>
                        {!ready && (
                          <span className="ml-auto rounded bg-ink-800 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-ink-400 uppercase">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-ink-400">
                        {m.description}
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink-800">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(done / m.concepts.length) * 100}%`,
                              background: accent,
                            }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-ink-500">
                          {done}/{m.concepts.length}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </motion.section>
          )
        })}
      </div>

      <footer className="mt-20 border-t border-ink-800 pt-8 text-center text-sm text-ink-500">
        Built as a personal atlas of everything Generative AI — concepts first, math optional.
      </footer>
    </div>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <span>
      <span className="font-display font-bold text-ink-100">{value}</span> {label}
    </span>
  )
}

function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        className="absolute -top-20 -right-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-24 -left-24 h-80 w-80 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #38bdf8, transparent 70%)' }}
        animate={{ scale: [1.1, 1, 1.1], y: [0, 16, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
