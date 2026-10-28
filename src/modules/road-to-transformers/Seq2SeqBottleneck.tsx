import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell, LabeledSlider } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const SENTENCES = [
  { words: ['I', 'love', 'cats'], quality: 0.97 },
  { words: ['The', 'weather', 'in', 'Paris', 'is', 'lovely', 'today'], quality: 0.88 },
  {
    words: ['The', 'engineer', 'who', 'fixed', 'the', 'bridge', 'that', 'collapsed', 'last', 'winter', 'was', 'honored'],
    quality: 0.62,
  },
  {
    words: ['Although', 'the', 'committee', 'had', 'initially', 'rejected', 'the', 'proposal', 'that', 'the', 'young', 'architect', 'submitted', 'in', 'March', 'they', 'eventually', 'reconsidered', 'after', 'the', 'public', 'campaign'],
    quality: 0.31,
  },
]

function BottleneckDemo() {
  const [idx, setIdx] = useState(1)
  const s = SENTENCES[idx]
  const q = s.quality

  const barColor = q > 0.8 ? '#34d399' : q > 0.5 ? '#fbbf24' : '#f87171'

  return (
    <WidgetShell
      title="Squeeze a sentence through one vector"
      hint="Make the sentence longer and watch the summary degrade"
      accent={ACCENT}
    >
      <LabeledSlider
        label="Sentence length"
        value={idx}
        min={0}
        max={SENTENCES.length - 1}
        step={1}
        onChange={setIdx}
        display={`${s.words.length} words`}
        accent={ACCENT}
      />

      <svg viewBox="0 0 440 220" className="mt-4 w-full rounded-lg bg-ink-950/70">
        {/* source words */}
        {s.words.map((w, i) => {
          const cols = Math.min(s.words.length, 8)
          const row = Math.floor(i / cols)
          const col = i % cols
          return (
            <g key={i}>
              <rect
                x={12 + col * 51}
                y={12 + row * 26}
                width={47}
                height={20}
                rx={5}
                fill="#38bdf818"
                stroke="#38bdf8"
                strokeWidth={0.8}
              />
              <text x={35.5 + col * 51} y={26 + row * 26} textAnchor="middle" fontSize={8.5} fill="#a3a3c2">
                {w.length > 8 ? w.slice(0, 7) + '…' : w}
              </text>
              {/* funnel lines into the bottleneck */}
              <line
                x1={35.5 + col * 51}
                y1={32 + row * 26}
                x2={220}
                y2={126}
                stroke="#38bdf8"
                strokeWidth={0.6}
                opacity={0.35}
              />
            </g>
          )
        })}

        {/* THE vector */}
        <motion.g key={idx} initial={{ scale: 0.85, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }}>
          <rect x={185} y={126} width={70} height={26} rx={7} fill={`${barColor}25`} stroke={barColor} strokeWidth={2} />
          <text x={220} y={143} textAnchor="middle" fontSize={10} fill={barColor} fontWeight={700}>
            ONE vector
          </text>
        </motion.g>
        <text x={220} y={168} textAnchor="middle" fontSize={9} fill="#7b7b9e">
          fixed size, no matter how long the sentence
        </text>

        {/* decoder output */}
        <path d="M 258 139 L 300 139" stroke="#7b7b9e" strokeWidth={1.5} markerEnd="url(#arrS)" />
        <rect x={308} y={120} width={118} height={38} rx={8} fill="#1c1c30" stroke="#3d3d5c" />
        <text x={367} y={136} textAnchor="middle" fontSize={9.5} fill="#a3a3c2">
          decoder writes the
        </text>
        <text x={367} y={149} textAnchor="middle" fontSize={9.5} fill="#a3a3c2">
          translation from it
        </text>

        {/* fidelity meter */}
        <g transform="translate(120, 190)">
          <text x={-8} y={11} textAnchor="end" fontSize={9.5} fill="#7b7b9e">
            information preserved:
          </text>
          <rect x={0} y={2} width={200} height={12} rx={6} fill="#2a2a44" />
          <motion.rect
            x={0}
            y={2}
            height={12}
            rx={6}
            fill={barColor}
            animate={{ width: 200 * q }}
            transition={{ duration: 0.5 }}
          />
          <text x={210} y={12} fontSize={10} fill={barColor} fontWeight={700}>
            {Math.round(q * 100)}%
          </text>
        </g>

        <defs>
          <marker id="arrS" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#7b7b9e" />
          </marker>
        </defs>
      </svg>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Three words squeeze into one vector losslessly. Twenty-two words cannot — early details
        ("March", "the architect") blur or vanish, and the translation quality collapses with
        them. The vector is the same size either way: that is the bottleneck.
      </p>
    </WidgetShell>
  )
}

