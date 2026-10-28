import { useMemo, useState } from 'react'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell, LabeledSlider } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#38bdf8'

/* Toy dataset: house size (100s of sq ft) vs price, roughly price = 0.9*size + 60 with noise */
const data = [
  { x: 5, y: 66 },
  { x: 8, y: 66 },
  { x: 11, y: 71 },
  { x: 14, y: 70 },
  { x: 17, y: 77 },
  { x: 20, y: 76 },
  { x: 23, y: 83 },
  { x: 26, y: 82 },
  { x: 29, y: 88 },
  { x: 32, y: 90 },
  { x: 35, y: 92 },
  { x: 38, y: 97 },
]

// Plot mapping: x in [0,43] -> px [45, 325]; y in [50, 110] -> px [235, 20]
const px = (x: number) => 45 + (x / 43) * 280
const py = (y: number) => 235 - ((y - 50) / 60) * 215

function BeTheModel() {
  const [w, setW] = useState(2.4) // slope knob
  const [b, setB] = useState(52) // intercept knob

  const loss = useMemo(() => {
    const se = data.reduce((sum, p) => {
      const pred = w * p.x + b
      return sum + (pred - p.y) ** 2
    }, 0)
    return se / data.length
  }, [w, b])

  const quality =
    loss < 6 ? { label: 'Excellent fit! You just did what training does.', color: '#34d399' }
    : loss < 25 ? { label: 'Getting close — keep nudging.', color: '#fbbf24' }
    : { label: 'The line is far from the data. Adjust the knobs.', color: '#f87171' }

  return (
    <WidgetShell
      title="Be the learning algorithm"
      hint="Turn the two knobs until the line fits the dots — watch the error fall"
      accent={ACCENT}
    >
      <svg viewBox="0 0 350 260" className="w-full rounded-lg bg-ink-950/70">
        {/* axes */}
        <line x1={45} y1={235} x2={330} y2={235} stroke="#3d3d5c" />
        <line x1={45} y1={235} x2={45} y2={15} stroke="#3d3d5c" />
        <text x={190} y={254} textAnchor="middle" fontSize={10} fill="#7b7b9e">
          house size →
        </text>
        <text x={16} y={125} fontSize={10} fill="#7b7b9e" transform="rotate(-90 16 125)" textAnchor="middle">
          price →
        </text>

        {/* error lines from each point to prediction */}
        {data.map((p, i) => {
          const yHat = w * p.x + b
          return (
            <line
              key={`e${i}`}
              x1={px(p.x)}
              y1={py(p.y)}
              x2={px(p.x)}
              y2={py(Math.max(45, Math.min(115, yHat)))}
              stroke="#f87171"
              strokeWidth={1.5}
              opacity={0.55}
              strokeDasharray="3 3"
            />
          )
        })}

        {/* the model's line */}
        <line
          x1={px(0)}
          y1={py(Math.max(40, Math.min(120, b)))}
          x2={px(43)}
          y2={py(Math.max(40, Math.min(120, w * 43 + b)))}
          stroke={ACCENT}
          strokeWidth={2.5}
        />

        {/* data points */}
        {data.map((p, i) => (
          <circle key={i} cx={px(p.x)} cy={py(p.y)} r={4.5} fill="#e8e8f4" />
        ))}
      </svg>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <LabeledSlider
          label="Knob 1 — slope (price per size)"
          value={w}
          min={0}
          max={3}
          step={0.05}
          onChange={setW}
          display={w.toFixed(2)}
          accent={ACCENT}
        />
        <LabeledSlider
          label="Knob 2 — base price"
          value={b}
          min={40}
          max={90}
          step={0.5}
          onChange={setB}
          display={b.toFixed(1)}
          accent={ACCENT}
        />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-ink-850 px-4 py-3">
        <span className="text-sm text-ink-300">
          Total error (loss):{' '}
          <span className="font-mono font-semibold text-ink-100">{loss.toFixed(1)}</span>
        </span>
        <span className="text-sm font-semibold" style={{ color: quality.color }}>
          {quality.label}
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        The red dashed lines are the model's mistakes on each example. You just experienced the
        entire essence of machine learning: <em>adjust knobs (weights) to shrink the total
        mistake (loss)</em>. A real model does exactly this — with billions of knobs, adjusted
        automatically.
      </p>
    </WidgetShell>
  )
}

