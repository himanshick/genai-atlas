import { useState } from 'react'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell, LabeledSlider } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const ABILITIES = [
  { name: 'Fluent grammar', onset: 1.2, width: 1.4, color: '#38bdf8' },
  { name: 'Factual recall', onset: 2.6, width: 1.6, color: '#34d399' },
  { name: '3-digit arithmetic', onset: 4.6, width: 0.7, color: '#fbbf24' },
  { name: 'Few-shot translation', onset: 5.2, width: 0.9, color: '#fb923c' },
  { name: 'Multi-step reasoning (CoT)', onset: 6.3, width: 0.8, color: '#f472b6' },
]

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x))

function EmergenceChart() {
  const [scale, setScale] = useState(3.5) // 0..8

  return (
    <WidgetShell
      title="Skills that switch on"
      hint="Grow the model and watch abilities flip from absent to present"
      accent={ACCENT}
    >
      <svg viewBox="0 0 400 250" className="w-full rounded-lg bg-ink-950/70">
        <line x1={45} y1={200} x2={370} y2={200} stroke="#3d3d5c" />
        <line x1={45} y1={200} x2={45} y2={20} stroke="#3d3d5c" />
        <text x={205} y={222} textAnchor="middle" fontSize={10} fill="#7b7b9e">
          model scale (log) →
        </text>
        <text x={18} y={110} fontSize={10} fill="#7b7b9e" transform="rotate(-90 18 110)" textAnchor="middle">
          task performance →
        </text>

        {/* ability curves */}
        {ABILITIES.map((a) => {
          const pts: string[] = []
          for (let x = 0; x <= 8.001; x += 0.1) {
            const perf = sigmoid((x - a.onset) / (a.width * 0.35))
            pts.push(`${(45 + (x / 8) * 320).toFixed(1)},${(200 - perf * 170).toFixed(1)}`)
          }
          return <path key={a.name} d={`M ${pts.join(' L ')}`} fill="none" stroke={a.color} strokeWidth={2} opacity={0.85} />
        })}

        {/* current scale line */}
        <line
          x1={45 + (scale / 8) * 320}
          y1={200}
          x2={45 + (scale / 8) * 320}
          y2={20}
          stroke="#e8e8f4"
          strokeWidth={1.2}
          strokeDasharray="4 4"
        />
      </svg>

      <div className="mt-4">
        <LabeledSlider label="Model scale" value={scale} min={0} max={8} step={0.05} onChange={setScale} display={`10^${scale.toFixed(1)}`} accent="#e8e8f4" />
      </div>

      <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {ABILITIES.map((a) => {
          const perf = sigmoid((scale - a.onset) / (a.width * 0.35))
          const status = perf > 0.85 ? 'mastered' : perf > 0.4 ? 'emerging…' : 'absent'
          return (
            <div key={a.name} className="flex items-center gap-2 rounded-lg bg-ink-850 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color, opacity: 0.3 + perf * 0.7 }} />
              <span className="flex-1 text-xs text-ink-300">{a.name}</span>
              <span
                className="font-mono text-[10px] font-semibold"
                style={{ color: perf > 0.85 ? '#34d399' : perf > 0.4 ? '#fbbf24' : '#7b7b9e' }}
              >
                {status}
              </span>
            </div>
          )
        })}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Slide slowly through 10^4.5–10^6.5: arithmetic, translation and chain-of-thought
        reasoning each flip from ~0% to strong within one order of magnitude — while overall
        loss (previous page) was falling <em>smoothly</em> the whole time. Curves stylized from
        published emergence plots.
      </p>
    </WidgetShell>
  )
}

