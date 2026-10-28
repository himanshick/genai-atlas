import { useState } from 'react'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell, LabeledSlider } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const WINDOW = 24 // tokens the toy model can see

function ContextDemo() {
  const [turns, setTurns] = useState(2)

  // each turn = 8 tokens; system prompt = 6 tokens
  const conversation: { label: string; tokens: number; color: string; role: string }[] = [
    { label: 'system prompt ("You are a helpful pirate…")', tokens: 6, color: '#fbbf24', role: 'sys' },
  ]
  for (let i = 1; i <= turns; i++) {
    conversation.push({ label: `turn ${i}: user asks`, tokens: 4, color: '#38bdf8', role: 'user' })
    conversation.push({ label: `turn ${i}: model replies`, tokens: 4, color: '#a78bfa', role: 'ai' })
  }

  const total = conversation.reduce((a, c) => a + c.tokens, 0)
  const overflow = Math.max(0, total - WINDOW)

  // figure out what falls off (from the front, after system typically — here simple front-truncation)
  let dropped = 0
  const rendered = conversation.map((c) => {
    const dropHere = Math.max(0, Math.min(c.tokens, overflow - dropped))
    dropped += dropHere
    return { ...c, dropped: dropHere }
  })

  const pirateLost = rendered[0].dropped > 0

  return (
    <WidgetShell
      title="Watch a conversation fall off the edge"
      hint="Add turns until the window overflows — see what silently vanishes"
      accent={ACCENT}
    >
      <LabeledSlider
        label="Conversation length"
        value={turns}
        min={1}
        max={6}
        step={1}
        onChange={setTurns}
        display={`${turns} turns`}
        accent={ACCENT}
      />

      <div className="mt-4 space-y-1.5">
        {rendered.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex h-6 flex-1 gap-0.5">
              {Array.from({ length: c.tokens }, (_, t) => {
                const isDropped = t < c.dropped
                return (
                  <div
                    key={t}
                    className="flex-1 rounded-sm transition-all"
                    style={{
                      background: isDropped ? 'transparent' : c.color,
                      border: isDropped ? '1px dashed #3d3d5c' : 'none',
                      opacity: isDropped ? 0.6 : 0.85,
                    }}
                  />
                )
              })}
            </div>
            <span className="w-56 truncate text-[11px]" style={{ color: c.dropped > 0 ? '#f87171' : 'var(--color-ink-400)' }}>
              {c.dropped > 0 ? '✕ partially forgotten — ' : ''}
              {c.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-ink-850 px-4 py-3">
        <span className="font-mono text-xs text-ink-300">
          {total} tokens used / {WINDOW} window
        </span>
        {overflow > 0 ? (
          <span className="font-mono text-xs font-bold text-red-400">{overflow} tokens evicted!</span>
        ) : (
          <span className="font-mono text-xs text-emerald-400">fits ✓</span>
        )}
      </div>

      {pirateLost && (
        <p className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-xs leading-relaxed text-red-300">
          The system prompt just fell out of the window — the model has no idea it was supposed
          to be a pirate anymore. Long-conversation "personality drift" and forgotten
          instructions are exactly this failure. (Real chat apps protect the system prompt and
          evict middle turns instead — but something still has to go.)
        </p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Toy window of {WINDOW} tokens for visibility — real models range from 8K to 1M+. The
        physics is identical: attention can only see what's inside the window. Everything
        outside contributes <em>nothing</em> — there is no "faded memory", only presence or
        absence.
      </p>
    </WidgetShell>
  )
}

export default function ContextWindows() {
  return (
    <article>
      <Section title="Working memory, strictly bounded">
        <P>
          A transformer has two completely different kinds of "knowing". Its{' '}
          <Term>weights</Term> hold everything from pretraining — vast, permanent, frozen. Its{' '}
          <Term>context window</Term> holds the current prompt and conversation — the only
          thing it can actually <em>read right now</em>. The window is measured in tokens
          (Module 4), and it is a hard wall: GPT-4o sees 128K tokens, Gemini versions reach 1M+,
          and token 128,001 might as well not exist.
        </P>
        <ContextDemo />
        <KeyIdea>
          The context window is the model's <Term>entire perceivable universe</Term> at
          inference time. It doesn't "remember" your earlier chats and it doesn't "forget
          gradually" — the application either re-sends history into the window or the model
          never sees it. Every memory feature you've used (ChatGPT memory, project context) is
          software stuffing text into this window behind the scenes.
        </KeyIdea>
      </Section>

      <Section title="Why not just make it huge?">
        <List
          items={[
            <>
              <Term>The quadratic tax:</Term> self-attention compares every token with every
              other — O(n²). 10× the context ≈ 100× the attention compute. Long context is
              paid for, not free (this is THE consequence of Module 6's architecture).
            </>,
            <>
              <Term>The memory tax:</Term> serving long contexts requires caching keys and
              values for every token and layer (next page) — GPU memory fills up fast.
            </>,
            <>
              <Term>Lost in the middle:</Term> even within the window, attention isn't uniform.
              Models reliably use information at the start and end of long contexts but
              measurably miss things buried in the middle — like a student who read the
              introduction and conclusion carefully. "It's in the context" ≠ "it will be used".
            </>,
            <>
              <Term>Position stretch:</Term> training on mostly-short documents means very long
              positions are out-of-distribution — the RoPE-scaling battles from Module 6's
              positional encoding page.
            </>,
          ]}
        />
        <Analogy>
          The weights are everything you've ever learned; the context window is your desk. A
          bigger desk lets you spread out more documents, but (1) you rented a bigger office to
          get it, (2) finding one line across forty spread-out pages is genuinely harder than
          in two, and (3) when the desk is full, adding a new page means one falls off — and
          you don't get to feel it fall. LLM apps are, to a first approximation, desk-management
          software.
        </Analogy>
        <WhyItMatters>
          Context management is the core discipline of practical LLM work. It explains: pricing
          (input tokens cost money <em>every message</em> because history is re-sent), long
          conversations degrading (eviction + lost-in-the-middle), why "paste the whole
          codebase" underperforms a good retrieval setup (RAG, Module 10, exists precisely to
          put only the <em>right</em> tokens in the window), and why prompt structure matters —
          put critical instructions at the start or end, never the middle.
        </WhyItMatters>
        <Misconception>
          "The model remembers our previous conversations." By default, absolutely nothing
          persists — each API call is a blank slate receiving whatever text you send. Chat
          products simulate continuity by replaying history into each request (and summarizing
          when it overflows). If a model "remembers" your name across sessions, there's a
          database and a retrieval step doing that — engineering, not neurology.
        </Misconception>
        <DeepDive title="Deep dive: needle in a haystack">
          <P>
            The standard test for long-context claims: bury one odd fact (the "needle" — "The
            secret ingredient is glitter") at a controlled depth inside thousands of tokens of
            filler, then quiz the model. Plotting accuracy across (depth × context length)
            yields a heatmap that exposes dead zones — many models flunk mid-document depths at
            long lengths even when marketing says "1M context!". When evaluating a model for
            document work, ask for its needle heatmap, not its window size. And note what the
            test doesn't cover: finding one fact is easier than <em>synthesizing</em> across a
            whole document — real long-context competence is harder than the benchmark.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Weights vs context window — what\u2019s the split?',
            options: [
              'Weights hold recent chats; the window holds old knowledge',
              'Weights = permanent knowledge from training; window = the only text readable right now',
              'They are two names for the same memory',
              'The window stores the model\u2019s personality',
            ],
            answer: 1,
            explanation:
              'Long-term memory (frozen weights) vs working memory (the current token sequence). Confusing the two is the root of most misconceptions about model "memory".',
          },
          {
            question: 'Why does doubling context length far more than double the cost?',
            options: [
              'Tokens get individually more expensive',
              'Attention is all-pairs: compute grows quadratically, and the KV memory footprint grows too',
              'Longer prompts need bigger vocabularies',
              'It doesn\u2019t — cost is linear',
            ],
            answer: 1,
            explanation:
              'O(n²) attention plus per-token KV caching means long context taxes both compute and GPU memory — the architectural bill from Module 6 coming due.',
          },
          {
            question: 'Your assistant "forgot" it was supposed to answer in French after 50 messages. Most likely cause?',
            options: [
              'The model got bored',
              'The instruction was evicted from (or lost in the middle of) the context window',
              'French was disabled server-side',
              'Temperature was too low',
            ],
            answer: 1,
            explanation:
              'Long conversations overflow the window; apps evict or summarize old turns, and mid-context content gets weak attention. The instruction is no longer effectively visible.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Context window = the model's entire readable universe per call; outside it, information simply doesn't exist.</>,
          <>Nothing persists between calls — all "memory" is software re-inserting text.</>,
          <>Long context costs quadratic compute + linear memory, and mid-window content gets neglected ("lost in the middle").</>,
          <>Practical LLM engineering ≈ deciding which tokens deserve the window (the thesis of RAG, Module 10).</>,
        ]}
      />
    </article>
  )
}
