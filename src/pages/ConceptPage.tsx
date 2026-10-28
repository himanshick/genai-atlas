import { Suspense } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getAdjacent, getConcept, getModule, getPart, partHex } from '../data/curriculum'
import { conceptRegistry } from '../modules/registry'
import { useProgress } from '../hooks/useProgress'

export function ConceptPage() {
  const { moduleId = '', conceptId = '' } = useParams()
  const module = getModule(moduleId)
  const concept = getConcept(moduleId, conceptId)
  const { isRead, toggleRead } = useProgress()

  if (!module || !concept) return <Navigate to="/" replace />

  const part = getPart(module.partId)
  const accent = partHex[part.id]
  const registryKey = `${moduleId}/${conceptId}`
  const Content = registryKey in conceptRegistry ? conceptRegistry[registryKey] : null
  const { prev, next } = getAdjacent(moduleId, conceptId)
  const read = isRead(moduleId, conceptId)

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8" key={`${moduleId}/${conceptId}`}>
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-[13px] text-ink-400">
        <Link to="/" className="hover:text-ink-200">
          Roadmap
        </Link>
        <span>/</span>
        <Link to={`/learn/${module.id}`} className="hover:text-ink-200">
          {module.number}. {module.title}
        </Link>
        <span>/</span>
        <span className="text-ink-300">{concept.title}</span>
      </nav>

      {/* Title */}
      <header className="mb-10">
        <div
          className="mb-3 inline-block rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider uppercase"
          style={{ background: `${accent}1e`, color: accent }}
        >
          Part {part.id} · {part.title}
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink-100 sm:text-4xl">
          {concept.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-400">{concept.tagline}</p>
      </header>

      {/* Body */}
      {Content ? (
        <Suspense
          fallback={
            <div className="flex items-center gap-3 py-20 text-ink-400">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-600 border-t-ink-200" />
              Loading…
            </div>
          }
        >
          <Content />
        </Suspense>
      ) : (
        <ComingSoon accent={accent} />
      )}

      {/* Mark as read */}
      {Content && (
        <button
          onClick={() => toggleRead(moduleId, conceptId)}
          className="mt-10 w-full rounded-xl border py-3.5 font-display text-sm font-semibold transition"
          style={{
            borderColor: read ? '#34d39966' : 'var(--color-ink-700)',
            background: read ? '#34d39914' : 'transparent',
            color: read ? '#34d399' : 'var(--color-ink-300)',
          }}
        >
          {read ? '✓ Marked as understood — click to undo' : 'Mark this concept as understood'}
        </button>
      )}

      {/* Prev / Next */}
      <nav className="mt-8 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            to={`/learn/${prev.moduleId}/${prev.concept.id}`}
            className="group rounded-xl border border-ink-700 p-4 transition hover:border-ink-600 hover:bg-ink-900"
          >
            <div className="text-xs text-ink-400">← Previous</div>
            <div className="mt-1 font-display text-sm font-semibold text-ink-200 group-hover:text-ink-100">
              {prev.concept.title}
            </div>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to={`/learn/${next.moduleId}/${next.concept.id}`}
            className="group rounded-xl border border-ink-700 p-4 text-right transition hover:border-ink-600 hover:bg-ink-900"
          >
            <div className="text-xs text-ink-400">Next →</div>
            <div className="mt-1 font-display text-sm font-semibold text-ink-200 group-hover:text-ink-100">
              {next.concept.title}
            </div>
          </Link>
        )}
      </nav>
    </div>
  )
}

function ComingSoon({ accent }: { accent: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-700 p-12 text-center">
      <div className="mb-3 text-4xl">🚧</div>
      <h2 className="font-display text-xl font-bold text-ink-100">Coming soon</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-400">
        This concept is on the roadmap but not written yet. The Foundations modules (Part 1) are
        complete — new concepts are added following the same interactive format.
      </p>
      <div
        className="mx-auto mt-5 h-1 w-24 rounded-full"
        style={{ background: `${accent}55` }}
      />
    </div>
  )
}
