import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#38bdf8'

/* Fixed pseudo-random scatter of two classes (cats vs dogs in "feature space") */
function makePoints(seed: number, cx: number, cy: number, n: number) {
  const pts: { x: number; y: number }[] = []
  let s = seed
  const rand = () => {
    s = (s * 16807) % 2147483647
    return (s % 1000) / 1000
  }
  for (let i = 0; i < n; i++) {
    pts.push({ x: cx + (rand() - 0.5) * 95, y: cy + (rand() - 0.5) * 85 })
  }
  return pts
}

const cats = makePoints(42, 105, 95, 14)
const dogs = makePoints(1337, 235, 185, 14)

function ClassifyVsCreate() {
  const [mode, setMode] = useState<'discriminative' | 'generative'>('discriminative')
  const [generated, setGenerated] = useState<{ x: number; y: number; kind: 'cat' | 'dog' }[]>([])

  const sample = () => {
    const kind = Math.random() < 0.5 ? 'cat' : 'dog'
    const cloud = kind === 'cat' ? cats : dogs
    // Sample near the centroid of the class cloud with some noise
    const base = cloud[Math.floor(Math.random() * cloud.length)]
    setGenerated((g) => [
      ...g.slice(-11),
      {
        x: base.x + (Math.random() - 0.5) * 40,
        y: base.y + (Math.random() - 0.5) * 40,
        kind,
      },
    ])
  }

  const isGen = mode === 'generative'

  return (
    <WidgetShell
      title="Same data, two very different questions"
      hint="Toggle between the two model types"
      accent={ACCENT}
    >
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setMode('discriminative')}
          className="flex-1 rounded-lg border px-3 py-2.5 text-sm font-semibold transition"
          style={{
            borderColor: !isGen ? '#38bdf8' : 'var(--color-ink-700)',
            background: !isGen ? '#38bdf818' : 'transparent',
            color: !isGen ? '#38bdf8' : 'var(--color-ink-400)',
          }}
        >
          Discriminative: "which is it?"
        </button>
        <button
          onClick={() => setMode('generative')}
          className="flex-1 rounded-lg border px-3 py-2.5 text-sm font-semibold transition"
          style={{
            borderColor: isGen ? '#f472b6' : 'var(--color-ink-700)',
            background: isGen ? '#f472b618' : 'transparent',
            color: isGen ? '#f472b6' : 'var(--color-ink-400)',
          }}
        >
          Generative: "make a new one"
        </button>
      </div>

      <svg viewBox="0 0 340 265" className="w-full rounded-lg bg-ink-950/70">
        {/* Axes labels */}
        <text x={170} y={258} textAnchor="middle" fontSize={10} fill="#7b7b9e">
          ear pointiness →
        </text>
        <text x={12} y={135} fontSize={10} fill="#7b7b9e" transform="rotate(-90 12 135)" textAnchor="middle">
          snout length →
        </text>

        {/* Training points */}
        {cats.map((p, i) => (
          <circle key={`c${i}`} cx={p.x} cy={p.y} r={4.5} fill="#38bdf8" opacity={0.85} />
        ))}
        {dogs.map((p, i) => (
          <circle key={`d${i}`} cx={p.x} cy={p.y} r={4.5} fill="#fb923c" opacity={0.85} />
        ))}

        {/* Discriminative: decision boundary */}
        <AnimatePresence>
          {!isGen && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.line
                x1={40}
                y1={230}
                x2={300}
                y2={40}
                stroke="#e8e8f4"
                strokeWidth={2}
                strokeDasharray="7 5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
              />
              <text x={205} y={105} fontSize={11} fill="#e8e8f4" opacity={0.9}>
                decision boundary
              </text>
              <text x={62} y={62} fontSize={11} fill="#38bdf8" fontWeight={700}>
                🐱 cats
              </text>
              <text x={255} y={225} fontSize={11} fill="#fb923c" fontWeight={700}>
                🐶 dogs
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Generative: sampled new points */}
        <AnimatePresence>
          {isGen &&
            generated.map((g, i) => (
              <motion.g
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <circle
                  cx={g.x}
                  cy={g.y}
                  r={7}
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth={2}
                />
                <text x={g.x} y={g.y + 3.5} textAnchor="middle" fontSize={9}>
                  {g.kind === 'cat' ? '🐱' : '🐶'}
                </text>
              </motion.g>
            ))}
        </AnimatePresence>
      </svg>

      {isGen ? (
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={sample}
            className="rounded-lg bg-[#f472b6] px-4 py-2 text-sm font-bold text-ink-950 transition hover:brightness-110"
          >
            ✨ Generate a new animal
          </button>
          <p className="text-xs leading-relaxed text-ink-400">
            The model learned <em>where cats and dogs live</em> in this space, so it can sample
            brand-new plausible points from those regions.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-xs leading-relaxed text-ink-400">
          The model only learned the <em>line that separates</em> the two clouds. Give it any
          point and it answers "cat side or dog side" — but it has no idea how to produce a new
          cat. It never learned what cats look like, only what makes them different from dogs.
        </p>
      )}
    </WidgetShell>
  )
}

