import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const GATES = [
  {
    id: 'forget',
    name: 'Forget gate',
    emoji: '🗑️',
    color: '#f87171',
    question: '"What in my long-term memory is now obsolete?"',
    example:
      'Reading "The cat… Actually, the DOG chased the mouse" — when "Actually" arrives, the forget gate learns to dial down the stored "cat is the subject" memory so it can be replaced.',
  },
  {
    id: 'input',
    name: 'Input gate',
    emoji: '📥',
    color: '#34d399',
    question: '"What about the current word deserves to be stored long-term?"',
    example:
      'Reading "Marie, who was born in Warsaw…" — the input gate learns that a person\u2019s birthplace is worth writing into long-term memory, because verbs like "speaks" may need it much later.',
  },
  {
    id: 'output',
    name: 'Output gate',
    emoji: '📤',
    color: '#38bdf8',
    question: '"What part of my memory is relevant right now?"',
    example:
      'At "…speaks fluent ___", the output gate learns to surface the stored birthplace ("Warsaw" → Polish) while leaving irrelevant memories (her profession, the weather) unexpressed.',
  },
]

function GateExplorer() {
  const [active, setActive] = useState(0)
  const gate = GATES[active]

  return (
    <WidgetShell
      title="The three gates of an LSTM cell"
      hint="Click each gate to see its job"
      accent={ACCENT}
    >
      <svg viewBox="0 0 440 190" className="w-full rounded-lg bg-ink-950/70">
        {/* conveyor belt: cell state */}
        <line x1={30} y1={50} x2={410} y2={50} stroke="#fbbf24" strokeWidth={4} opacity={0.8} />
        <text x={220} y={32} textAnchor="middle" fontSize={11} fill="#fbbf24" fontWeight={600}>
          cell state — the long-term memory conveyor belt
        </text>
        <path d="M 402 50 L 412 50" stroke="#fbbf24" strokeWidth={4} markerEnd="url(#arrL)" />

        {/* gates as valves on the belt */}
        {GATES.map((g, i) => {
          const x = 110 + i * 110
          const isActive = active === i
          return (
            <g key={g.id} className="cursor-pointer" onClick={() => setActive(i)}>
              <motion.circle
                cx={x}
                cy={50}
                r={isActive ? 24 : 18}
                fill={`${g.color}${isActive ? '35' : '18'}`}
                stroke={g.color}
                strokeWidth={isActive ? 2.5 : 1.5}
                animate={{ r: isActive ? 24 : 18 }}
              />
              <text x={x} y={56} textAnchor="middle" fontSize={isActive ? 16 : 13}>
                {g.emoji}
              </text>
              <text x={x} y={95} textAnchor="middle" fontSize={10} fill={isActive ? g.color : '#7b7b9e'} fontWeight={isActive ? 700 : 500}>
                {g.name}
              </text>
              {/* control wire from input */}
              <path d={`M ${x} 150 L ${x} ${74}`} stroke={g.color} strokeWidth={1.3} strokeDasharray="4 3" opacity={isActive ? 1 : 0.4} />
            </g>
          )
        })}

        {/* inputs */}
        <rect x={140} y={150} width={160} height={28} rx={7} fill="#1c1c30" stroke="#3d3d5c" />
        <text x={220} y={168} textAnchor="middle" fontSize={10.5} fill="#a3a3c2">
          current word + short-term state
        </text>

        <defs>
          <marker id="arrL" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#fbbf24" />
          </marker>
        </defs>
      </svg>

      <motion.div
        key={gate.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-lg border p-4"
        style={{ borderColor: `${gate.color}44`, background: `${gate.color}0e` }}
      >
        <div className="font-display text-sm font-bold" style={{ color: gate.color }}>
          {gate.emoji} {gate.name}: <span className="font-medium text-ink-200">{gate.question}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">{gate.example}</p>
      </motion.div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Each gate is itself a tiny neural layer outputting numbers between 0 (fully closed) and 1
        (fully open) for every slot of the memory — and the gates' weights are <em>learned</em>,
        like everything else. Nobody programs what to forget; the network discovers it.
      </p>
    </WidgetShell>
  )
}

export default function Lstms() {
  return (
    <article>
      <Section title="Memory with a bouncer">
        <P>
          The plain RNN's tragedy: its memory is rewritten wholesale at every step, so old
          information fades whether it mattered or not. The 1997 fix — the{' '}
          <Term>Long Short-Term Memory (LSTM)</Term> network — is one of the great engineering
          ideas in AI: give the memory <Term>gates</Term> that control what enters, what stays,
          and what gets read out.
        </P>
        <P>
          The LSTM splits memory in two. A protected <Term>cell state</Term> runs through time
          like a conveyor belt — information placed on it can ride along <em>unchanged</em> for
          hundreds of steps. Three learned gates act as valves on the belt:
        </P>
        <GateExplorer />
        <KeyIdea>
          The conveyor belt is the trick that beats vanishing gradients: because the cell state
          passes forward mostly <Term>unmodified by default</Term> (nothing multiplies it down
          unless the forget gate actively closes), learning signals can also flow backward
          through time without shrinking. Protect the highway, and both memory and gradients
          survive long distances. Remember this move — transformers reuse it as "residual
          connections" (Module 6).
        </KeyIdea>
      </Section>

      <Section title="Two decades of quiet service">
        <Analogy>
          A plain RNN is a whiteboard that everyone in a relay race must erase-and-rewrite as
          they pass. An LSTM adds a filing cabinet with a librarian: incoming facts are triaged
          ("archive this", input gate), stale files are shredded ("obsolete", forget gate), and
          only relevant folders are pulled for the current task (output gate). The cabinet's
          contents can survive the whole race untouched.
        </Analogy>
        <List
          items={[
            <>
              From ~1997 to ~2017, LSTMs (and their lighter sibling, the <Term>GRU</Term>) were
              the state of the art for language: Google Translate, Siri's speech recognition,
              your phone keyboard's suggestions — all LSTM-powered at their peak.
            </>,
            <>
              They stretched usable memory from a plain RNN's ~10 words to effectively hundreds —
              enough for sentences and paragraphs, still shaky for documents.
            </>,
            <>
              What they never fixed: <Term>sequential processing</Term>. Gates or not, word 57
              still waits for word 56. The GPU-parallelism ceiling remained, and so did the limit
              on scale.
            </>,
          ]}
        />
        <WhyItMatters>
          Beyond history, the LSTM teaches a design principle that recurs across all of deep
          learning: <Term>when information must travel far, build a protected path for it</Term>.
          LSTM cell states, transformer residual streams, and highway networks are the same idea
          in different clothes. Spot the protected path and you understand an architecture.
        </WhyItMatters>
        <Misconception>
          "LSTMs are obsolete curiosities." They still run in production today where sequences
          arrive as streams and budgets are tight (keyboards, sensor data, some speech systems) —
          a running state that costs O(1) per new item is hard to beat for cheap streaming. And
          conceptually they're having a comeback: Mamba-style state-space models (Module 18) are
          direct descendants of the gated-memory idea, now competitive with transformers at some
          scales.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What problem do the LSTM\u2019s gates solve compared to a plain RNN?',
            options: [
              'They make the network smaller',
              'They let the network learn WHAT to keep, discard and use — instead of blindly overwriting all memory each step',
              'They remove the need for training',
              'They let the network read words in parallel',
            ],
            answer: 1,
            explanation:
              'Plain RNN memory fades indiscriminately. Gates give selective control — and crucially, the selection rules are learned from data, not hand-written.',
          },
          {
            question: 'Why does the "conveyor belt" cell state fix vanishing gradients?',
            options: [
              'It uses stronger GPUs',
              'By default information (and gradients) pass through unmultiplied, so signals don\u2019t shrink across many steps',
              'It stores gradients in a database',
              'It skips training on long sentences',
            ],
            answer: 1,
            explanation:
              'Vanishing came from repeated multiplication by small numbers at every step. The cell state\u2019s default is "pass through unchanged" — multiplication only happens when a gate actively intervenes.',
          },
          {
            question: 'Which RNN weakness did LSTMs NOT fix?',
            options: [
              'Forgetting over long distances',
              'Vanishing gradients through time',
              'Sequential one-word-at-a-time processing that blocks parallel training',
              'Selective memory',
            ],
            answer: 2,
            explanation:
              'Gating fixed memory and gradient flow, but each step still depends on the previous one. That sequential chain — the scale ceiling — is what transformers finally removed.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>LSTM = RNN + a protected memory belt + three learned gates: <Term>forget, input, output</Term>.</>,
          <>The pass-through-by-default belt defeats vanishing gradients — the same trick transformers reuse as residual connections.</>,
          <>LSTMs ran the language world for 20 years but stayed sequential — the scale ceiling stood.</>,
          <>Design principle to keep: give important information a protected path.</>,
        ]}
      />
    </article>
  )
}
