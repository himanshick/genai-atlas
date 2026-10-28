import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const PROBES = [
  {
    token: 'Eiffel',
    detectors: [
      { name: '"Paris landmark" detector', fire: 0.95 },
      { name: '"French culture" detector', fire: 0.8 },
      { name: '"tall structure" detector', fire: 0.7 },
      { name: '"sports team" detector', fire: 0.04 },
      { name: '"programming" detector', fire: 0.02 },
    ],
    writes: 'writes "→ located in Paris", "→ built 1889", "→ iron tower" into the residual stream',
  },
  {
    token: 'Python',
    detectors: [
      { name: '"programming" detector', fire: 0.88 },
      { name: '"snake / animal" detector', fire: 0.35 },
      { name: '"Monty Python" detector', fire: 0.18 },
      { name: '"Paris landmark" detector', fire: 0.02 },
      { name: '"tall structure" detector', fire: 0.01 },
    ],
    writes: 'writes "→ programming language", "→ indentation syntax", plus a faint "→ snake" into the stream',
  },
  {
    token: 'Messi',
    detectors: [
      { name: '"sports team" detector', fire: 0.92 },
      { name: '"Argentina" detector', fire: 0.85 },
      { name: '"celebrity" detector', fire: 0.6 },
      { name: '"programming" detector', fire: 0.02 },
      { name: '"French culture" detector', fire: 0.08 },
    ],
    writes: 'writes "→ footballer", "→ Argentina", "→ Barcelona/PSG/Inter Miami" into the stream',
  },
]

