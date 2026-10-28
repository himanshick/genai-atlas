import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const TOKENS = ['The', 'cat', 'sat', 'on', 'the', 'mat']

function CacheDemo() {
  const [step, setStep] = useState(1) // generating token index `step` (0-based tokens exist up to step)
  const [cached, setCached] = useState(true)

  const n = step + 1 // tokens processed so far
  const withoutWork = ((n + 1) * n) / 2 // cumulative token-computations
  const withWork = n

  return (
    <WidgetShell
      title="Generate with and without the cache"
      hint="Step through generation — count the redundant work"
      accent={ACCENT}
    >
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setCached(false)}
          className="flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition"
          style={{
            borderColor: !cached ? '#f87171' : 'var(--color-ink-700)',
            color: !cached ? '#f87171' : 'var(--color-ink-400)',
            background: !cached ? '#f8717112' : 'transparent',
          }}
        >
          Naive: recompute everything
        </button>
        <button
          onClick={() => setCached(true)}
          className="flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition"
          style={{
            borderColor: cached ? '#34d399' : 'var(--color-ink-700)',
            color: cached ? '#34d399' : 'var(--color-ink-400)',
            background: cached ? '#34d39912' : 'transparent',
          }}
        >
          With KV cache
        </button>
      </div>

      <svg viewBox="0 0 440 190" className="w-full rounded-lg bg-ink-950/70">
        {/* token row */}
        {TOKENS.slice(0, step + 1).map((t, i) => {
          const isNew = i === step
          const recomputed = !cached || isNew
          return (
            <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              <rect
                x={20 + i * 68}
                y={30}
                width={58}
                height={30}
                rx={7}
                fill={recomputed ? (isNew ? '#a78bfa30' : '#f8717125') : '#34d39918'}
                stroke={recomputed ? (isNew ? '#a78bfa' : '#f87171') : '#34d399'}
                strokeWidth={isNew ? 2 : 1}
              />
              <text x={49 + i * 68} y={49} textAnchor="middle" fontSize={11} fill="#e8e8f4" fontFamily="monospace">
                {t}
              </text>
              <text
                x={49 + i * 68}
                y={78}
                textAnchor="middle"
                fontSize={8}
                fill={recomputed ? (isNew ? '#a78bfa' : '#f87171') : '#34d399'}
              >
                {isNew ? 'computing' : recomputed ? 'recomputed!' : 'cached K,V ✓'}
              </text>
            </motion.g>
          )
        })}

        {/* work meter */}
        <g transform="translate(20, 110)">
          <text x={0} y={0} fontSize={10} fill="#a3a3c2">
            cumulative token-computations after this step:
          </text>
          <rect x={0} y={10} width={400} height={16} rx={8} fill="#2a2a44" />
          <motion.rect
            x={0}
            y={10}
            height={16}
            rx={8}
            fill={cached ? '#34d399' : '#f87171'}
            animate={{ width: Math.min(400, ((cached ? withWork : withoutWork) / 21) * 400) }}
          />
          <text x={0} y={48} fontSize={11} fill={cached ? '#34d399' : '#f87171'} fontFamily="monospace">
            {cached ? withWork : withoutWork} token-computations {cached ? '(linear growth)' : '(quadratic growth!)'}
          </text>
        </g>
      </svg>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setStep((s) => Math.min(TOKENS.length - 1, s + 1))}
          disabled={step >= TOKENS.length - 1}
          className="rounded-lg px-4 py-2 text-sm font-bold text-ink-950 disabled:opacity-40"
          style={{ background: ACCENT }}
        >
          Generate next token →
        </button>
        <button onClick={() => setStep(1)} className="rounded-lg border border-ink-700 px-3 py-2 text-sm text-ink-300">
          ↺ restart
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Naive mode re-runs attention math for every old token at every step (red) — by token 6,
        that's 21 token-computations instead of 6. At a realistic 1,000 tokens, it's 500,500
        versus 1,000. The cache stores each token's Key and Value vectors the first time and
        simply reuses them forever after.
      </p>
    </WidgetShell>
  )
}

