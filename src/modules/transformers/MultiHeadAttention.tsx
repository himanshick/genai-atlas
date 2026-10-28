import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const WORDS = ['The', 'chef', 'who', 'won', 'the', 'prize', 'cooked', 'a', 'perfect', 'meal']

interface Head {
  name: string
  color: string
  desc: string
  /** pairs: [from, to, strength] */
  links: [number, number, number][]
}

const HEADS: Head[] = [
  {
    name: 'Syntax head',
    color: '#38bdf8',
    desc: 'Tracks grammatical structure: subjects to their verbs, articles to their nouns. "cooked" links back to "chef" (who did the cooking?), "The" to "chef", "a" to "meal".',
    links: [
      [6, 1, 0.9],
      [0, 1, 0.7],
      [4, 5, 0.7],
      [7, 9, 0.75],
      [8, 9, 0.6],
    ],
  },
  {
    name: 'Reference head',
    color: '#34d399',
    desc: 'Resolves who/which/it back to their referents: "who" points firmly at "chef". Heads like this are the coreference machinery from the previous page.',
    links: [
      [2, 1, 0.95],
      [3, 2, 0.6],
    ],
  },
  {
    name: 'Previous-token head',
    color: '#fb923c',
    desc: 'Simply looks at the word immediately before — surprisingly common in real transformers and useful for local phrases and copying patterns.',
    links: WORDS.slice(1).map((_, i) => [i + 1, i, 0.8] as [number, number, number]),
  },
  {
    name: 'Semantic head',
    color: '#f472b6',
    desc: 'Connects words that belong to the same meaning-cluster: "chef", "cooked", "meal" — the food scene of the sentence, regardless of grammar.',
    links: [
      [6, 1, 0.7],
      [9, 6, 0.8],
      [9, 1, 0.6],
      [5, 3, 0.7],
    ],
  },
]

function wordX(i: number) {
  const widths = [32, 40, 38, 34, 30, 42, 52, 18, 52, 38]
  let x = 8
  for (let k = 0; k < i; k++) x += widths[k] + 8
  return { x, w: widths[i] }
}

