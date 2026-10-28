import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { modules, parts, partHex, totalConcepts } from '../data/curriculum'
import { useProgress } from '../hooks/useProgress'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { readCount, isRead } = useProgress()
  const location = useLocation()

  const progressPct = Math.round((readCount / totalConcepts) * 100)

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-ink-800 bg-ink-950/85 backdrop-blur">
        <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
          <button
            className="rounded-lg border border-ink-700 p-2 text-ink-300 lg:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect y="2" width="16" height="2" rx="1" />
              <rect y="7" width="16" height="2" rx="1" />
              <rect y="12" width="16" height="2" rx="1" />
            </svg>
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="font-display text-lg font-bold tracking-tight text-ink-100">
              GenAI <span className="text-part2">Atlas</span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-ink-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-part1 via-part2 to-part5 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="font-mono text-xs text-ink-400">
                {readCount}/{totalConcepts}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`thin-scroll fixed top-14 bottom-0 left-0 z-30 w-72 overflow-y-auto border-r border-ink-800 bg-ink-950 px-3 py-5 transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {parts.map((part) => (
          <div key={part.id} className="mb-6">
            <div className="mb-2 flex items-center gap-2 px-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: partHex[part.id] }}
              />
              <span className="font-display text-[11px] font-bold tracking-[0.18em] text-ink-400 uppercase">
                Part {part.id} · {part.title}
              </span>
            </div>
            <nav className="space-y-0.5">
              {modules
                .filter((m) => m.partId === part.id)
                .map((m) => {
                  const done = m.concepts.filter((c) => isRead(m.id, c.id)).length
                  const active = location.pathname.startsWith(`/learn/${m.id}`)
                  return (
                    <NavLink
                      key={m.id}
                      to={`/learn/${m.id}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13.5px] transition ${
                        active
                          ? 'bg-ink-850 font-medium text-ink-100'
                          : 'text-ink-300 hover:bg-ink-900 hover:text-ink-100'
                      }`}
                    >
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[10.5px] font-semibold"
                        style={{
                          background: active ? `${partHex[part.id]}26` : 'var(--color-ink-850)',
                          color: active ? partHex[part.id] : 'var(--color-ink-400)',
                        }}
                      >
                        {m.number}
                      </span>
                      <span className="flex-1 truncate">{m.title}</span>
                      {done > 0 && (
                        <span className="font-mono text-[10px] text-ink-500">
                          {done}/{m.concepts.length}
                        </span>
                      )}
                    </NavLink>
                  )
                })}
            </nav>
          </div>
        ))}
      </aside>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="pt-14 lg:pl-72">
        <Outlet />
      </main>
    </div>
  )
}

function Logo() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <circle cx="13" cy="13" r="12" stroke="#a78bfa" strokeWidth="1.5" opacity="0.5" />
      <circle cx="13" cy="13" r="7.5" stroke="#38bdf8" strokeWidth="1.5" opacity="0.7" />
      <circle cx="13" cy="13" r="3" fill="#f472b6" />
    </svg>
  )
}
