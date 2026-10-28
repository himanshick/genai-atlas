import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#38bdf8'

/* Network geometry */
const L0 = [70, 130, 190].map((y) => ({ x: 60, y }))
const L1 = [50, 105, 160, 215].map((y) => ({ x: 200, y }))
const L2 = [{ x: 340, y: 130 }]

const phases = [
  {
    id: 'forward1',
    label: '1 · Forward: inputs flow in',
    caption:
      'An example enters. Each input value travels every wire, gets multiplied by that wire\u2019s weight, and the hidden neurons add up and squash their totals.',
  },
  {
    id: 'forward2',
    label: '2 · Forward: a prediction comes out',
    caption:
      'The hidden layer\u2019s outputs flow onward the same way, and the output neuron produces the network\u2019s guess. So far, information only moved left → right.',
  },
  {
    id: 'loss',
    label: '3 · Compare: how wrong were we?',
    caption:
      'The guess is compared with the true answer to compute the loss. Say we predicted 0.2 but the truth was 1.0 — we\u2019re off by a lot, and now we need to know who to blame.',
  },
  {
    id: 'back2',
    label: '4 · Backward: blame flows right → left',
    caption:
      'Here\u2019s the trick. Using calculus\u2019 chain rule, the error signal travels backwards along the same wires. Each wire learns exactly how much IT contributed to the mistake — a big-weight wire that carried a big signal gets a big share of the blame.',
  },
  {
    id: 'back1',
    label: '5 · Backward: blame reaches every weight',
    caption:
      'The blame keeps flowing until every one of the network\u2019s weights — even those nearest the input — knows its personal slice of responsibility: its gradient. One forward pass + one backward pass = the exact slope for every weight simultaneously.',
  },
  {
    id: 'update',
    label: '6 · Update: every knob turns a little',
    caption:
      'Gradient descent (Module 2) uses those blame-numbers: each weight nudges itself slightly in the direction that would have reduced the error. Then the next example arrives, and the loop repeats — billions of times.',
  },
]

function Pulses({ from, to, color }: { from: { x: number; y: number }[]; to: { x: number; y: number }[]; color: string }) {
  return (
    <>
      {from.map((f, i) =>
        to.map((t, j) => (
          <motion.circle
            key={`${i}-${j}`}
            r={4}
            fill={color}
            initial={{ cx: f.x, cy: f.y, opacity: 0 }}
            animate={{ cx: t.x, cy: t.y, opacity: [0, 1, 1, 0.2] }}
            transition={{ duration: 1.1, delay: (i + j) * 0.08, ease: 'easeInOut' }}
          />
        )),
      )}
    </>
  )
}

