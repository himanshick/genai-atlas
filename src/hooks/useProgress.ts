import { useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'genai-atlas-progress'

let cache: Set<string> = load()
const listeners = new Set<() => void>()

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function persist(next: Set<string>) {
  cache = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function conceptKey(moduleId: string, conceptId: string) {
  return `${moduleId}/${conceptId}`
}

/** Tracks which concepts the user has marked as read (persisted in localStorage). */
export function useProgress() {
  const completed = useSyncExternalStore(subscribe, () => cache)

  const isRead = useCallback(
    (moduleId: string, conceptId: string) => completed.has(conceptKey(moduleId, conceptId)),
    [completed],
  )

  const toggleRead = useCallback((moduleId: string, conceptId: string) => {
    const next = new Set(cache)
    const key = conceptKey(moduleId, conceptId)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    persist(next)
  }, [])

  return { completed, isRead, toggleRead, readCount: completed.size }
}
