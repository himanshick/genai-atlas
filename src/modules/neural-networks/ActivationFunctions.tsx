import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell, LabeledSlider } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#38bdf8'

const fns = {
  relu: {
    name: 'ReLU',
    color: '#38bdf8',
    f: (x: number) => Math.max(0, x),
    story: 'The workhorse. Negative? Output zero (stay silent). Positive? Pass it through unchanged. Brutally simple, extremely fast, and what most modern networks use in some variant.',
  },
  sigmoid: {
    name: 'Sigmoid',
    color: '#f472b6',
    f: (x: number) => 1 / (1 + Math.exp(-x)),
    story: 'The classic squash: any input becomes a value between 0 and 1 — perfect for "probability-like" outputs. Fell out of favor inside deep networks because its flat ends kill gradients (see deep dive).',
  },
  tanh: {
    name: 'Tanh',
    color: '#fbbf24',
    f: (x: number) => Math.tanh(x),
    story: 'Sigmoid\u2019s centered sibling: squashes to between −1 and +1, letting neurons vote "no" (negative), not just "quietly" (zero). Common in older recurrent networks (Module 5).',
  },
  gelu: {
    name: 'GELU',
    color: '#34d399',
    f: (x: number) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))),
    story: 'A smooth, slightly curvy ReLU — negatives are dampened, not beheaded. This is the one inside GPT-style transformers. The smoothness helps optimization.',
  },
} as const

type FnKey = keyof typeof fns

const X0 = 190
const Y0 = 110
const SCALE = 38

function CurveExplorer() {
  const [fnKey, setFnKey] = useState<FnKey>('relu')
  const [input, setInput] = useState(1.4)
  const fn = fns[fnKey]
  const output = fn.f(input)

  const path = useMemo(() => {
    const pts: string[] = []
    for (let x = -4; x <= 4.001; x += 0.08) {
      const y = fn.f(x)
      pts.push(`${(X0 + x * SCALE).toFixed(1)},${(Y0 - y * SCALE).toFixed(1)}`)
    }
    return `M ${pts.join(' L ')}`
  }, [fnKey])

  return (
    <WidgetShell
      title="The activation zoo"
      hint="Pick a function, then slide the input along the curve"
      accent={ACCENT}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(fns) as FnKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setFnKey(k)}
            className="rounded-lg border px-4 py-1.5 text-sm font-semibold transition"
            style={{
              borderColor: fnKey === k ? fns[k].color : 'var(--color-ink-700)',
              color: fnKey === k ? fns[k].color : 'var(--color-ink-400)',
              background: fnKey === k ? `${fns[k].color}16` : 'transparent',
            }}
          >
            {fns[k].name}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 380 220" className="w-full rounded-lg bg-ink-950/70">
        {/* axes */}
        <line x1={20} y1={Y0} x2={360} y2={Y0} stroke="#2a2a44" />
        <line x1={X0} y1={12} x2={X0} y2={208} stroke="#2a2a44" />
        <text x={352} y={Y0 - 6} fontSize={9} fill="#7b7b9e">in</text>
        <text x={X0 + 6} y={20} fontSize={9} fill="#7b7b9e">out</text>

        {/* unit gridlines */}
        {[-3, -2, -1, 1, 2, 3].map((v) => (
          <g key={v}>
            <line x1={X0 + v * SCALE} y1={Y0 - 3} x2={X0 + v * SCALE} y2={Y0 + 3} stroke="#3d3d5c" />
            <line x1={X0 - 3} y1={Y0 - v * SCALE} x2={X0 + 3} y2={Y0 - v * SCALE} stroke="#3d3d5c" />
          </g>
        ))}

        <motion.path
          key={fnKey}
          d={path}
          fill="none"
          stroke={fn.color}
          strokeWidth={2.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* input marker */}
        <line
          x1={X0 + input * SCALE}
          y1={Y0}
          x2={X0 + input * SCALE}
          y2={Y0 - output * SCALE}
          stroke="#e8e8f4"
          strokeDasharray="3 3"
          strokeWidth={1}
        />
        <circle cx={X0 + input * SCALE} cy={Y0 - output * SCALE} r={6.5} fill={fn.color} stroke="#e8e8f4" strokeWidth={1.5} />
      </svg>

      <div className="mt-4">
        <LabeledSlider
          label="Neuron's raw sum (input to activation)"
          value={input}
          min={-4}
          max={4}
          step={0.05}
          onChange={setInput}
          display={input.toFixed(2)}
          accent={fn.color}
        />
      </div>
      <div className="mt-3 rounded-lg bg-ink-850 px-4 py-3">
        <div className="font-mono text-sm text-ink-100">
          {fn.name}({input.toFixed(2)}) = <span style={{ color: fn.color }}>{output.toFixed(3)}</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-400">{fn.story}</p>
      </div>
    </WidgetShell>
  )
}