export default function EmergentAbilities() {
  return (
    <article>
      <Section title="Smooth loss, jumpy skills">
        <P>
          Here's the puzzle scaling laws left behind. Loss improves <em>smoothly</em> with scale
          — but specific <em>abilities</em> don't. Three-digit arithmetic: near-0% accuracy
          across model sizes, then within one 10× jump, suddenly 80%. Same training recipe, same
          data mix, nothing new added. Abilities that appear abruptly at scale, unpredicted and
          unprogrammed, are called <Term>emergent abilities</Term>.
        </P>
        <EmergenceChart />
        <KeyIdea>
          Emergence means <Term>the capability menu is not chosen by the builders</Term>. Nobody
          decided GPT-3 would learn few-shot translation; it appeared. This cuts both ways:
          delightful skills arrive unannounced — and so can unwanted ones (persuasion,
          deception-like behavior), which is why frontier labs now run capability evaluations
          before releases (Module 17), essentially checking what showed up this time.
        </KeyIdea>
      </Section>

      <Section title="Why would skills switch on?">
        <Analogy>
          Water cooling from 1°C to 0°C: temperature (loss) falls smoothly, but at one threshold
          the substance reorganizes — liquid becomes ice, and properties that didn't exist
          (rigidity) suddenly do. Or think of a child learning to read: letter recognition
          improves gradually for years, but "reading" as a usable skill seems to arrive in one
          season, when the sub-skills finally interlock.
        </Analogy>
        <List
          items={[
            <>
              <Term>The multi-step theory:</Term> many tasks are chains — arithmetic needs digit
              parsing AND carrying AND alignment. If each sub-skill improves smoothly, the
              probability of the <em>whole chain</em> succeeding is their product — which stays
              near zero until every link is decent, then rockets. Smooth parts, jumpy whole.
            </>,
            <>
              <Term>The measurement critique:</Term> a 2023 paper ("Are Emergent Abilities a
              Mirage?") showed that harsh all-or-nothing metrics (exact answer only) manufacture
              cliffs: switch to partial credit and many curves smooth out. The model was
              improving all along; the yardstick couldn't see it.
            </>,
            <>
              <Term>The working consensus:</Term> some emergence is a metric artifact, some
              (like induction heads clicking into place during training, Module 6) reflects
              real mechanistic phase changes. Either way, the <em>practical</em> unpredictability
              of which skills the next 10× brings is real.
            </>,
          ]}
        />
        <WhyItMatters>
          Emergence is the wildcard in every AI forecast. It's why labs build first and
          characterize later, why safety researchers worry about abilities appearing before
          anyone tests for them, and why "the next model will/won't be able to X" debates stay
          unresolved — the honest answer is often "we'll know when we train it". It also
          explains capability overhang: skills latent in a model that better prompting later
          unlocks (chain-of-thought, Module 9, famously "switched on" reasoning that was
          already there).
        </WhyItMatters>
        <Misconception>
          "Emergent = magical/unexplainable." Emergence is a description of measurement curves,
          not mysticism. Ice isn't magic; neither is arithmetic appearing at 10^22 FLOPs. The
          underlying process (loss falling on rails) is perfectly regular — what jumps is the
          relationship between general competence and specific task thresholds. Keep both
          pictures: smooth engine, lumpy dashboard.
        </Misconception>
        <DeepDive title="Deep dive: grokking — emergence in time, not just scale">
          <P>
            A related lab-scale phenomenon: train a small transformer on modular arithmetic and
            it first <em>memorizes</em> the training table (test accuracy ~0%), then — thousands
            of steps later, long after training loss hit zero — test accuracy abruptly jumps to
            100%. The network internally reorganized from memorization to a general algorithm
            (interpretability work found actual trigonometric circuits inside!). Called{' '}
            <Term>grokking</Term>, it's the cleanest evidence that networks can transition
            discontinuously between qualitatively different internal strategies — a microcosm of
            what may happen inside frontier runs.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What is the defining signature of an emergent ability?',
            options: [
              'It was secretly programmed in',
              'Near-zero performance across scales, then a rapid jump to competence within roughly one order of magnitude',
              'It improves exactly as fast as loss',
              'It only appears in closed-source models',
            ],
            answer: 1,
            explanation:
              'The surprise is the discontinuity: the ability is effectively absent, absent, absent — then present, while the training loss curve shows nothing special at that point.',
          },
          {
            question: 'How does the "chain of sub-skills" theory explain sudden jumps from smooth improvement?',
            options: [
              'Sub-skills are learned in alphabetical order',
              'A task needing ALL of several sub-skills succeeds with probability ≈ their product — near zero until every link is good, then sharply rising',
              'Models hide abilities until ready',
              'It doesn\u2019t — the theory denies emergence',
            ],
            answer: 1,
            explanation:
              'Multiplying several smoothly-rising probabilities produces a curve that hugs zero then takes off — smooth components, cliff-like composite.',
          },
          {
            question: 'What did the "mirage" critique demonstrate?',
            options: [
              'That models never gain new abilities',
              'That all-or-nothing scoring can manufacture apparent cliffs from smooth underlying progress',
              'That scaling laws are false',
              'That emergence only happens in vision models',
            ],
            answer: 1,
            explanation:
              'With exact-match grading, partial progress scores zero. Softer metrics reveal gradual improvement beneath many (not all) "emergent" jumps — a lesson about yardsticks as much as models.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Loss scales smoothly; specific abilities can switch on abruptly — that mismatch is emergence.</>,
          <>Best explanations: multiplicative sub-skill chains, plus metric artifacts (the mirage critique), plus occasional real internal phase changes (grokking).</>,
          <>Nobody chooses the capability menu — hence pre-release capability evals and forecast humility.</>,
          <>Latent abilities may already exist awaiting better prompting — capability overhang (see chain-of-thought, Module 9).</>,
        ]}
      />
    </article>
  )
}