export default function KvCache() {
  return (
    <article>
      <Section title="The waste hiding in the generation loop">
        <P>
          Recall the journey (Module 6): each new token requires a forward pass over the whole
          sequence. Watch what that implies naively — generating token #1000 means recomputing
          attention Keys and Values for tokens 1–999… which were <em>identical</em> last step,
          and the step before. Under the causal mask, old tokens can't see new ones, so their
          K and V vectors <Term>never change</Term>. Recomputing them is pure waste.
        </P>
        <CacheDemo />
        <KeyIdea>
          The <Term>KV cache</Term>: after computing any token's Key and Value vectors (per
          layer, per head), store them in GPU memory. Each generation step then processes{' '}
          <em>only the one new token</em>, whose Query attends over all the cached K/V. Per-step
          cost drops from "reprocess everything" to "process one token" — the single most
          important inference optimization, used by every serving system on earth.
        </KeyIdea>
      </Section>

      <Section title="The price: memory becomes the battlefield">
        <Analogy>
          A minute-taker in a long meeting. Naive approach: every time someone new speaks,
          re-interview every previous speaker about what they said. KV caching: keep written
          minutes; when a new person speaks, they consult the minutes and add one line. Nobody
          repeats themselves — but the minutes pile up, and the meeting room (GPU memory) is
          only so big.
        </Analogy>
        <List
          items={[
            <>
              <Term>The memory bill is real:</Term> cache size = layers × positions × heads ×
              head-dim × 2 (K and V) × bytes. A 70B model with a 32K-token conversation can eat{' '}
              <em>tens of gigabytes</em> per user session. Serving a thousand chats = a
              warehouse of caches.
            </>,
            <>
              <Term>Why "prompt vs completion" pricing differs:</Term> the prompt is processed
              in one parallel pass (prefill — cheap per token, GPUs love it); generation is
              one-token-at-a-time against the cache (decode — memory-bandwidth-bound, the
              expensive part). Two phases, two economics; that's the shape of every LLM bill
              and every "time to first token" metric.
            </>,
            <>
              <Term>Engineering around it:</Term> grouped-query attention (heads share K/V —
              Module 6's anatomy paying off), PagedAttention/vLLM (virtual-memory tricks for
              caches), prompt caching (reusing the prefill of a shared prefix across requests —
              why repeated system prompts get discounted), quantized caches.
            </>,
          ]}
        />
        <WhyItMatters>
          The KV cache explains the texture of every LLM product you touch: why the first token
          takes a moment but the rest stream fast (prefill vs decode), why providers discount
          "cached input tokens", why long conversations slow down and cost more, and why max
          concurrent users is a memory question. When an engineer says "we're KV-bound", you
          now know exactly what's full.
        </WhyItMatters>
        <Misconception>
          "The KV cache is the model's memory of the conversation." It's a computational
          shortcut, not memory — it stores <em>intermediate math results</em> (K/V vectors),
          not information the model wouldn't otherwise have. Clear the cache and recompute from
          the same text: identical results, just slower. The conversation "memory" is the text
          in the window; the cache merely avoids re-digesting it.
        </Misconception>
        <DeepDive title="Deep dive: why exactly K and V, but not Q?">
          <P>
            A pleasing check of your Module 6 understanding. Queries ask "what am I looking
            for?" — only the <em>newest</em> token needs to ask anything (it's the one being
            computed). Keys and Values are what tokens <em>offer</em> to future lookups — and
            every future token will need every past token's offerings. So K and V must persist;
            Q is used once and discarded. The cache stores exactly what the future will ask
            about the past, nothing more.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Why is it safe to cache old tokens\u2019 K and V vectors forever?',
            options: [
              'They\u2019re small enough to keep',
              'The causal mask means old tokens never see new ones, so their K/V never change',
              'The model refreshes them nightly',
              'It isn\u2019t safe — quality degrades',
            ],
            answer: 1,
            explanation:
              'Under causal attention, a token\u2019s representation depends only on its past. New tokens can\u2019t alter it — so its K/V are final the moment they\u2019re computed.',
          },
          {
            question: 'Why does the first token of a reply take noticeably longer than the rest?',
            options: [
              'The model is thinking harder about it',
              'Prefill: the entire prompt must be processed (and cached) before the first output token; afterwards each step handles just one token',
              'Network latency only affects the first token',
              'Sampling is slower initially',
            ],
            answer: 1,
            explanation:
              'Time-to-first-token ≈ prompt processing; streaming speed ≈ per-token decode against the cache. Two phases with different economics — visible in every chat UI.',
          },
          {
            question: 'What is the KV cache\u2019s main cost?',
            options: [
              'It makes output less accurate',
              'GPU memory — gigabytes per long conversation, which limits concurrent users and context length',
              'It doubles training time',
              'License fees',
            ],
            answer: 1,
            explanation:
              'The compute saved is paid in memory: layers × tokens × heads × dims × 2. Serving economics (and inventions like PagedAttention and GQA) revolve around this footprint.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Causal masking makes old tokens' K/V immutable — so cache them and process only the new token each step.</>,
          <>Quadratic recomputation becomes linear generation: the optimization every LLM server runs on.</>,
          <>The bill moves to GPU memory — the origin of prefill/decode pricing, prompt-caching discounts, and concurrency limits.</>,
          <>It's a math shortcut, not a memory: same text in, same answers out, just fast.</>,
        ]}
      />
    </article>
  )
}
