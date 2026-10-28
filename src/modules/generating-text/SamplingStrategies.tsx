import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell, LabeledSlider } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const BASE = [
  { t: 'mat', logit: 4.0, c: '#34d399' },
  { t: 'floor', logit: 3.3, c: '#38bdf8' },
  { t: 'couch', logit: 2.9, c: '#a78bfa' },
  { t: 'lap', logit: 2.6, c: '#fb923c' },
  { t: 'roof', logit: 2.0, c: '#f472b6' },
  { t: 'table', logit: 1.6, c: '#fbbf24' },
  { t: 'moon', logit: 0.6, c: '#38bdf8' },
  { t: 'idea', logit: -0.4, c: '#7b7b9e' },
]

function computeDist(temp: number, topK: number, topP: number) {
  // temperature
  const scaled = BASE.map((b) => b.logit / Math.max(0.05, temp))
  let exps = scaled.map((l) => Math.exp(l))
  let sum = exps.reduce((a, b) => a + b, 0)
  let probs = exps.map((e) => e / sum)

  // rank order (BASE is already sorted desc)
  const cut = new Array(BASE.length).fill(false)
  // top-k
  for (let i = 0; i < BASE.length; i++) if (i >= topK) cut[i] = true
  // top-p (nucleus): keep smallest set with cumulative >= topP
  let cum = 0
  let nucleusDone = false
  for (let i = 0; i < BASE.length; i++) {
    if (nucleusDone) cut[i] = true
    if (!cut[i]) {
      cum += probs[i]
      if (cum >= topP) nucleusDone = true
    }
  }

  const kept = probs.map((p, i) => (cut[i] ? 0 : p))
  const keptSum = kept.reduce((a, b) => a + b, 0)
  return { final: kept.map((p) => p / keptSum), cut, raw: probs }
}