export default function Seq2SeqBottleneck() {
  return (
    <article>
      <Section title="Two networks and a handoff">
        <P>
          By 2014, LSTMs were good enough to attempt machine translation end-to-end. The design,
          called <Term>sequence-to-sequence (seq2seq)</Term>, is a relay: an{' '}
          <Term>encoder</Term> LSTM reads the entire source sentence and compresses it into its
          final hidden state — one vector — then hands that vector to a <Term>decoder</Term>{' '}
          LSTM, which unrolls the translation from it word by word.
        </P>
        <P>
          It worked — Google replaced its 25-year-old phrase-based translation system with
          seq2seq in 2016. But the design has a structural flaw you can see immediately:
        </P>
        <BottleneckDemo />
        <KeyIdea>
          <Term>The bottleneck problem:</Term> a 3-word greeting and a 60-word legal clause must
          both fit through the <em>same fixed-size vector</em>. Information doesn't scale with
          the sentence; capacity is constant. Translation quality of early seq2seq systems
          visibly degraded as sentences grew — the smoking-gun symptom of the bottleneck.
        </KeyIdea>
      </Section>

      <Section title="A flaw that demanded a fix">
        <Analogy>
          Imagine translating a two-hour movie for a friend, but with a rule: watch the entire
          film first, write <em>one postcard</em> of notes, then retell the whole plot using
          only the postcard. Short films? Easy. Epics with subplots? The postcard runs out of
          room, and your retelling invents or omits details. No matter how good your handwriting
          gets (a better LSTM), the postcard's size is the wall.
        </Analogy>
        <List
          items={[
            <>
              <Term>The absurdity, stated plainly:</Term> while translating word #1 of the
              output, the decoder is <em>forbidden from looking at the source sentence</em> — it
              only has the postcard. Human translators glance back at the source constantly.
            </>,
            <>
              <Term>Patches were tried:</Term> bigger vectors (helps, doesn't scale), reading
              the input backwards (genuinely shipped in production — it puts early words closer
              to the handoff), feeding the input twice. All treated symptoms.
            </>,
            <>
              <Term>The real fix</Term> was obvious in hindsight: let the decoder look back at{' '}
              <em>all</em> the encoder's intermediate states, not just the last one. That is
              attention — the next concept, and the hinge of modern AI.
            </>,
          ]}
        />
        <WhyItMatters>
          The bottleneck is worth understanding deeply because it recurs everywhere information
          is summarized: RAG systems squeezing documents into retrieval snippets (Module 10),
          agents compressing history into memory (Module 11), even you writing meeting notes.
          Whenever a fixed-size summary feeds a variable-size task, expect exactly this failure
          curve — fine on small inputs, degrading on large ones.
        </WhyItMatters>
        <Misconception>
          "Seq2seq failed." It didn't — it was a breakthrough that shipped in products and
          proved end-to-end neural translation possible. Its bottleneck was a{' '}
          <em>growth-limiting flaw in a working system</em>, which is precisely why it was so
          productive: a clear, measurable problem is an invitation for a clean solution. Most
          great inventions (attention included) are answers to a well-posed flaw, not bolts from
          the blue.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'In seq2seq, what exactly does the decoder receive from the encoder?',
            options: [
              'The full source sentence',
              'Only the encoder\u2019s final hidden state — one fixed-size vector',
              'A word-by-word dictionary',
              'The attention weights',
            ],
            answer: 1,
            explanation:
              'The entire source must pass through the single handoff vector. Everything the decoder will ever know about the input is in that one summary — the bottleneck.',
          },
          {
            question: 'Why does translation quality fall specifically for LONG sentences?',
            options: [
              'Long sentences have harder grammar',
              'A fixed-size vector can faithfully hold a short sentence but must lossily compress a long one',
              'The decoder gets tired',
              'Longer sentences cost more to train on',
            ],
            answer: 1,
            explanation:
              'Capacity is constant while information grows. Short inputs fit; long inputs get blurred and truncated in compression — so degradation tracks length, the bottleneck\u2019s fingerprint.',
          },
          {
            question: 'Reading the input sentence BACKWARDS improved early seq2seq translation. Why would that help?',
            options: [
              'Grammar is easier in reverse',
              'It places the beginning of the source right next to the handoff, so the decoder starts with fresher memory of it',
              'It doubled the training data',
              'It was a superstition',
            ],
            answer: 1,
            explanation:
              'With fading LSTM memory, whatever was read most recently survives best in the final vector. Reversing means the source\u2019s first words (which the decoder needs first) are read last — a clever hack that treats the symptom, not the bottleneck.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Seq2seq: an encoder compresses the input into <Term>one vector</Term>; a decoder unrolls the output from it.</>,
          <>The bottleneck: fixed capacity vs growing information — quality degrades with input length.</>,
          <>The decoder can't look back at the source — an absurdity attention was invented to fix.</>,
          <>Bottleneck thinking generalizes: any fixed-size summary of variable-size input fails the same way.</>,
        ]}
      />
    </article>
  )
}