export default function DataAndPatterns() {
  return (
    <article>
      <Section title="Learning = knob-turning">
        <P>
          Strip away the jargon and every machine learning system — from a spam filter to GPT-4 —
          is the same machine: a mathematical function with <Term>adjustable knobs</Term>, called{' '}
          <Term>weights</Term> (or parameters). Data goes in, a prediction comes out, and the
          quality of the prediction depends entirely on how the knobs are set.
        </P>
        <P>
          "Training" a model means nothing more mysterious than this: show it examples where you
          know the right answer, measure how wrong it is, and nudge the knobs so it is slightly
          less wrong. Repeat millions of times. Try it yourself — the widget below gives you a
          model with just two knobs:
        </P>
        <BeTheModel />
        <KeyIdea>
          A trained model is <Term>just its knob settings</Term>. GPT-4 is, quite literally, a
          list of hundreds of billions of numbers. When a company "releases model weights", they
          are shipping that list. All the knowledge — grammar, facts, coding style — is encoded
          in how those numbers are set.
        </KeyIdea>
      </Section>

      <Section title="Data is the teacher">
        <P>
          If weights are the student, <Term>data is the teacher</Term>. The model never sees
          rules; it only sees examples. This has a profound consequence: a model can only learn
          patterns that actually exist in its data, and it <em>will</em> learn them whether you
          want it to or not — including typos, biases and urban legends.
        </P>
        <Analogy>
          Training is like seasoning a stew by taste. You don't calculate the chemically perfect
          amount of salt — you taste (measure the error), adjust (nudge a knob), and taste again.
          The recipe you end up with is just the final settings: this much salt, that much pepper.
          Nobody could point to where "deliciousness" is stored — it is smeared across all the
          settings at once. Knowledge in a neural network is stored the same way.
        </Analogy>
        <List
          items={[
            <>
              <Term>Example:</Term> one input paired with the desired output ("this email" →
              "spam"). LLMs make their own examples from raw text: input = a passage, desired
              output = the next word.
            </>,
            <>
              <Term>Pattern:</Term> any regularity connecting inputs to outputs. Some are simple
              (bigger house → higher price), some staggeringly subtle (this Python code → that
              bug).
            </>,
            <>
              <Term>Weights:</Term> the knobs. Two in the widget above; ~175 billion in GPT-3.
              The count of knobs is the "parameters" number in every model announcement.
            </>,
          ]}
        />
        <WhyItMatters>
          "Garbage in, garbage out" is the most practical law in AI. When a model behaves badly —
          biased hiring scores, confidently wrong medical advice — the first place to look is the
          data it learned from, not the code. This is also why data quality and curation, not
          algorithms, are where frontier labs now spend enormous effort (Module 7).
        </WhyItMatters>
        <Misconception>
          "The model stores its training data and looks things up." No — after training, the data
          is gone. Only the knob settings remain. The model is more like a person who read a
          million books and kept only the intuitions: usually right about what books say, but
          reconstructing from memory, never quoting from storage. (This is a seed of why models
          hallucinate — Module 8.)
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What exactly changes inside a model during training?',
            options: [
              'Its source code is rewritten',
              'The values of its weights (the knobs)',
              'Its database of stored answers grows',
              'Its hardware gets faster',
            ],
            answer: 1,
            explanation:
              'The architecture and code stay fixed. Training only adjusts the numbers — the weights. A trained model is the same machine with better knob settings.',
          },
          {
            question: 'A model trained on 1990s news articles is asked about smartphones. Why will it struggle?',
            options: [
              'It has too few weights',
              'Smartphone patterns were never in its training data, so no knob setting encodes them',
              'Its knobs rusted over time',
              'It refuses to answer about new topics',
            ],
            answer: 1,
            explanation:
              'Models can only extract patterns present in their data. No examples of smartphones means no knowledge of smartphones — regardless of how big or well-trained the model is.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Every ML model = a function with adjustable knobs (<Term>weights</Term>). Training = tuning knobs to reduce error on examples.</>,
          <>A trained model is just numbers — knowledge is smeared across billions of weight values, not stored as facts.</>,
          <>The model learns whatever patterns are in the data — including the ones you wish it wouldn't.</>,
          <>You manually did what gradient descent automates — that's the next concept.</>,
        ]}
      />
    </article>
  )
}
