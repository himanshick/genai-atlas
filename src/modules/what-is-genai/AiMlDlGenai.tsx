import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#38bdf8'

const rings = [
  {
    id: 'ai',
    label: 'Artificial Intelligence',
    short: 'AI',
    color: '#38bdf8',
    r: 165,
    blurb:
      'The whole ambition: making machines do things that would need intelligence if a human did them. Includes everything below, plus old-school hand-written rules (like a chess engine with if-then logic, or a thermostat schedule).',
    examples: 'Chess engines, GPS route planning, spam rules, Siri',
  },
  {
    id: 'ml',
    label: 'Machine Learning',
    short: 'ML',
    color: '#818cf8',
    r: 125,
    blurb:
      'A way of achieving AI where nobody writes the rules. Instead, the machine finds patterns in examples. Show it 10,000 spam emails and 10,000 normal ones, and it works out what spam looks like by itself.',
    examples: 'Spam filters, Netflix recommendations, fraud detection',
  },
  {
    id: 'dl',
    label: 'Deep Learning',
    short: 'DL',
    color: '#a78bfa',
    r: 85,
    blurb:
      'Machine learning done with deep neural networks — many stacked layers of simple math units. Depth lets the machine learn its own features: raw pixels in, "this is a cat" out, with no human telling it what an ear or whisker is.',
    examples: 'Face unlock, voice assistants, self-driving perception',
  },
  {
    id: 'genai',
    label: 'Generative AI',
    short: 'GenAI',
    color: '#f472b6',
    r: 45,
    blurb:
      'Deep learning models trained not just to recognize things, but to create new ones: text, images, music, video, code. ChatGPT, Midjourney and Sora all live here — deep learning aimed at generation instead of recognition.',
    examples: 'ChatGPT, Claude, Midjourney, Stable Diffusion, Sora',
  },
]

function NestedCircles() {
  const [active, setActive] = useState('genai')
  const activeRing = rings.find((r) => r.id === active)!

  return (
    <WidgetShell
      title="The four nested circles"
      hint="Click a ring (or a label) to explore each layer"
      accent={ACCENT}
    >
      <div className="grid items-center gap-6 md:grid-cols-2">
        <svg viewBox="0 0 360 360" className="mx-auto w-full max-w-[340px]">
          {rings.map((ring) => (
            <g key={ring.id} className="cursor-pointer" onClick={() => setActive(ring.id)}>
              <motion.circle
                cx={180}
                cy={190}
                r={ring.r}
                fill={active === ring.id ? `${ring.color}2e` : `${ring.color}10`}
                stroke={ring.color}
                strokeWidth={active === ring.id ? 3 : 1.5}
                animate={{
                  strokeOpacity: active === ring.id ? 1 : 0.45,
                  scale: active === ring.id ? 1.02 : 1,
                }}
                style={{ transformOrigin: '180px 190px' }}
              />
              <text
                x={180}
                y={190 - ring.r + (ring.id === 'genai' ? 4 : 16)}
                textAnchor="middle"
                fill={ring.color}
                fontSize={12}
                fontWeight={700}
                opacity={active === ring.id ? 1 : 0.65}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {ring.short}
              </text>
            </g>
          ))}
        </svg>

        <div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {rings.map((r) => (
              <button
                key={r.id}
                onClick={() => setActive(r.id)}
                className="rounded-full border px-3 py-1 text-xs font-semibold transition"
                style={{
                  borderColor: active === r.id ? r.color : 'var(--color-ink-700)',
                  color: active === r.id ? r.color : 'var(--color-ink-400)',
                  background: active === r.id ? `${r.color}18` : 'transparent',
                }}
              >
                {r.short}
              </button>
            ))}
          </div>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h4
              className="font-display text-lg font-bold"
              style={{ color: activeRing.color }}
            >
              {activeRing.label}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">{activeRing.blurb}</p>
            <p className="mt-3 text-xs text-ink-400">
              <span className="font-semibold text-ink-300">Examples: </span>
              {activeRing.examples}
            </p>
          </motion.div>
        </div>
      </div>
    </WidgetShell>
  )
}