function BackpropAnimation() {
  const [phase, setPhase] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => {
      setPhase((p) => (p + 1) % phases.length)
    }, 2600)
    return () => clearTimeout(id)
  }, [playing, phase])

  const p = phases[phase]
  const forwardColor = ACCENT
  const backColor = '#f87171'

  const glow = (on: boolean, color: string) => ({
    fill: on ? `${color}30` : '#1c1c30',
    stroke: on ? color : '#3d3d5c',
    strokeWidth: on ? 2.5 : 1.5,
  })

  return (
    <WidgetShell
      title="Watch blame flow backwards"
      hint="Press play, or click through the 6 phases"
      accent={ACCENT}
    >
      <svg viewBox="0 0 470 250" className="w-full rounded-lg bg-ink-950/70">
        {/* wires */}
        {L0.map((a, i) =>
          L1.map((b, j) => (
            <line key={`w1-${i}${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#2a2a44" strokeWidth={1.2} />
          )),
        )}
        {L1.map((a, i) =>
          L2.map((b, j) => (
            <line key={`w2-${i}${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#2a2a44" strokeWidth={1.2} />
          )),
        )}

        {/* pulses per phase */}
        {p.id === 'forward1' && <Pulses from={L0} to={L1} color={forwardColor} />}
        {p.id === 'forward2' && <Pulses from={L1} to={L2} color={forwardColor} />}
        {p.id === 'back2' && <Pulses from={L2} to={L1} color={backColor} />}
        {p.id === 'back1' && <Pulses from={L1} to={L0} color={backColor} />}

        {/* nodes */}
        {L0.map((n, i) => (
          <circle key={`n0${i}`} cx={n.x} cy={n.y} r={14} {...glow(p.id === 'forward1' || p.id === 'back1' || p.id === 'update', p.id === 'back1' ? backColor : p.id === 'update' ? '#34d399' : forwardColor)} />
        ))}
        {L1.map((n, i) => (
          <circle key={`n1${i}`} cx={n.x} cy={n.y} r={14} {...glow(p.id !== 'loss' && p.id !== 'idle', p.id.startsWith('back') ? backColor : p.id === 'update' ? '#34d399' : forwardColor)} />
        ))}
        {L2.map((n, i) => (
          <circle key={`n2${i}`} cx={n.x} cy={n.y} r={16} {...glow(p.id === 'forward2' || p.id === 'loss' || p.id === 'back2' || p.id === 'update', p.id === 'loss' || p.id === 'back2' ? backColor : p.id === 'update' ? '#34d399' : forwardColor)} />
        ))}

        {/* loss comparison bubble */}
        {p.id === 'loss' && (
          <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <rect x={375} y={95} width={85} height={70} rx={10} fill="#f8717120" stroke={backColor} strokeWidth={1.5} />
            <text x={417} y={118} textAnchor="middle" fontSize={10} fill="#e8e8f4">guess: 0.2</text>
            <text x={417} y={134} textAnchor="middle" fontSize={10} fill="#e8e8f4">truth: 1.0</text>
            <text x={417} y={152} textAnchor="middle" fontSize={10.5} fill={backColor} fontWeight={700}>loss: big!</text>
          </motion.g>
        )}

        {/* update sparkles */}
        {p.id === 'update' && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[...L0, ...L1, ...L2].map((n, i) => (
              <motion.text
                key={i}
                x={n.x + 14}
                y={n.y - 12}
                fontSize={11}
                fill="#34d399"
                initial={{ opacity: 0, y: n.y - 6 }}
                animate={{ opacity: [0, 1, 0], y: n.y - 18 }}
                transition={{ duration: 1.6, delay: i * 0.1, repeat: Infinity }}
              >
                ±
              </motion.text>
            ))}
          </motion.g>
        )}

        {/* legend */}
        <text x={60} y={235} textAnchor="middle" fontSize={9.5} fill="#7b7b9e">inputs</text>
        <text x={200} y={245} textAnchor="middle" fontSize={9.5} fill="#7b7b9e">hidden layer</text>
        <text x={340} y={235} textAnchor="middle" fontSize={9.5} fill="#7b7b9e">output</text>
      </svg>

      {/* phase picker */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setPlaying((v) => !v)}
          className="mr-2 rounded-lg bg-part1 px-3.5 py-1.5 text-sm font-bold text-ink-950"
        >
          {playing ? '⏸' : '▶'}
        </button>
        {phases.map((ph, i) => (
          <button
            key={ph.id}
            onClick={() => {
              setPhase(i)
              setPlaying(false)
            }}
            className="h-2.5 rounded-full transition-all"
            style={{
              width: phase === i ? 26 : 10,
              background: phase === i ? (ph.id.startsWith('back') || ph.id === 'loss' ? '#f87171' : ph.id === 'update' ? '#34d399' : ACCENT) : 'var(--color-ink-700)',
            }}
            aria-label={ph.label}
          />
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-ink-850 px-4 py-3">
        <div className="font-display text-sm font-semibold text-ink-100">{p.label}</div>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{p.caption}</p>
      </div>
    </WidgetShell>
  )
}

export default function Backpropagation() {
  return (
    <article>
      <Section title="The blame assignment problem">
        <P>
          Gradient descent (Module 2) needs one thing to work: for every weight, the slope —{' '}
          <em>"if I nudged this knob up a hair, would the error grow or shrink, and by how
          much?"</em> With two knobs you could try each by hand. GPT-4 has ~1.8 trillion. Testing
          them one at a time, at a million per second, would take weeks <em>per training step</em>.
        </P>
        <P>
          <Term>Backpropagation</Term> is the algorithm that gets all trillion slopes in roughly
          the cost of running the network <em>twice</em>. Once forward to make a prediction, once
          backward to distribute blame:
        </P>
        <BackpropAnimation />
        <KeyIdea>
          Backpropagation answers <Term>"who is responsible for the mistake, and by how
          much?"</Term> for every weight at once. It works because the network is a chain of
          simple operations, and calculus' <Term>chain rule</Term> lets responsibility flow
          backwards through a chain multiplicatively: your share of the blame = your local
          contribution × the blame of everything downstream of you.
        </KeyIdea>
      </Section>

      <Section title="Blame flows like gossip through a company">
        <Analogy>
          A company ships a bad product. The CEO (output neuron) sees the customer complaint
          (the loss). She doesn't interrogate all 10,000 employees individually — she tells her
          three directors how much each of their divisions contributed to the failure. Each
          director splits their share among their managers, each manager among their team.
          One cascade of meetings later, every employee knows their personal slice of
          responsibility — and adjusts. That cascade is one backward pass; the org chart is the
          network; the responsibility slices are gradients.
        </Analogy>
        <List
          items={[
            <>
              <Term>Forward pass:</Term> compute the prediction, remembering intermediate values
              along the way (they're needed for the blame math).
            </>,
            <>
              <Term>Backward pass:</Term> starting from the loss, apply the chain rule layer by
              layer, right to left, producing a gradient for every weight.
            </>,
            <>
              <Term>Update:</Term> gradient descent nudges each weight against its gradient.
              Together these three beats are one <em>training step</em> — repeated billions of
              times.
            </>,
          ]}
        />
        <WhyItMatters>
          Backprop is arguably the most economically important algorithm in the world right now
          — every LLM, image generator and recommender was trained with it. It also explains
          hardware reality: training needs to <em>remember all intermediate values</em> for the
          backward pass, which is why training devours GPU memory while inference (forward only)
          is comparatively light — and why "training chips" and "inference chips" are different
          markets.
        </WhyItMatters>
        <Misconception>
          "The brain must do backpropagation too." Almost certainly not in this form — biological
          neurons have no known way to send precise error signals backwards along their inputs.
          Backprop is not how nature learns; it is how <em>engineering</em> learns. This is a
          feature, not an embarrassment: planes don't flap either.
        </Misconception>
        <DeepDive title="Deep dive: the chain rule in one breath">
          <P>
            If the loss depends on a weight only through a chain — weight → neuron output → next
            layer → … → loss — then the slope of the loss with respect to that weight is the{' '}
            <em>product</em> of the local slopes along the chain. The backward pass just computes
            these products efficiently by reusing shared parts: the blame at any layer is
            computed once and re-split among the layer below, instead of recomputing whole chains
            per weight. That reuse — dynamic programming, really — is the entire miracle: exact
            gradients for a trillion weights in one sweep. It's also why flat activations poison
            learning: one near-zero slope anywhere in the chain multiplies the whole product
            toward zero (the vanishing gradient from the previous concept).
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What does backpropagation actually compute?',
            options: [
              'The model\u2019s prediction',
              'The gradient (blame share) for every weight in one backward sweep',
              'New training examples',
              'The best architecture',
            ],
            answer: 1,
            explanation:
              'Backprop is not the update itself — it is the efficient calculation of every weight\u2019s slope of the loss. Gradient descent then uses those slopes to update the weights.',
          },
          {
            question: 'Why does training use much more GPU memory than inference?',
            options: [
              'Training uses bigger models',
              'The backward pass needs all intermediate values from the forward pass to be remembered',
              'Inference runs on CPUs',
              'Training loads the whole dataset into memory',
            ],
            answer: 1,
            explanation:
              'Blame assignment requires knowing what each neuron output was during the forward pass. Inference can discard values as it goes; training must keep them all until the backward pass finishes.',
          },
          {
            question: 'In the company analogy, what plays the role of the chain rule?',
            options: [
              'The customer complaint',
              'Each level splitting its received blame among the level below, proportional to contribution',
              'The CEO\u2019s salary',
              'Hiring more employees',
            ],
            answer: 1,
            explanation:
              'Blame multiplies down the hierarchy: your responsibility = your contribution to your boss\u2019s output × your boss\u2019s share of the total blame. That cascading proportional split is exactly the chain rule.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Backprop solves blame assignment: every weight learns its exact contribution to the error in one backward sweep.</>,
          <>One training step = forward pass (predict) + backward pass (assign blame) + update (nudge knobs).</>,
          <>It costs about as much as running the network twice — which is why training trillion-weight models is possible at all.</>,
          <>Memory-hungry backward passes are why training and inference have such different hardware needs.</>,
        ]}
      />
    </article>
  )
}
