import { useMemo, useState } from 'react'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell, LabeledSlider } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#38bdf8'

/* True underlying pattern + noise */
const truth = (x: number) => 0.5 + 0.32 * Math.sin(x * Math.PI * 1.9)

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s % 10000) / 10000
  }
}

const makeSet = (seed: number, n: number) => {
  const rand = seeded(seed)
  return Array.from({ length: n }, (_, i) => {
    const x = (i + 0.5) / n + (rand() - 0.5) * 0.04
    return { x, y: truth(x) + (rand() - 0.5) * 0.22 }
  })
}

const trainPts = makeSet(1234, 10)
const testPts = makeSet(98765, 6)

/* Least-squares polynomial fit via normal equations + Gaussian elimination */
function polyfit(pts: { x: number; y: number }[], degree: number): number[] {
  const n = degree + 1
  const A: number[][] = Array.from({ length: n }, () => Array(n + 1).fill(0))
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      A[r][c] = pts.reduce((s, p) => s + p.x ** (r + c), 0)
    }
    A[r][n] = pts.reduce((s, p) => s + p.y * p.x ** r, 0)
  }
  // elimination with partial pivoting
  for (let col = 0; col < n; col++) {
    let piv = col
    for (let r = col + 1; r < n; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r
    ;[A[col], A[piv]] = [A[piv], A[col]]
    if (Math.abs(A[col][col]) < 1e-12) continue
    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const factor = A[r][col] / A[col][col]
      for (let c = col; c <= n; c++) A[r][c] -= factor * A[col][c]
    }
  }
  return A.map((row, i) => (Math.abs(row[i]) < 1e-12 ? 0 : row[n] / row[i]))
}

const evalPoly = (coef: number[], x: number) => coef.reduce((s, c, i) => s + c * x ** i, 0)

const PX = (x: number) => 30 + x * 300
const PY = (y: number) => 225 - ((y + 0.15) / 1.35) * 205

function ComplexityPlayground() {
  const [degree, setDegree] = useState(1)
  const [showTest, setShowTest] = useState(false)

  const { path, trainErr, testErr } = useMemo(() => {
    const coef = polyfit(trainPts, degree)
    const pts: string[] = []
    for (let x = 0; x <= 1.0001; x += 0.01) {
      const y = Math.max(-0.3, Math.min(1.5, evalPoly(coef, x)))
      pts.push(`${PX(x).toFixed(1)},${PY(y).toFixed(1)}`)
    }
    const mse = (set: { x: number; y: number }[]) =>
      set.reduce((s, p) => s + (evalPoly(coef, p.x) - p.y) ** 2, 0) / set.length
    return { path: `M ${pts.join(' L ')}`, trainErr: mse(trainPts), testErr: mse(testPts) }
  }, [degree])

  const verdict =
    degree <= 2
      ? { label: 'Underfitting: too simple to capture the wave', color: '#fbbf24' }
      : degree <= 5
        ? { label: 'Sweet spot: captures the pattern, ignores the noise', color: '#34d399' }
        : { label: 'Overfitting: chasing every noisy point', color: '#f87171' }

  return (
    <WidgetShell
      title="The model complexity dial"
      hint="Raise the flexibility, then reveal the exam data"
      accent={ACCENT}
    >
      <svg viewBox="0 0 360 240" className="w-full rounded-lg bg-ink-950/70">
        {/* the model's curve */}
        <path d={path} fill="none" stroke={verdict.color} strokeWidth={2.5} />

        {/* training points */}
        {trainPts.map((p, i) => (
          <circle key={i} cx={PX(p.x)} cy={PY(p.y)} r={4.5} fill="#e8e8f4" />
        ))}

        {/* test points */}
        {showTest &&
          testPts.map((p, i) => (
            <g key={`t${i}`}>
              <circle cx={PX(p.x)} cy={PY(p.y)} r={5} fill="none" stroke="#fb923c" strokeWidth={2} />
            </g>
          ))}

        <text x={40} y={20} fontSize={10} fill="#a3a3c2">
          ● training data {showTest && '   ○ unseen exam data'}
        </text>
      </svg>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
        <LabeledSlider
          label="Model flexibility (polynomial degree)"
          value={degree}
          min={1}
          max={9}
          step={1}
          onChange={setDegree}
          display={`${degree}`}
          accent={ACCENT}
        />
        <div className="flex items-end">
          <button
            onClick={() => setShowTest((v) => !v)}
            className="rounded-lg border px-4 py-2 text-sm font-semibold transition"
            style={{
              borderColor: showTest ? '#fb923c' : 'var(--color-ink-700)',
              color: showTest ? '#fb923c' : 'var(--color-ink-300)',
              background: showTest ? '#fb923c14' : 'transparent',
            }}
          >
            {showTest ? 'Hide exam data' : '📝 Reveal exam data'}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg bg-ink-850 px-4 py-3 text-xs">
        <span className="font-mono text-ink-300">
          error on training data: <span className="text-ink-100">{trainErr.toFixed(3)}</span>
        </span>
        {showTest && (
          <span className="font-mono text-ink-300">
            error on exam data:{' '}
            <span style={{ color: testErr > 0.04 ? '#f87171' : '#34d399' }}>{testErr.toFixed(3)}</span>
          </span>
        )}
        <span className="ml-auto font-semibold" style={{ color: verdict.color }}>
          {verdict.label}
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Try this: slide to degree 9 — training error falls to nearly zero as the curve contorts
        through every dot. Now reveal the exam data: the error on points the model never saw{' '}
        <em>explodes</em>. Perfect on homework, terrible on the exam — that is overfitting in one
        picture.
      </p>
    </WidgetShell>
  )
}