export default function AiMlDlGenai() {
  return (
    <article>
      <Section title="Four words everyone mixes up">
        <P>
          News headlines use <Term>AI</Term>, <Term>machine learning</Term>,{' '}
          <Term>deep learning</Term> and <Term>generative AI</Term> as if they were the same
          thing. They are not — but they are related in the simplest possible way:{' '}
          <Term>each one lives inside the previous one</Term>, like Russian nesting dolls.
        </P>
        <NestedCircles />
        <KeyIdea>
          AI is the goal. Machine learning is a strategy for reaching it (learn from examples
          instead of hand-writing rules). Deep learning is the most powerful version of that
          strategy (stacked neural networks). Generative AI is deep learning pointed at a specific
          job: <em>creating</em> new content rather than just recognizing existing content.
        </KeyIdea>
      </Section>

      <Section title="Why the layers exist: who writes the rules?">
        <P>
          The cleanest way to feel the difference is to ask one question at every layer:{' '}
          <Term>who writes the rules?</Term>
        </P>
        <List
          items={[
            <>
              <Term>Classic AI (1950s–90s):</Term> humans write every rule. "If the email contains
              'FREE MONEY', mark it spam." Powerful for chess, hopeless for messy real-world things
              like recognizing a face — nobody can write down the rules for what a face looks like.
            </>,
            <>
              <Term>Machine learning:</Term> humans choose what to measure (word frequencies,
              pixel colors), the machine finds the rules from examples. Much better — but a human
              still had to decide which features matter.
            </>,
            <>
              <Term>Deep learning:</Term> the machine learns the features <em>and</em> the rules.
              Feed it raw pixels; early layers discover edges, middle layers discover shapes, late
              layers discover "cat face". No human ever defined an edge.
            </>,
            <>
              <Term>Generative AI:</Term> same deep networks, flipped ambition. Instead of
              answering "what is this?", they answer "what could plausibly come next?" — the next
              word, the next pixel, the next audio sample.
            </>,
          ]}
        />
        <Analogy>
          Think of teaching someone to cook. Classic AI is handing them a rigid recipe book —
          they can only make what's written down. Machine learning is letting them taste 1,000
          dishes and work out recipes themselves, but you still pick the ingredients. Deep
          learning is dropping them in a market where they figure out even <em>what counts as an
          ingredient</em>. Generative AI is when they stop reproducing dishes and start inventing
          new ones in the style of everything they've tasted.
        </Analogy>
      </Section>

      <Section title="Where GenAI sits — and why it exploded now">
        <P>
          Generative AI is not a new idea — researchers generated text and images decades ago.
          What changed around 2020 is that three curves crossed at once:{' '}
          <Term>compute</Term> got cheap enough (GPUs), <Term>data</Term> got big enough (the
          internet), and one <Term>architecture</Term> — the transformer, which you'll meet in
          Module 6 — turned out to scale almost without limit. Suddenly "predict the next word"
          trained on a trillion words produced something that can write poetry, code and legal
          summaries.
        </P>
        <WhyItMatters>
          Knowing which layer a claim lives in is a practical skill. "AI screens job applications"
          could mean a hand-written keyword filter (classic AI) or a deep network with learned
          bias — very different failure modes, very different fixes. Every module in this atlas
          builds on this map: Modules 2–3 explain the ML/DL layers, everything after lives in the
          GenAI circle.
        </WhyItMatters>
        <Misconception>
          "AI", "ML" and "GenAI" are not competing technologies, and newer does not replace older.
          Your bank's fraud detector is classic ML, your phone's face unlock is (non-generative)
          deep learning, and ChatGPT is generative deep learning. All three run in production
          today, side by side, each fitting its job.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'A spam filter learns from millions of labeled emails which ones are spam. It never generates anything. Which is the most precise label for it?',
            options: ['Generative AI', 'Machine learning', 'Just a database', 'Classic rule-based AI'],
            answer: 1,
            explanation:
              'It learns patterns from examples (so it is ML, not hand-written rules), but it only classifies — it never creates new content, so it is not generative.',
          },
          {
            question: 'What made deep learning "deep"?',
            options: [
              'It thinks more profoundly than humans',
              'Many stacked layers that learn features automatically',
              'It uses deeper databases',
              'It was invented later than other AI',
            ],
            answer: 1,
            explanation:
              '"Deep" refers literally to the number of stacked layers in the neural network. Depth is what lets the network learn its own features — edges, then shapes, then objects — instead of humans defining them.',
          },
          {
            question: 'Which statement is true?',
            options: [
              'All AI is generative AI',
              'GenAI replaced machine learning',
              'All generative AI is machine learning, but not all ML is generative',
              'Machine learning means writing rules by hand',
            ],
            answer: 2,
            explanation:
              'GenAI sits inside deep learning, which sits inside ML, which sits inside AI. The nesting only works one way: everything generative learns from data, but most systems that learn from data only recognize or predict — they do not generate.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>
            AI ⊃ ML ⊃ Deep Learning ⊃ GenAI — four nested circles, each a more specific way of
            doing the previous.
          </>,
          <>
            The layers differ by <Term>who writes the rules</Term>: humans (classic AI), machine
            finds rules from human-chosen features (ML), machine finds features and rules (DL).
          </>,
          <>
            GenAI is deep learning aimed at <Term>creating</Term> content instead of recognizing
            it.
          </>,
          <>
            It exploded around 2020 because compute, data and the transformer architecture all
            matured at once.
          </>,
        ]}
      />
    </article>
  )
}