export default function DiscriminativeVsGenerative() {
  return (
    <article>
      <Section title="Two questions you can ask about data">
        <P>
          Every model in this atlas answers one of two fundamentally different questions. A{' '}
          <Term>discriminative</Term> model answers: <em>"given this thing, which category is
          it?"</em> A <Term>generative</Term> model answers: <em>"what does a plausible thing look
          like — can you make me a new one?"</em>
        </P>
        <P>
          Imagine we measured two features of pets — ear pointiness and snout length — and plotted
          every animal as a dot. Both model types train on the exact same dots, but they learn
          completely different things from them.
        </P>
        <ClassifyVsCreate />
        <KeyIdea>
          Discriminative models learn the <Term>boundary between</Term> categories. Generative
          models learn the <Term>shape of the data itself</Term> — the full distribution — which
          is why they can sample new examples from it. Learning the whole shape is much harder
          than learning a boundary, and that difficulty is exactly why generative AI arrived
          later.
        </KeyIdea>
      </Section>

      <Section title="Why generating is so much harder">
        <Analogy>
          A bouncer at a members-only club is discriminative: they glance at your card and decide
          member / not member. They can do the job perfectly without knowing anything else about
          you. A portrait painter is generative: to paint a convincing member of the club they
          must understand faces, clothing, lighting, posture — <em>everything</em> about what
          members look like. Checking is cheap; creating demands full understanding.
        </Analogy>
        <P>
          This is also why generative models feel so smart. To predict the next word of{' '}
          <em>"The capital of France is…"</em>, a model has to have absorbed geography. To
          continue a Python function, it has to have absorbed programming. Generation forces the
          model to internalize the structure of the world its data came from —{' '}
          <Term>compressing the internet into weights</Term>, as we'll see in Module 7.
        </P>
        <WhyItMatters>
          When you pick tools, this distinction is the first fork in the road. Need to route
          support tickets, detect fraud, or moderate content? A small discriminative model is
          cheaper, faster and more reliable. Need to draft, summarize, translate, or brainstorm?
          That is generation. A surprising number of real products use both: a generative model
          writes, a discriminative one filters what it wrote.
        </WhyItMatters>
        <Misconception>
          "Generative models are just better versions of discriminative ones." Not true — they
          trade accuracy for breadth. On a pure classification task, a focused discriminative
          model routinely beats a giant LLM while costing 1000x less. Generative models are not an
          upgrade; they solve a different problem.
        </Misconception>
      </Section>

      <Section title="Spotting the difference in the wild">
        <List
          items={[
            <>
              <Term>Discriminative:</Term> spam filter (spam / not spam), face unlock (you / not
              you), medical scan triage (tumor / clear), sentiment analysis (positive / negative).
            </>,
            <>
              <Term>Generative:</Term> ChatGPT writing an email, Midjourney painting a scene,
              GitHub Copilot completing code, Suno composing a song.
            </>,
            <>
              <Term>Both at once:</Term> ChatGPT's safety system — a generative model produces the
              answer, discriminative classifiers check it for policy violations before you see it.
            </>,
          ]}
        />
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'A model looks at X-ray images and outputs "pneumonia" or "healthy". Which type is it?',
            options: ['Generative', 'Discriminative', 'Both', 'Neither — that is not AI'],
            answer: 1,
            explanation:
              'It maps an input to a category — a classic discriminative task. It cannot produce a new X-ray image; it only draws a boundary between the two classes.',
          },
          {
            question: 'Why can a generative model create new examples while a discriminative one cannot?',
            options: [
              'It has more parameters',
              'It learned the full shape of the data distribution, not just the boundary between classes',
              'It runs on better GPUs',
              'It stores all training examples and replays them',
            ],
            answer: 1,
            explanation:
              'Sampling something new requires knowing where plausible data "lives". A boundary tells you how to separate classes but nothing about how to produce a member of one.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>
            Discriminative = <Term>tell things apart</Term> (learn the boundary). Generative ={' '}
            <Term>make new things</Term> (learn the whole distribution).
          </>,
          <>Creating requires far deeper understanding than checking — that's why GenAI came later and feels smarter.</>,
          <>Neither is "better": discriminative models still win on pure classification tasks, at a fraction of the cost.</>,
          <>Real systems often chain them: generate with one model, filter with another.</>,
        ]}
      />
    </article>
  )
}
