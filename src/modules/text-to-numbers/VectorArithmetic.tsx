import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

interface Analogy4 {
  label: string
  a: string
  b: string
  c: string
  d: string
  /** positions */
  pa: [number, number]
  pb: [number, number]
  pc: [number, number]
  pd: [number, number]
  axis1: string
  axis2: string
}

const ANALOGIES: Analogy4[] = [
  {
    label: 'king − man + woman ≈ queen',
    a: 'man', b: 'king', c: 'woman', d: 'queen',
    pa: [90, 200], pb: [250, 160], pc: [110, 90], pd: [270, 50],
    axis1: 'royalty →', axis2: '↑ femininity',
  },
  {
    label: 'Paris − France + Japan ≈ Tokyo',
    a: 'France', b: 'Paris', c: 'Japan', d: 'Tokyo',
    pa: [90, 190], pb: [240, 175], pc: [115, 75], pd: [265, 60],
    axis1: 'capital-ness →', axis2: '↑ country identity',
  },
  {
    label: 'walked − walk + swim ≈ swam',
    a: 'walk', b: 'walked', c: 'swim', d: 'swam',
    pa: [95, 185], pb: [245, 195], pc: [105, 80], pd: [255, 90],
    axis1: 'past tense →', axis2: '↑ different verb',
  },
]