export default function ActivationFunctions() {
  return (
    <article>
      <Section title="The bend that makes networks smart">
        <P>
          Here is a fact that surprises everyone: if you stack a thousand layers of pure
          weighted-sum neurons, the whole tower collapses mathematically into… a single layer.
          Sums of sums are just sums. A network of any depth built only from linear votes can
          only ever learn straight-line patterns — no curves, no "if this then that", no faces,
          no language.
        </P>
        <P>
          The fix costs one line of code: after each neuron adds up its votes, pass the total
          through a simple <Term>non-linear</Term> function — a bend. That bend is the{' '}
          <Term>activation function</Term>, and it is the single ingredient that separates deep
          learning from glorified linear regression.
        </P>
        <CurveExplorer />
        <KeyIdea>
          Linearity means "output changes proportionally to input, always". Reality is not like
          that — a bit more rain matters a lot near the flooding point and not at all in a
          drought. The activation's bend lets each neuron respond <em>differently in different
          regimes</em>, and stacking thousands of small bends lets the network sculpt arbitrarily
          complicated shapes. Depth only pays off because of the bends.
        </KeyIdea>
      </Section>

      <Section title="Why ReLU won">
        <Analogy>
          Think of activations as attitude filters for each voter in the neuron parliament.
          Sigmoid is a diplomat: every opinion is softened into a polite 0-to-1 murmur. Tanh
          allows outright disagreement (−1). ReLU is a bouncer: negative opinions are silenced
          completely, positive ones pass untouched. Surprisingly, the blunt bouncer built the
          modern era — because when you employ billions of voters, you need the filter to be{' '}
          <em>fast</em>, and silence turns out to be a feature: at any moment most ReLU neurons
          output exactly zero, giving each input its own sparse "active committee".
        </Analogy>
        <WhyItMatters>
          Activations show up whenever you look inside any model: GPT uses GELU-family
          activations, vision networks use ReLU variants, and the output layer's{' '}
          <Term>softmax</Term> (Module 8) is how an LLM turns raw scores into next-word
          probabilities. When training goes wrong — "dying ReLU", "vanishing gradients" — the
          diagnosis is usually about activations, so this vocabulary is your debugging kit.
        </WhyItMatters>
        <Misconception>
          "The specific activation function is a big deal for intelligence." Mostly no — ReLU vs
          GELU changes efficiency and trainability by percentage points, not capability by leaps.
          The profound part is that there is a bend <em>at all</em>. Any reasonable non-linearity
          + enough neurons = a universal shape-maker (the "universal approximation" result).
          Engineers argue about which bend trains fastest, not which one enables thinking.
        </Misconception>
        <DeepDive title="Deep dive: vanishing gradients and dying neurons">
          <P>
            Look at sigmoid's ends: flat. On flat ground the slope is ~0, and remember from
            gradient descent — no slope, no learning signal. In deep networks, sigmoid's tiny
            slopes get <em>multiplied</em> layer after layer during backpropagation (next
            concept), shrinking exponentially until early layers receive nothing: the{' '}
            <Term>vanishing gradient problem</Term>, which paralyzed deep networks for decades.
            ReLU's positive side has slope exactly 1 — signals pass through undiminished — which
            is a key reason 100+ layer networks became trainable. Its own failure mode: a neuron
            stuck outputting zero never gets a gradient and can die permanently; gentle variants
            like Leaky ReLU and GELU keep a whisper of slope alive on the negative side.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Why can\u2019t a deep network built without activation functions learn complex patterns?',
            options: [
              'It would be too slow',
              'Stacked linear layers collapse into one linear layer — only straight-line patterns are possible',
              'The weights would overflow',
              'It could, but it would overfit',
            ],
            answer: 1,
            explanation:
              'A weighted sum of weighted sums is still a weighted sum. Without a non-linear bend between layers, 1000 layers have exactly the expressive power of 1.',
          },
          {
            question: 'What does ReLU(-2.7) equal?',
            options: ['-2.7', '2.7', '0', '0.5'],
            answer: 2,
            explanation:
              'ReLU outputs zero for all negative inputs and passes positive inputs through unchanged: max(0, x). Negative in, silence out.',
          },
          {
            question: 'The "vanishing gradient problem" happens because…',
            options: [
              'Computers run out of memory',
              'Flat regions of squashing activations have near-zero slope, and tiny slopes multiply toward zero across many layers',
              'The learning rate is too high',
              'The data has too much noise',
            ],
            answer: 1,
            explanation:
              'Backpropagation multiplies slopes layer by layer. If each sigmoid contributes a slope like 0.1, twenty layers give 0.1²⁰ — effectively zero signal reaching early layers, which then never learn.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Without a non-linear bend, any deep network collapses to a single linear layer — activations are what make depth meaningful.</>,
          <>ReLU (zero out negatives) won on speed and healthy gradients; GELU is its smooth cousin inside modern transformers.</>,
          <>Flat activation regions kill learning signals — the vanishing-gradient story behind decades of stuck research.</>,
          <>Which bend you choose is an efficiency detail; that there is a bend is the foundation.</>,
        ]}
      />
    </article>
  )
}
