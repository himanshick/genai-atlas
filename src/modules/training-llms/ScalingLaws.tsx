import { useMemo, useState } from 'react'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell, LabeledSlider } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

/* stylized scaling law: loss = a * C^-b + floor, C in log units */
const lossAt = (logC: number) => 3.2 * Math.pow(10, -0.13 * logC) + 1.6

function ScalingExplorer() {
  const [logC, setLogC] = useState(3) // 0..8 slider = 10^0 .. 10^8 (relative compute)

  const path = useMemo(() => {
    const pts: string[] = []
    for (let x = 0; x <= 8.001; x += 0.1) {
      const px = 40 + (x / 8) * 300
      pts.push(`${px.toFixed(1)},${(220 - ((lossAt(0) - lossAt(x)) / (lossAt(0) - lossAt(8))) * 170).toFixed(1)}`)
    }
    return `M ${pts.join(' L ')}`
  }, [])

  const x = 40 + (logC / 8) * 300
  const y = 220 - ((lossAt(0) - lossAt(logC)) / (lossAt(0) - lossAt(8))) * 170
  const loss = lossAt(logC)

  const milestones = [
    { at: 0.4, label: 'barely grammatical' },
    { at: 2, label: 'fluent sentences' },
    { at: 3.6, label: 'coherent paragraphs, weak facts' },
    { at: 5.2, label: 'strong knowledge, some reasoning' },
    { at: 6.8, label: 'multi-step reasoning, code' },
    { at: 8, label: 'frontier-model territory' },
  ]
  const current = milestones.filter((m) => logC >= m.at - 0.2).slice(-1)[0] ?? milestones[0]

  return (
    <WidgetShell
      title="The smooth curve that launched a gold rush"
      hint="Crank the compute — loss falls on rails"
      accent={ACCENT}
    >
      <svg viewBox="0 0 380 260" className="w-full rounded-lg bg-ink-950/70">
        {/* axes */}
        <line x1={40} y1={230} x2={355} y2={230} stroke="#3d3d5c" />
        <line x1={40} y1={230} x2={40} y2={20} stroke="#3d3d5c" />
        <text x={200} y={252} textAnchor="middle" fontSize={10} fill="#7b7b9e">
          training compute (each step = 10× more) →
        </text>
        <text x={14} y={125} fontSize={10} fill="#7b7b9e" transform="rotate(-90 14 125)" textAnchor="middle">
          loss (lower = better) →
        </text>
        {/* log ticks */}
        {[0, 2, 4, 6, 8].map((t) => (
          <text key={t} x={40 + (t / 8) * 300} y={243} textAnchor="middle" fontSize={8.5} fill="#3d3d5c" fontFamily="monospace">
            10^{t}
          </text>
        ))}

        {/* the law */}
        <path d={path} fill="none" stroke={ACCENT} strokeWidth={2.5} />

        {/* marker */}
        <line x1={x} y1={230} x2={x} y2={y} stroke="#fbbf24" strokeWidth={1} strokeDasharray="3 3" />
        <circle cx={x} cy={y} r={7} fill="#fbbf24" stroke="#e8e8f4" strokeWidth={1.5} />

        <text x={x} y={y - 14} textAnchor="middle" fontSize={10} fill="#fbbf24" fontFamily="monospace">
          loss {loss.toFixed(2)}
        </text>
      </svg>

      <div className="mt-4">
        <LabeledSlider
          label="Training compute"
          value={logC}
          min={0}
          max={8}
          step={0.1}
          onChange={setLogC}
          display={`10^${logC.toFixed(1)} units`}
          accent="#fbbf24"
        />
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-ink-850 px-4 py-3">
        <span className="text-sm text-ink-300">capability at this scale:</span>
        <span className="font-display text-sm font-bold text-part2">{current.label}</span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Note the x-axis is logarithmic: every step rightward costs 10× more money. The curve's
        smoothness is the miracle — you can measure it with cheap small models, extend the
        ruler, and <em>budget</em> a capability level before spending $100M. (Stylized curve for
        intuition; real papers plot exactly this shape.)
      </p>
    </WidgetShell>
  )
}