export default function OverfittingUnderfitting() {
  return (
    <article>
      <Section title="Memorizing vs understanding">
        <P>
          There are two ways to pass a test. Understand the subject — or memorize every answer in
          the practice book. Both give perfect practice scores. Only one survives contact with
          new questions. Models face exactly the same fork, and it is the central tension in all
          of machine learning: we want models to learn the <Term>pattern</Term>, but they are
          equally happy to memorize the <Term>noise</Term>.
        </P>
        <ComplexityPlayground />
        <KeyIdea>
          <Term>Underfitting</Term>: the model is too simple to capture the real pattern — bad on
          training data <em>and</em> new data. <Term>Overfitting</Term>: the model is so flexible
          it memorizes the accidents of its training set — perfect on training data,{' '}
          <em>worse</em> on new data. Learning lives in the gap between the two, and the only
          honest measuring stick is <Term>data the model has never seen</Term>.
        </KeyIdea>
      </Section>

      <Section title="How real models stay honest">
        <Analogy>
          A tailor with one client can cut a suit that fits that person flawlessly — and fits
          nobody else on Earth. A tailor who studies a thousand bodies learns proportions that
          fit most people well. Overfitting is tailoring to one body; generalization is learning
          the proportions. More (varied) clients is the surest cure.
        </Analogy>
        <P>Practitioners fight overfitting with a standard toolkit:</P>
        <List
          items={[
            <>
              <Term>Held-out validation data:</Term> lock some data in a drawer before training,
              and grade only on that. Every serious ML project does this — it is the "exam data"
              button above.
            </>,
            <>
              <Term>More data:</Term> the more examples, the harder noise is to memorize and the
              more the true pattern dominates. This is a key reason LLMs train on trillions of
              words.
            </>,
            <>
              <Term>Early stopping:</Term> watch performance on held-out data during training and
              stop when it starts getting worse — the moment memorization begins.
            </>,
            <>
              <Term>Regularization & dropout:</Term> penalties and deliberate handicaps (like
              randomly silencing neurons) that make pure memorization expensive for the model.
            </>,
          ]}
        />
        <WhyItMatters>
          Overfitting is the reason "it worked in the demo" fails in production. A trading bot
          that backtests beautifully but loses money, a diagnosis model that aces its own
          hospital's scans but fails at the clinic next door — both memorized their training
          world. For LLMs the same idea appears as <Term>data contamination</Term>: a model that
          saw benchmark questions during training gets a great score by memory, not ability
          (Module 17).
        </WhyItMatters>
        <Misconception>
          "A bigger, more flexible model is always better." The demo just showed you the
          opposite: degree 9 was strictly worse than degree 4 on unseen data. Curiously, giant
          LLMs complicate this story — huge networks trained on huge, diverse data generalize far
          better than classical theory predicted. The old rule still holds where it bites: with{' '}
          <em>limited</em> data, extra flexibility mostly buys you memorized noise.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Your model scores 99% on training data but 62% on fresh data. Diagnosis?',
            options: ['Underfitting', 'Overfitting', 'Perfect generalization', 'The fresh data is wrong'],
            answer: 1,
            explanation:
              'A large gap between training and unseen-data performance is the definition of overfitting: the model memorized specifics of the training set that do not transfer.',
          },
          {
            question: 'Why must the exam (test) data be kept away from training?',
            options: [
              'To save compute',
              'Because grading on data the model saw measures memory, not understanding',
              'Test data is lower quality',
              'It is a legal requirement',
            ],
            answer: 1,
            explanation:
              'If the model trained on it, a good score could come from pure memorization. Only performance on truly unseen data measures whether real, transferable patterns were learned.',
          },
          {
            question: 'A weather model predicts every day as "sunny" and is wrong all winter — on training data too. This is…',
            options: [
              'Overfitting',
              'Underfitting — too simple to capture the real pattern',
              'Ideal behavior',
              'Data leakage',
            ],
            answer: 1,
            explanation:
              'Bad performance on the training data itself signals underfitting: the model lacks the capacity (or training) to represent the true seasonal pattern at all.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Underfitting = too simple (bad everywhere). Overfitting = memorized the noise (great on training, bad on reality).</>,
          <>The only honest score comes from <Term>data the model never trained on</Term>.</>,
          <>Cures: more data, held-out validation, early stopping, regularization.</>,
          <>The training-vs-unseen gap is the first number to check on any ML claim — including AI benchmark results.</>,
        ]}
      />
    </article>
  )
}
