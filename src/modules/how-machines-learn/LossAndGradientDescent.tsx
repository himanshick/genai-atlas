import { useEffect, useMemo, useRef, useState } from 'react'
import { Section, P, Term, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell, LabeledSlider } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#38bdf8'

/* Loss landscape: two valleys, the left one deeper. */
const f = (x: number) => 0.1 * x ** 4 - x ** 2 + 0.2 * x + 3
const df = (x: number) => 0.4 * x ** 3 - 2 * x + 0.2

const X_MIN = -3.4
const X_MAX = 3.4
const Y_MIN = -0.4
const Y_MAX = 4.6

const px = (x: number) => 20 + ((x - X_MIN) / (X_MAX - X_MIN)) * 320
const py = (y: number) => 250 - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * 230

const curvePath = (() => {
  const pts: string[] = []
  for (let x = X_MIN; x <= X_MAX + 0.001; x += 0.05) {
    pts.push(`${px(x).toFixed(1)},${py(f(x)).toFixed(1)}`)
  }
  return `M ${pts.join(' L ')}`
})()

function GradientDescentPlayground() {
  const [x, setX] = useState(2.9)
  const [lr, setLr] = useState(0.12)
  const [running, setRunning] = useState(false)
  const [trail, setTrail] = useState<number[]>([])
  const [steps, setSteps] = useState(0)
  const xRef = useRef(x)
  xRef.current = x

  const step = () => {
    const grad = df(xRef.current)
    let next = xRef.current - lr * grad
    if (next < X_MIN) next = X_MIN
    if (next > X_MAX) next = X_MAX
    setTrail((t) => [...t.slice(-14), xRef.current])
    setX(next)
    setSteps((s) => s + 1)
  }

  useEffect(() => {
    if (!running) return
    const id = setInterval(step, 350)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, lr])

  const grad = df(x)
  const converged = Math.abs(grad) < 0.015
  const bouncing = lr > 0.9

  const reset = (start?: number) => {
    setRunning(false)
    setX(start ?? X_MIN + Math.random() * (X_MAX - X_MIN))
    setTrail([])
    setSteps(0)
  }

  // Tangent line segment at the ball
  const tangent = useMemo(() => {
    const dx = 0.55
    return {
      x1: px(x - dx),
      y1: py(f(x) - grad * dx),
      x2: px(x + dx),
      y2: py(f(x) + grad * dx),
    }
  }, [x, grad])

  return (
    <WidgetShell
      title="Roll the ball down the loss landscape"
      hint="Press play, then experiment with the learning rate"
      accent={ACCENT}
    >
      <svg viewBox="0 0 360 265" className="w-full rounded-lg bg-ink-950/70">
        {/* landscape */}
        <path d={curvePath} fill="none" stroke="#a78bfa" strokeWidth={2.5} opacity={0.9} />

        {/* labels for the two valleys */}
        <text x={px(-2.29)} y={py(f(-2.29)) + 18} textAnchor="middle" fontSize={10} fill="#34d399">
          global minimum
        </text>
        <text x={px(2.19)} y={py(f(2.19)) + 18} textAnchor="middle" fontSize={10} fill="#fbbf24">
          local minimum
        </text>

        {/* trail */}
        {trail.map((tx, i) => (
          <circle
            key={i}
            cx={px(tx)}
            cy={py(f(tx))}
            r={4}
            fill={ACCENT}
            opacity={((i + 1) / trail.length) * 0.4}
          />
        ))}

        {/* tangent (the gradient) */}
        <line
          x1={tangent.x1}
          y1={tangent.y1}
          x2={tangent.x2}
          y2={tangent.y2}
          stroke="#f87171"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />

        {/* ball */}
        <circle cx={px(x)} cy={py(f(x)) - 7} r={8} fill={ACCENT} stroke="#e8e8f4" strokeWidth={1.5} />

        {/* axis captions */}
        <text x={340} y={260} textAnchor="end" fontSize={10} fill="#7b7b9e">
          weight value →
        </text>
        <text x={14} y={100} fontSize={10} fill="#7b7b9e" transform="rotate(-90 14 100)" textAnchor="middle">
          loss (how wrong) →
        </text>
      </svg>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
        <LabeledSlider
          label="Learning rate (step size)"
          value={lr}
          min={0.01}
          max={1.1}
          step={0.01}
          onChange={setLr}
          display={lr.toFixed(2)}
          accent={ACCENT}
        />
        <div className="flex items-end gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded-lg bg-part1 px-4 py-2 text-sm font-bold text-ink-950 transition hover:brightness-110"
          >
            {running ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={step}
            className="rounded-lg border border-ink-700 px-3 py-2 text-sm text-ink-300 hover:border-ink-600"
          >
            Step
          </button>
          <button
            onClick={() => reset()}
            className="rounded-lg border border-ink-700 px-3 py-2 text-sm text-ink-300 hover:border-ink-600"
          >
            ↺ New start
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg bg-ink-850 px-4 py-3 font-mono text-xs text-ink-300">
        <span>
          steps: <span className="text-ink-100">{steps}</span>
        </span>
        <span>
          loss: <span className="text-ink-100">{f(x).toFixed(3)}</span>
        </span>
        <span>
          slope here: <span className="text-ink-100">{grad.toFixed(3)}</span>
        </span>
        {converged && <span className="font-sans font-semibold text-emerald-400">✓ settled in a valley</span>}
        {bouncing && !converged && (
          <span className="font-sans font-semibold text-red-400">⚠ learning rate too high — bouncing!</span>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Things to try: (1) a tiny learning rate like 0.02 — painfully slow. (2) around 1.0 — the
        ball overshoots and ricochets between walls. (3) Press "New start" a few times — notice
        the ball sometimes settles in the shallower right-hand valley. That's a{' '}
        <em>local minimum</em>: good, but not the best possible.
      </p>
    </WidgetShell>
  )
}

export default function LossAndGradientDescent() {
  return (
    <article>
      <Section title="One number to rule them all: loss">
        <P>
          In the previous concept you tuned two knobs by eye. Real models have billions of knobs
          — no human can eyeball that. So training needs two things: a single number that
          measures "how wrong is the model right now" — the <Term>loss</Term> — and an automatic
          rule for turning every knob so that number goes down.
        </P>
        <P>
          Picture the loss as a landscape. Every possible setting of the knobs is a location;
          the altitude at that location is how wrong the model is there. Training is a search
          for the lowest valley. The search algorithm — used by essentially every neural network
          ever trained — is called <Term>gradient descent</Term>, and it is beautifully dumb:
        </P>
        <GradientDescentPlayground />
        <KeyIdea>
          Gradient descent = <Term>feel the slope under your feet, take a small step downhill,
          repeat</Term>. The "gradient" is just the slope (the red dashed line above). The
          "learning rate" is your step size. That's the entire algorithm that trained GPT-4 —
          performed in a landscape with billions of dimensions instead of one.
        </KeyIdea>
      </Section>

      <Section title="The learning rate dilemma">
        <Analogy>
          You are dropped on a foggy mountainside at night and must reach the valley floor. You
          cannot see the valley — fog everywhere — but you can feel which way the ground tilts.
          Tiny steps: safe but you'll take weeks. Giant leaps: fast, but you might jump clean
          over the valley and land on the opposite slope, higher than before. Picking the step
          size — the learning rate — is <em>the</em> classic tuning problem of deep learning.
        </Analogy>
        <P>
          You saw both failure modes in the playground: too small and progress crawls, too large
          and the ball ricochets or even climbs. Real training uses{' '}
          <Term>learning-rate schedules</Term> — start with confident big steps, shrink them as
          you near the bottom — exactly like slowing down as you approach a parking spot.
        </P>
        <WhyItMatters>
          When you read that a training run "diverged" or "was unstable", this picture is what
          happened: the ball bounced out of the valley. When fine-tuning your own models (Module
          12), the learning rate is the first knob you'll ever be asked to set — and now you know
          exactly what it does.
        </WhyItMatters>
        <Misconception>
          "The model might get stuck in a bad local minimum, so training is a gamble." In the
          1-D landscape above, local minima are a real trap. But in billions of dimensions,
          genuinely bad traps are surprisingly rare — with so many directions available, there is
          almost always <em>some</em> way downhill. In practice, big networks trained from
          different random starts reach similarly good (different but equivalent) solutions.
        </Misconception>
        <DeepDive title="Deep dive: where does the slope come from?">
          <P>
            How does the model know the slope without trying every knob setting? Calculus. The
            loss is a formula built from the weights, and derivatives give the slope of a formula
            directly. The algorithm that computes the slope for <em>every one of billions of
            weights simultaneously</em> in one backward sweep is backpropagation — the star of
            Module 3. And because computing the loss over the full dataset is too slow, training
            actually estimates it on small random batches of examples: <Term>stochastic</Term>{' '}
            gradient descent — a slightly drunken walk downhill that, on average, heads the right
            way (and the noise even helps escape shallow traps).
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What does the loss measure?',
            options: [
              'How many examples the model has seen',
              'How wrong the model currently is, as a single number',
              'The model\u2019s speed',
              'The number of weights',
            ],
            answer: 1,
            explanation:
              'Loss condenses "how badly is the model doing right now" into one number, which gives gradient descent a target: make this number smaller.',
          },
          {
            question: 'Your training loss keeps jumping wildly up and down and never settles. Most likely cause?',
            options: [
              'The model is too small',
              'The learning rate is too high — the ball is overshooting the valley',
              'There is too much data',
              'The loss function is broken',
            ],
            answer: 1,
            explanation:
              'Wild oscillation is the signature of oversized steps: each update leaps past the minimum to the opposite slope. The fix is a smaller learning rate — exactly what you saw with the slider near 1.0.',
          },
          {
            question: 'Why is the algorithm called gradient "descent"?',
            options: [
              'It descends through the layers of the network',
              'It repeatedly steps in the downhill direction of the loss landscape',
              'It reduces the size of the model',
              'It was invented going down a mountain',
            ],
            answer: 1,
            explanation:
              'The gradient points uphill (direction of fastest increase of loss); stepping against it walks downhill toward lower loss. Repeat until you settle in a valley.',
          },
        ]}
      />

      <Takeaways
        items={[
          <><Term>Loss</Term> = one number scoring how wrong the model is. Training = making it smaller.</>,
          <><Term>Gradient descent</Term>: feel the slope, step downhill, repeat — for billions of knobs at once.</>,
          <>The <Term>learning rate</Term> (step size) is the crucial dial: too small = slow, too large = bouncing chaos.</>,
          <>Local minima look scary in 1-D but rarely matter in the billion-dimensional landscapes of real networks.</>,
        ]}
      />
    </article>
  )
}