export default function ScalingLaws() {
  return (
    <article>
      <Section title="Intelligence on rails">
        <P>
          In 2020, OpenAI researchers plotted language-model loss against three quantities —
          model size, dataset size, and total training compute — and found something eerie:{' '}
          <Term>clean straight lines on log-log plots</Term>, holding across seven orders of
          magnitude. No plateaus, no surprises. Make everything 10× bigger and loss falls by a
          predictable amount. These are the <Term>scaling laws</Term>.
        </P>
        <ScalingExplorer />
        <KeyIdea>
          Scaling laws turned AI research into <Term>predictable engineering</Term>. Before: "we
          think a bigger model might help." After: "a 10²⁵ FLOP run will reach loss X, which
          corresponds to roughly Y capability — approve the $200M." GPT-4's performance was
          forecast from runs 1,000× smaller before training began. That predictability, more
          than any single model, is what unleashed the billion-dollar compute race.
        </KeyIdea>
      </Section>

      <Section title="Chinchilla: the recipe matters">
        <P>
          A follow-up discovery (DeepMind's <Term>Chinchilla</Term> paper, 2022) refined the
          laws: for a fixed compute budget, there's an optimal <em>balance</em> between model
          size and data. The rule of thumb: <Term>~20 tokens of training data per
          parameter</Term>. The industry had been building models too big and feeding them too
          little — Chinchilla, 4× smaller than a rival but trained on 4× more data, beat it
          soundly.
        </P>
        <List
          items={[
            <>
              <Term>Compute-optimal ≠ deployment-optimal:</Term> today's models are often
              deliberately "overtrained" past the Chinchilla point (LLaMA-class models see
              100+ tokens/parameter) because a <em>smaller</em> model trained longer is cheaper
              to serve forever after. Training cost is paid once; inference cost is paid
              billions of times (Module 2 echo!).
            </>,
            <>
              <Term>The three dials:</Term> parameters (capacity to store patterns), tokens
              (experience to learn from), compute ≈ 6 × parameters × tokens. Scaling any one
              alone eventually starves on the others — balanced growth wins.
            </>,
            <>
              <Term>Limits:</Term> the laws predict <em>loss</em>, not specific skills, and
              they assume data keeps coming. High-quality text is finite — the "data wall" that
              synthetic data (previous page) and new scaling axes like test-time compute
              (Module 18) are responses to.
            </>,
          ]}
        />
        <Analogy>
          Scaling laws are the physics of a rocket program. You can't tell from a bottle rocket
          exactly what the moon mission will discover — but you CAN compute precisely how much
          fuel reaches orbit. Chinchilla was the discovery that everyone's fuel-to-payload ratio
          was wrong: half the fleet's mass was engine (parameters) when it should have been fuel
          (data).
        </Analogy>
        <WhyItMatters>
          Scaling laws explain the industry you see: why labs raise billions (the curve rewards
          whoever can afford the next decade of the x-axis), why GPU supply is geopolitics, why
          model generations arrive on a cadence (each waits for ~10× more compute), and why
          "just scale it" remained the winning strategy for years against cleverer-sounding
          ideas — a lesson known as the Bitter Lesson: general methods that ride compute beat
          human-designed cleverness.
        </WhyItMatters>
        <Misconception>
          "Scaling laws guarantee AGI — just add GPUs." The laws promise falling{' '}
          <em>next-token loss</em>, not any particular ability, and each step costs 10× more
          for a constant-ish improvement — brutal economics. Data supply, energy, and the gap
          between "predicts text superbly" and "reliably reasons" are genuine open questions.
          The laws are a map of the road so far, not a deed to the destination.
        </Misconception>
        <DeepDive title="Deep dive: why power laws? (honest answer: partly a mystery)">
          <P>
            Candidate explanations: natural data has long-tailed structure — common patterns
            are learned first, then ever-rarer ones (each 10× of compute buys the next, rarer
            slice of the distribution). Bigger models can also represent finer-grained features
            (superposition packing, Module 6), and more data provides the statistical evidence
            to pin them down. But a from-first-principles derivation of the exact exponents
            remains elusive — one of several places where deep learning is engineering ahead of
            its science.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What made scaling laws so commercially explosive?',
            options: [
              'They proved AI was conscious',
              'They made capability purchasable and predictable: measure small, extrapolate, budget the big run',
              'They reduced the cost of GPUs',
              'They eliminated the need for data',
            ],
            answer: 1,
            explanation:
              'Predictability de-risked nine-figure investments. You could forecast a run\u2019s loss before training — so capital flooded toward whoever could buy the most compute.',
          },
          {
            question: 'What did the Chinchilla paper change?',
            options: [
              'It introduced attention',
              'It showed models were oversized and underfed — compute-optimal training wants ~20 tokens per parameter',
              'It proved scaling had stopped',
              'It made models multilingual',
            ],
            answer: 1,
            explanation:
              'Balance matters: a smaller model trained on much more data beat a bigger, underfed one at equal compute. The industry\u2019s recipes were rewritten overnight.',
          },
          {
            question: 'Why do modern labs deliberately train PAST the compute-optimal point?',
            options: [
              'They enjoy spending money',
              'A smaller-but-overtrained model is cheaper at inference, and inference costs dominate over a model\u2019s lifetime',
              'Chinchilla was retracted',
              'To use up leftover data',
            ],
            answer: 1,
            explanation:
              'Chinchilla optimizes training compute only. Since serving costs recur billions of times, paying extra training compute to shrink the served model is a profitable trade.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Loss falls as a smooth power law in model size, data and compute — measurable small, extrapolatable large.</>,
          <>Chinchilla: balance ~20 tokens per parameter for compute-optimal training; industry now overtrains smaller models for cheap inference.</>,
          <>The laws turned capability into a budgetable commodity and ignited the compute arms race.</>,
          <>They predict loss, not specific skills — which is exactly where the next page (emergence) picks up.</>,
        ]}
      />
    </article>
  )
}