function KeyValueDemo() {
  const [idx, setIdx] = useState(0)
  const probe = PROBES[idx]

  return (
    <WidgetShell
      title="The MLP as a fact lookup"
      hint="Feed different tokens in — watch which detectors fire and what gets written"
      accent={ACCENT}
    >
      <div className="mb-4 flex gap-2">
        {PROBES.map((p, i) => (
          <button
            key={p.token}
            onClick={() => setIdx(i)}
            className="rounded-lg border px-4 py-1.5 font-mono text-sm transition"
            style={{
              borderColor: idx === i ? ACCENT : 'var(--color-ink-700)',
              color: idx === i ? ACCENT : 'var(--color-ink-400)',
              background: idx === i ? `${ACCENT}14` : 'transparent',
            }}
          >
            "{p.token}"
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
        {/* expand stage: detectors */}
        <div className="rounded-lg bg-ink-950/70 p-4">
          <div className="mb-3 text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
            Expand: ask thousands of questions (showing 5)
          </div>
          <div className="space-y-2.5">
            {probe.detectors.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-44 truncate text-xs text-ink-300">{d.name}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-800">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: d.fire > 0.5 ? '#34d399' : d.fire > 0.15 ? '#fbbf24' : '#3d3d5c' }}
                    animate={{ width: `${d.fire * 100}%` }}
                    transition={{ duration: 0.45 }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-[10px] text-ink-400">
                  {(d.fire * 100).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* contract stage: what gets written */}
        <div className="flex flex-col justify-center rounded-lg border border-ink-700 bg-ink-850 p-4">
          <div className="mb-2 text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
            Contract: firing detectors write their knowledge
          </div>
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm leading-relaxed text-ink-200"
          >
            {probe.writes}
          </motion.p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Each detector is one neuron of the expanded middle layer: its input weights define a
        pattern to match (a <em>key</em>), its output weights define what to add to the residual
        stream when matched (a <em>value</em>). Millions of these key→value pairs = the model's
        long-term knowledge.
      </p>
    </WidgetShell>
  )
}

export default function MlpBlocks() {
  return (
    <article>
      <Section title="The other half of every layer">
        <P>
          A transformer layer has two halves. Attention — the famous half — <em>moves</em>{' '}
          information between tokens ("it" fetches from "animal"). But roughly{' '}
          <Term>two-thirds of a transformer's parameters</Term> live in the second half: the{' '}
          <Term>MLP block</Term> (also called the feed-forward network), which processes each
          token <em>individually</em>, no looking at neighbors, through a simple
          expand-then-contract sandwich: project the vector up ~4x wider, apply the activation
          bend, project back down.
        </P>
        <P>
          What is all that width for? The best current understanding:{' '}
          <Term>it's where the knowledge lives</Term>.
        </P>
        <KeyValueDemo />
        <KeyIdea>
          The MLP works like a vast bank of <Term>pattern → response</Term> rules. The expansion
          layer holds millions of learned detectors ("is this about Paris landmarks?"); the
          activation silences the non-matches; the contraction layer lets each firing detector
          write its associated content into the residual stream. Researchers have literally
          located and <em>edited</em> individual facts (e.g. where a model stores "the Eiffel
          Tower is in Paris") inside these blocks.
        </KeyIdea>
      </Section>

      <Section title="Division of labor: attention routes, MLPs know">
        <Analogy>
          A layer is a newsroom. Attention is the meeting where everyone shares notes — reporters
          exchange what they've learned across desks (tokens). The MLP is what happens after the
          meeting: each reporter goes back to their own desk and consults the newsroom's archive,
          enriching their story with background facts. Meeting (communication), then desk-work
          (knowledge lookup) — repeated layer after layer.
        </Analogy>
        <List
          items={[
            <>
              <Term>Attention:</Term> token-to-token communication. Few parameters, quadratic
              cost in sequence length.
            </>,
            <>
              <Term>MLP:</Term> per-token computation and knowledge. Most of the parameters,
              linear cost in sequence length — every token pays the same toll regardless of
              context size.
            </>,
            <>
              <Term>The stack:</Term> alternate them dozens of times. Communicate, look things
              up, communicate what you found, look up deeper things…
            </>,
          ]}
        />
        <WhyItMatters>
          This is where "model size" actually goes — when a model jumps from 7B to 70B
          parameters, it's mostly MLP width and layer count, i.e., <em>more stored knowledge</em>
          . It's also the direct setup for two later stars: <Term>Mixture of Experts</Term>{' '}
          (Module 18) replaces each MLP with many and activates only a few per token — that's
          why MoE models can have a trillion parameters but modest compute. And{' '}
          <Term>model editing / interpretability</Term> (Module 17) largely targets MLPs, because
          that's where facts are physically stored.
        </WhyItMatters>
        <Misconception>
          "Attention is the smart part; the MLP is just filler." If anything, invert it: strip
          the MLPs and a transformer forgets almost everything it knows; strip attention and it
          keeps knowledge but can't use context. The two are complementary organs — routing
          without memory is gossip, memory without routing is a hermit encyclopedia.
        </Misconception>
        <DeepDive title="Deep dive: superposition — more facts than neurons">
          <P>
            A puzzle: models seem to store far more distinct facts and features than they have
            MLP neurons. The leading explanation, <Term>superposition</Term>, uses a fact from
            Module 4's deep dive: in high dimensions, huge numbers of directions can be almost
            perpendicular to each other. The network exploits this to pack many features into
            overlapping combinations of the same neurons — like a bookshelf storing more book
            titles than shelf slots by encoding titles in <em>patterns</em> of book positions.
            The price is interference (a suspected ingredient of hallucination), and untangling
            these packed features — via tools like sparse autoencoders — is one of the hottest
            areas of interpretability research.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What is the key operational difference between attention and the MLP block?',
            options: [
              'Attention is trained, the MLP is hand-coded',
              'Attention moves information between tokens; the MLP processes each token alone',
              'The MLP only runs during training',
              'Attention stores facts, the MLP routes them',
            ],
            answer: 1,
            explanation:
              'Attention = communication across positions. MLP = per-token computation with no cross-token visibility. Routing vs knowledge — and it\u2019s the MLP that holds most of the knowledge.',
          },
          {
            question: 'Where do most of GPT\u2019s parameters live?',
            options: [
              'Attention matrices',
              'The MLP (feed-forward) blocks — roughly two-thirds',
              'Positional encodings',
              'The tokenizer',
            ],
            answer: 1,
            explanation:
              'The 4x expand-contract sandwich is parameter-hungry by design: that width is the storage capacity for the model\u2019s knowledge.',
          },
          {
            question: 'In the key→value picture of MLP neurons, what is the "key"?',
            options: [
              'An encryption key',
              'The input-weight pattern a neuron matches against (its trigger condition)',
              'The token ID',
              'The learning rate',
            ],
            answer: 1,
            explanation:
              'Each middle-layer neuron\u2019s input weights define what pattern makes it fire (key); its output weights define what content it then contributes (value). Fact storage = millions of such pairs.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Every layer = attention (tokens talk) + MLP (each token consults stored knowledge alone).</>,
          <>MLPs hold ~2/3 of parameters and act like key→value fact memories — editable, locatable, expandable.</>,
          <>Scaling model size mostly means scaling MLPs — the setup for Mixture of Experts later.</>,
          <>Superposition lets models pack more features than neurons, at the cost of interference.</>,
        ]}
      />
    </article>
  )
}