function HeadExplorer() {
  const [active, setActive] = useState<number[]>([0, 1])

  const toggle = (i: number) =>
    setActive((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]))

  return (
    <WidgetShell
      title="Four heads, four readings of one sentence"
      hint="Toggle heads on and off — each finds a different pattern"
      accent={ACCENT}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {HEADS.map((h, i) => (
          <button
            key={h.name}
            onClick={() => toggle(i)}
            className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
            style={{
              borderColor: active.includes(i) ? h.color : 'var(--color-ink-700)',
              color: active.includes(i) ? h.color : 'var(--color-ink-500)',
              background: active.includes(i) ? `${h.color}16` : 'transparent',
            }}
          >
            {active.includes(i) ? '● ' : '○ '}
            {h.name}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 440 170" className="w-full rounded-lg bg-ink-950/70">
        {HEADS.map((h, hi) =>
          active.includes(hi)
            ? h.links.map(([from, to, s], li) => {
                const a = wordX(from)
                const b = wordX(to)
                const x1 = a.x + a.w / 2
                const x2 = b.x + b.w / 2
                const mid = (x1 + x2) / 2
                const lift = Math.min(75, Math.abs(x2 - x1) * 0.3 + 14) + hi * 6
                return (
                  <motion.path
                    key={`${hi}-${li}`}
                    d={`M ${x1} 108 Q ${mid} ${108 - lift} ${x2} 108`}
                    fill="none"
                    stroke={h.color}
                    strokeWidth={0.8 + s * 2.6}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.55 + s * 0.3 }}
                    exit={{ opacity: 0 }}
                  />
                )
              })
            : null,
        )}

        {WORDS.map((word, i) => {
          const { x, w } = wordX(i)
          return (
            <g key={i}>
              <rect x={x} y={108} width={w} height={24} rx={6} fill="#1c1c30" stroke="#3d3d5c" />
              <text x={x + w / 2} y={124} textAnchor="middle" fontSize={10.5} fill="#c9c9de">
                {word}
              </text>
            </g>
          )
        })}
        <text x={220} y={158} textAnchor="middle" fontSize={9.5} fill="#7b7b9e">
          each color = one attention head reading the same sentence its own way
        </text>
      </svg>

      <div className="mt-3 space-y-2">
        {HEADS.map((h, i) =>
          active.includes(i) ? (
            <motion.p
              key={h.name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg px-3 py-2 text-xs leading-relaxed"
              style={{ background: `${h.color}10`, color: 'var(--color-ink-300)' }}
            >
              <span className="font-semibold" style={{ color: h.color }}>
                {h.name}:
              </span>{' '}
              {h.desc}
            </motion.p>
          ) : null,
        )}
      </div>
    </WidgetShell>
  )
}

export default function MultiHeadAttention() {
  return (
    <article>
      <Section title="One spotlight isn't enough">
        <P>
          A single round of self-attention produces <em>one</em> pattern of looking — one set of
          Q/K/V matrices, one notion of relevance. But language needs many notions{' '}
          <em>simultaneously</em>: while reading "cooked", you need its subject (grammar), its
          semantic field (cooking things), and its position in the phrase — different questions,
          different words to consult.
        </P>
        <P>
          The transformer's answer: run many attention operations <Term>in parallel</Term>, each
          with its own learned Q/K/V matrices. Each parallel unit is a <Term>head</Term>. GPT-3
          uses 96 heads per layer; each is free to specialize:
        </P>
        <HeadExplorer />
        <KeyIdea>
          Multi-head attention = <Term>many learned perspectives at once</Term>. Each head gets
          a slice of the embedding to work with, computes its own attention pattern, and the
          results are concatenated and re-mixed. Nobody assigns the specialties — heads
          differentiate during training simply because covering <em>different</em> relationships
          reduces loss more than covering the same one twice.
        </KeyIdea>
      </Section>

      <Section title="A committee of specialist readers">
        <Analogy>
          Give the same contract to a lawyer, an accountant, an engineer and a poet. Each
          highlights completely different passages — obligations, numbers, specs, ambiguities.
          Stapling their four annotated copies together gives you a far richer understanding
          than any single reader, however brilliant. Multi-head attention staples 96 specialist
          readings of every sentence, at every layer.
        </Analogy>
        <List
          items={[
            <>
              <Term>What real heads do:</Term> interpretability work on GPT-2 found
              previous-token heads, heads tracking syntactic dependencies, "induction heads"
              that find-and-continue repeated patterns (a mechanism behind in-context learning),
              and many with no human-legible story at all.
            </>,
            <>
              <Term>Redundancy is real:</Term> studies show you can prune many heads from a
              trained model with little damage — several heads often learn overlapping jobs, and
              the network routes around amputations.
            </>,
            <>
              <Term>The dimensions math:</Term> heads don't multiply cost. A 4,096-dim embedding
              with 32 heads gives each head a 128-dim slice; total compute ≈ one full-width
              attention, but with 32 independent patterns instead of 1.
            </>,
          ]}
        />
        <WhyItMatters>
          Heads are the unit of transformer anatomy: papers, model cards and interpretability
          research all speak in "layer 12, head 7" coordinates. When you later meet{' '}
          <Term>KV caches</Term> (Module 8) or <Term>grouped-query attention</Term> (an
          efficiency trick where heads share keys/values to shrink memory), the mental picture
          of parallel specialist heads is what makes those optimizations legible.
        </WhyItMatters>
        <Misconception>
          "Each head has a clean, nameable job." Some do (the demo above shows real,
          documented types), but most heads in large models resist tidy labels — they encode
          fragments of many patterns at once, and their role shifts with context. The committee
          metaphor is a good map, not the territory: expect specialists, generalists, and
          plenty of members whose contribution no one can articulate yet.
        </Misconception>
        <DeepDive title="Deep dive: induction heads">
          <P>
            The most famous documented head type. An <Term>induction head</Term> implements:
            "find the last time the current token appeared, look at what followed it then, and
            predict that again". Given "…Mr. Dursley… Mr. D", it completes "ursley" — copying a
            pattern seen earlier <em>in the prompt</em>, not in training. This simple mechanism
            appears suddenly early in training (visible as a bump in the loss curve!) and is a
            leading explanation for why LLMs can learn from examples inside your prompt —{' '}
            few-shot prompting (Module 9) may literally run on these heads.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Why use 96 attention heads instead of one big one?',
            options: [
              'More heads means more parameters to sell',
              'Different heads can track different relationships (grammar, reference, semantics) simultaneously',
              'One head would be too slow',
              'It\u2019s a historical accident',
            ],
            answer: 1,
            explanation:
              'One attention operation = one relevance pattern. Language weaves many relationship types through the same words at once — parallel specialized heads capture them all in a single layer.',
          },
          {
            question: 'How do heads get their specialties?',
            options: [
              'Engineers assign each head a role',
              'They differentiate during training because covering distinct patterns lowers the loss more than duplicating',
              'They are copied from a library of standard heads',
              'Randomly at inference time',
            ],
            answer: 1,
            explanation:
              'All heads start random. Division of labor emerges from optimization pressure — the same story as every other structure in deep learning.',
          },
          {
            question: 'What does an induction head do?',
            options: [
              'Predicts electrical currents',
              'Finds an earlier occurrence of the current pattern in the prompt and predicts its continuation',
              'Deletes repeated words',
              'Translates between languages',
            ],
            answer: 1,
            explanation:
              '"A B … A → predict B". A copy-forward mechanism discovered inside real models — and a prime suspect behind LLMs\u2019 ability to learn from examples in the prompt.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Multi-head = many parallel attention operations, each with its own learned Q/K/V — many perspectives per layer.</>,
          <>Specialization (syntax heads, reference heads, induction heads) emerges from training, never by assignment.</>,
          <>Heads split the embedding into slices, so 32 heads cost about the same as 1 full-width one.</>,
          <>"Layer L, head H" is the coordinate system of transformer anatomy — you'll meet it again in efficiency tricks and interpretability.</>,
        ]}
      />
    </article>
  )
}