function SamplingPlayground() {
  const [temp, setTemp] = useState(1)
  const [topK, setTopK] = useState(8)
  const [topP, setTopP] = useState(1)
  const [samples, setSamples] = useState<string[]>([])

  const { final, cut, raw } = useMemo(() => computeDist(temp, topK, topP), [temp, topK, topP])

  const sample = () => {
    const r = Math.random()
    let acc = 0
    for (let i = 0; i < final.length; i++) {
      acc += final[i]
      if (r <= acc) {
        setSamples((s) => [...s.slice(-11), BASE[i].t])
        return
      }
    }
    setSamples((s) => [...s.slice(-11), BASE[0].t])
  }

  return (
    <WidgetShell
      title="The sampling playground"
      hint="Sculpt the distribution with all three dials, then draw tokens"
      accent={ACCENT}
    >
      <div className="mb-1 font-mono text-sm text-ink-300">
        "The cat sat on the <span className="text-part2">___</span>"
      </div>

      {/* distribution */}
      <div className="space-y-1.5 rounded-lg bg-ink-950/70 p-4">
        {BASE.map((tok, i) => (
          <div key={tok.t} className="flex items-center gap-2">
            <span
              className="w-12 font-mono text-xs"
              style={{
                color: cut[i] ? '#3d3d5c' : 'var(--color-ink-200)',
                textDecoration: cut[i] ? 'line-through' : 'none',
              }}
            >
              {tok.t}
            </span>
            <div className="relative h-3.5 flex-1 overflow-hidden rounded-full bg-ink-800">
              {/* ghost of pre-cutoff prob */}
              <div
                className="absolute h-full rounded-full opacity-20"
                style={{ background: tok.c, width: `${raw[i] * 100}%` }}
              />
              <motion.div
                className="absolute h-full rounded-full"
                style={{ background: cut[i] ? 'transparent' : tok.c }}
                animate={{ width: `${final[i] * 100}%` }}
                transition={{ duration: 0.25 }}
              />
            </div>
            <span className="w-12 text-right font-mono text-[10px]" style={{ color: cut[i] ? '#3d3d5c' : 'var(--color-ink-400)' }}>
              {cut[i] ? 'cut' : `${(final[i] * 100).toFixed(1)}%`}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <LabeledSlider label="Temperature" value={temp} min={0.05} max={2} step={0.05} onChange={setTemp} display={temp.toFixed(2)} accent="#fb923c" />
        <LabeledSlider label="Top-k (keep k best)" value={topK} min={1} max={8} step={1} onChange={setTopK} display={topK === 8 ? 'off' : `${topK}`} accent="#38bdf8" />
        <LabeledSlider label="Top-p (nucleus)" value={topP} min={0.1} max={1} step={0.05} onChange={setTopP} display={topP >= 1 ? 'off' : topP.toFixed(2)} accent="#34d399" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button onClick={sample} className="rounded-lg px-4 py-2 text-sm font-bold text-ink-950" style={{ background: ACCENT }}>
          Sample a token 🎲
        </button>
        <button onClick={() => setSamples([])} className="rounded-lg border border-ink-700 px-3 py-2 text-sm text-ink-300">
          clear
        </button>
        <div className="flex flex-wrap gap-1 font-mono text-xs">
          {samples.map((s, i) => (
            <span key={i} className="rounded bg-ink-800 px-1.5 py-0.5 text-ink-200">
              {s}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Experiments to try: temperature 0.05 (near-greedy — "mat" always wins) vs 2.0 (chaos —
        even "idea" gets drawn). Then set top-p to 0.9 and drag temperature high: the nucleus
        cutoff protects you from the nonsense tail while keeping variety. That combination
        (temp ~0.7–1.0 + top-p ~0.9) is what most production systems ship.
      </p>
    </WidgetShell>
  )
}

export default function SamplingStrategies() {
  return (
    <article>
      <Section title="The dials between distribution and word">
        <P>
          The model hands you a probability pie; something must draw the actual token. Always
          picking the biggest slice (<Term>greedy decoding</Term>) sounds right and reads wrong
          — output becomes repetitive, stilted, prone to loops ("I think that I think that…").
          Human text isn't a chain of most-likely words; it's pleasantly surprising. So
          production systems <Term>sample</Term> — draw randomly according to the
          probabilities — and give you dials to shape the randomness:
        </P>
        <SamplingPlayground />
        <KeyIdea>
          <Term>Temperature</Term> divides all logits before softmax. Below 1 it sharpens the
          distribution (rich get richer → predictable, safe); above 1 it flattens it
          (underdogs rise → diverse, risky). <Term>Top-k</Term> and <Term>top-p</Term> don't
          reshape — they <em>amputate the tail</em>: top-k keeps the k best tokens, top-p keeps
          the smallest set covering p of the probability mass (a smarter, self-adjusting
          cutoff), then renormalize. Reshape with temperature, guard the tail with top-p.
        </KeyIdea>
      </Section>

      <Section title="Choosing your randomness">
        <Analogy>
          A jazz musician choosing the next note. Temperature 0 is playing the textbook chord
          tone every time — technically correct, deadly dull. Cranked too high, they're hitting
          random keys. Top-p is the professional's discipline: improvise freely, but only among
          notes that fit the harmony — the size of "fitting" adjusts with the musical moment,
          which is exactly why top-p beats a fixed top-k: when the model is certain (one
          obvious continuation), the nucleus shrinks to 1–2 tokens; when many continuations are
          plausible, it opens up.
        </Analogy>
        <List
          items={[
            <>
              <Term>Practical settings:</Term> code and math → temperature 0–0.3 (correctness
              over flair); chat → ~0.7; brainstorming and fiction → 0.9–1.2 with top-p 0.9–0.95.
              These are the exact parameters in every LLM API.
            </>,
            <>
              <Term>Temperature 0 ≠ perfectly deterministic in practice:</Term> parallel GPU
              floating-point arithmetic introduces tiny nondeterminism, and batching can too —
              a famous source of "why did I get different answers?!" confusion.
            </>,
            <>
              <Term>Beyond one path:</Term> sampling multiple full answers and picking the best
              (self-consistency, best-of-n) turns randomness into a reasoning tool — a preview
              of test-time compute (Module 18).
            </>,
          ]}
        />
        <WhyItMatters>
          These are the dials <em>you actually get to turn</em>. Debugging "the model is too
          bland" (raise temp / top-p) or "it said something unhinged" (lower temp, tighten
          top-p) is daily LLM work. And understanding sampling reframes something profound:
          when a model gives different answers to the same question, nothing changed inside —
          you drew twice from the same distribution. The "model" is the pie, not the slice.
        </WhyItMatters>
        <Misconception>
          "Temperature makes the model smarter or dumber." Temperature never touches the
          model's beliefs — the logits are identical at every setting. It only changes how
          adventurously you draw from them. A wrong fact at temperature 0 is still wrong at 0;
          creativity dials don't add knowledge, and determinism doesn't add truth.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Why not always pick the highest-probability token?',
            options: [
              'It would be too fast',
              'Greedy decoding produces repetitive, loop-prone, unnaturally flat text — human writing is not a chain of most-likely words',
              'The top token is usually wrong',
              'APIs forbid it',
            ],
            answer: 1,
            explanation:
              'Locally-optimal choices compound into degenerate text (repetition loops are the classic symptom). Controlled randomness is what makes output feel natural.',
          },
          {
            question: 'What\u2019s the key advantage of top-p over top-k?',
            options: [
              'It\u2019s faster to compute',
              'Its cutoff adapts: keeps 1–2 tokens when the model is confident, many when it\u2019s uncertain',
              'It changes the logits directly',
              'It guarantees factual output',
            ],
            answer: 1,
            explanation:
              'A fixed k is too many candidates in confident moments and too few in open ones. Covering a fixed share of probability mass adjusts automatically to the distribution\u2019s shape.',
          },
          {
            question: 'You ask the same question twice at temperature 0.9 and get different answers. What changed inside the model?',
            options: [
              'Its weights updated between calls',
              'Nothing — both answers were draws from the identical distribution',
              'It learned from the first question',
              'The context window shifted',
            ],
            answer: 1,
            explanation:
              'Weights are frozen at inference. The model\u2019s "opinion" is the distribution; the variety you see is the sampler\u2019s dice, not a change of mind.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Greedy = repetitive; sampling with dials is the production standard.</>,
          <>Temperature reshapes (sharpen/flatten); top-k and top-p amputate the tail; combine temp ~0.7–1 with top-p ~0.9.</>,
          <>Low temp for code/facts, high for creativity — but temperature never changes what the model believes.</>,
          <>Different answers to the same prompt = different draws from the same pie.</>,
        ]}
      />
    </article>
  )
}