function ArithmeticExplorer() {
  const [idx, setIdx] = useState(0)
  const [step, setStep] = useState(0) // 0: words, 1: show relation arrow, 2: transplant arrow, 3: reveal answer
  const an = ANALOGIES[idx]

  const arrow = { dx: an.pb[0] - an.pa[0], dy: an.pb[1] - an.pa[1] }

  const stepLabels = [
    'Four words, four points',
    `Draw the ${an.a} → ${an.b} arrow`,
    `Copy that arrow onto "${an.c}"`,
    'The arrow lands on the answer',
  ]

  return (
    <WidgetShell
      title="Do algebra with meaning"
      hint="Pick an analogy, then step through the arrow trick"
      accent={ACCENT}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {ANALOGIES.map((a, i) => (
          <button
            key={a.label}
            onClick={() => {
              setIdx(i)
              setStep(0)
            }}
            className="rounded-lg border px-3 py-1.5 font-mono text-xs transition"
            style={{
              borderColor: idx === i ? ACCENT : 'var(--color-ink-700)',
              color: idx === i ? ACCENT : 'var(--color-ink-400)',
              background: idx === i ? `${ACCENT}14` : 'transparent',
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 360 260" className="w-full rounded-lg bg-ink-950/70">
        <defs>
          <marker id="arrV" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9" fill="#34d399" />
          </marker>
          <marker id="arrV2" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9" fill="#fbbf24" />
          </marker>
        </defs>

        {/* axes hints */}
        <text x={350} y={250} textAnchor="end" fontSize={9.5} fill="#7b7b9e">{an.axis1}</text>
        <text x={14} y={130} fontSize={9.5} fill="#7b7b9e" transform="rotate(-90 14 130)" textAnchor="middle">{an.axis2}</text>

        {/* relation arrow a -> b */}
        {step >= 1 && (
          <motion.line
            key={`r${idx}`}
            x1={an.pa[0]}
            y1={an.pa[1]}
            x2={an.pb[0] - 8}
            y2={an.pb[1] + (an.pb[1] > an.pa[1] ? -3 : 3)}
            stroke="#34d399"
            strokeWidth={2.5}
            markerEnd="url(#arrV)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7 }}
          />
        )}

        {/* transplanted arrow from c */}
        {step >= 2 && (
          <motion.line
            key={`t${idx}`}
            x1={an.pc[0]}
            y1={an.pc[1]}
            x2={an.pc[0] + arrow.dx - 8}
            y2={an.pc[1] + arrow.dy}
            stroke="#fbbf24"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            markerEnd="url(#arrV2)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7 }}
          />
        )}

        {/* word points */}
        {(
          [
            [an.a, an.pa, '#38bdf8', true],
            [an.b, an.pb, '#38bdf8', true],
            [an.c, an.pc, '#f472b6', true],
            [an.d, an.pd, '#34d399', step >= 3],
          ] as [string, [number, number], string, boolean][]
        ).map(([w, p, color, visible]) =>
          visible ? (
            <motion.g key={w} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
              <circle cx={p[0]} cy={p[1]} r={6} fill={color} />
              <text x={p[0]} y={p[1] - 12} textAnchor="middle" fontSize={12.5} fontWeight={600} fill="#e8e8f4">
                {w}
              </text>
            </motion.g>
          ) : (
            <g key={w}>
              {step >= 2 && (
                <circle cx={p[0]} cy={p[1]} r={9} fill="none" stroke="#7b7b9e" strokeDasharray="3 3" />
              )}
            </g>
          ),
        )}
      </svg>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setStep((s) => Math.min(3, s + 1))}
          disabled={step === 3}
          className="rounded-lg px-4 py-2 text-sm font-bold text-ink-950 transition disabled:opacity-40"
          style={{ background: ACCENT }}
        >
          {step === 0 ? 'Start →' : step < 3 ? 'Next step →' : 'Done'}
        </button>
        <button
          onClick={() => setStep(0)}
          className="rounded-lg border border-ink-700 px-3 py-2 text-sm text-ink-300"
        >
          ↺
        </button>
        <span className="text-sm text-ink-300">{stepLabels[step]}</span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        The green arrow <em>is</em> a concept: "{an.a} → {an.b}" captures the relationship as a
        direction in space. Because the space is consistent, the same arrow transplanted onto "
        {an.c}" lands near "{an.d}". Subtraction extracts a relationship; addition applies it.
      </p>
    </WidgetShell>
  )
}

export default function VectorArithmetic() {
  return (
    <article>
      <Section title="king − man + woman ≈ queen">
        <P>
          In 2013, researchers computed something strange with word vectors: take the vector for{' '}
          <Term>king</Term>, subtract <Term>man</Term>, add <Term>woman</Term> — and search for
          the closest word to the resulting point. The answer came back: <Term>queen</Term>. No
          one had programmed this. The training process, purely from co-occurrence statistics,
          had arranged the space so that <em>relationships between words became consistent
          directions</em>.
        </P>
        <ArithmeticExplorer />
        <KeyIdea>
          In a good embedding space, <Term>relationships are directions</Term>. There is a
          "royalty direction", a "past-tense direction", a "capital-city direction" — and they
          work from anywhere in the space. Subtracting two vectors isolates the relationship
          between them; adding it elsewhere applies that relationship to a new word.
        </KeyIdea>
      </Section>

      <Section title="Why this matters more than the party trick">
        <Analogy>
          Think of real geography: the journey "Spain → Madrid" and "France → Paris" are
          different arrows on a map, and they don't align. But in embedding space, "country →
          its capital" IS one consistent arrow. Meaning-space is more orderly than physical space
          — it's laid out so that <em>every</em> instance of the same relationship points the
          same way. That regularity is what the model exploits when it reasons.
        </Analogy>
        <P>
          The analogy game is a window into something deep: the network compresses knowledge by
          learning <Term>shared structure</Term>. Rather than memorizing "France→Paris",
          "Japan→Tokyo", "Kenya→Nairobi" as separate facts, it learns one capital-city direction
          plus each country's position — dramatically fewer things to store, and it{' '}
          <em>generalizes</em>: the rule applies automatically to countries it rarely saw.
        </P>
        <WhyItMatters>
          Direction-as-meaning is now a practical engineering tool. Researchers find directions
          for sentiment, honesty, refusal, and even "sycophancy" inside LLMs — and can{' '}
          <Term>steer</Term> a model by nudging its internal vectors along them (this is how some
          jailbreak defenses and personality controls work). Interpretability research (Module
          17) is largely a hunt for meaningful directions in these spaces.
        </WhyItMatters>
        <Misconception>
          "The arithmetic is exact." It's approximate — king − man + woman lands <em>near</em>{' '}
          queen, not on it, and the trick fails for many word pairs (polysemy, rare words, and
          culturally loaded relationships break it). Famously, embeddings also absorb biases:
          doctor − man + woman landed near "nurse" in early models — the space faithfully
          mirrors the statistics of its training text, prejudices included (Module 17).
        </Misconception>
        <DeepDive title="Deep dive: why does training produce linear structure?">
          <P>
            Nobody fully knows — it's an active research area — but the leading intuition:
            the training objective rewards <em>compression</em>. Storing a relationship once as
            a direction and reusing it everywhere is cheaper (in weights and in loss) than
            memorizing every instance separately. Gradient descent, forever seeking cheaper
            solutions, discovers the shared structure. The result is called the{' '}
            <Term>linear representation hypothesis</Term>: high-level concepts inside neural
            networks tend to be encoded as linear directions — one of the luckiest empirical
            facts in AI, because linear structure is something we can find, measure and
            manipulate.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What does the vector "king − man" represent?',
            options: [
              'The letters k, i, n, g minus m, a, n',
              'The relationship between the two words — roughly a "royalty" direction',
              'A random noise vector',
              'The word "prince"',
            ],
            answer: 1,
            explanation:
              'Subtraction cancels what the words share (male, person) and leaves the difference: the direction that carries royal status. Adding it to "woman" applies royalty to her.',
          },
          {
            question: 'Why is it significant that "country → capital" is the SAME direction for every country?',
            options: [
              'It makes the vectors shorter',
              'It shows the model learned one reusable rule instead of memorizing separate facts — the essence of generalization',
              'It proves capitals are similar cities',
              'It is a coincidence',
            ],
            answer: 1,
            explanation:
              'Shared directions = shared structure = compression. One rule + per-country positions replaces thousands of memorized pairs, and automatically extends to unseen cases.',
          },
          {
            question: 'Early embeddings placed "doctor − man + woman" near "nurse". What does this reveal?',
            options: [
              'A math bug in the arithmetic',
              'Embeddings faithfully absorb statistical biases present in their training text',
              'Nurses and doctors are the same profession',
              'The model was too small',
            ],
            answer: 1,
            explanation:
              'The space mirrors co-occurrence statistics of real text, prejudices included. Bias in AI is usually inherited from data — a theme that returns in Module 17.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>In embedding space, <Term>relationships are consistent directions</Term>: subtract to extract one, add to apply it.</>,
          <>Linear structure emerges because reusing one direction is "cheaper" for the network than memorizing every fact.</>,
          <>The same idea powers modern interpretability and steering: find the direction for a concept, nudge the model along it.</>,
          <>The arithmetic is approximate and inherits the biases of the training text.</>,
        ]}
      />
    </article>
  )
}
