import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const WORDS = ['The', 'animal', "didn't", 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired']

/* Plausible attention weights for each word attending to all words (row-stochastic-ish) */
const W: Record<number, number[]> = {
  0: [0.3, 0.45, 0.05, 0.05, 0.03, 0.05, 0.02, 0.02, 0.01, 0.01, 0.01],
  1: [0.15, 0.4, 0.08, 0.1, 0.03, 0.08, 0.03, 0.06, 0.02, 0.02, 0.03],
  2: [0.03, 0.15, 0.3, 0.35, 0.03, 0.05, 0.03, 0.02, 0.02, 0.01, 0.01],
  3: [0.03, 0.25, 0.15, 0.25, 0.04, 0.18, 0.03, 0.03, 0.02, 0.01, 0.01],
  4: [0.05, 0.05, 0.02, 0.08, 0.3, 0.42, 0.03, 0.02, 0.01, 0.01, 0.01],
  5: [0.04, 0.08, 0.03, 0.2, 0.15, 0.38, 0.05, 0.03, 0.02, 0.01, 0.01],
  6: [0.02, 0.08, 0.1, 0.15, 0.02, 0.08, 0.25, 0.08, 0.08, 0.05, 0.09],
  7: [0.03, 0.52, 0.02, 0.04, 0.02, 0.14, 0.05, 0.1, 0.02, 0.02, 0.04],
  8: [0.02, 0.1, 0.03, 0.03, 0.02, 0.04, 0.05, 0.15, 0.25, 0.08, 0.23],
  9: [0.01, 0.05, 0.02, 0.02, 0.01, 0.02, 0.04, 0.08, 0.1, 0.3, 0.35],
  10: [0.02, 0.3, 0.03, 0.04, 0.01, 0.05, 0.06, 0.15, 0.08, 0.1, 0.16],
}

function wordX(i: number) {
  const widths = [34, 52, 48, 42, 30, 46, 56, 22, 32, 30, 38]
  let x = 10
  for (let k = 0; k < i; k++) x += widths[k] + 8
  return { x, w: widths[i] }
}

function AttentionVisualizer() {
  const [sel, setSel] = useState(7)
  const weights = W[sel]

  return (
    <WidgetShell
      title='Who does "it" refer to?'
      hint="Click any word to see what it attends to"
      accent={ACCENT}
    >
      <svg viewBox="0 0 470 190" className="w-full rounded-lg bg-ink-950/70">
        {/* attention arcs */}
        {weights.map((wt, i) => {
          if (i === sel) return null
          const a = wordX(sel)
          const b = wordX(i)
          const x1 = a.x + a.w / 2
          const x2 = b.x + b.w / 2
          const mid = (x1 + x2) / 2
          const lift = Math.min(85, Math.abs(x2 - x1) * 0.35 + 18)
          return (
            <motion.path
              key={`${sel}-${i}`}
              d={`M ${x1} 112 Q ${mid} ${112 - lift} ${x2} 112`}
              fill="none"
              stroke={ACCENT}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 + wt * 1.6, strokeWidth: 0.4 + wt * 9 }}
              transition={{ duration: 0.3 }}
            />
          )
        })}

        {/* words */}
        {WORDS.map((word, i) => {
          const { x, w } = wordX(i)
          const wt = weights[i]
          const isSel = i === sel
          return (
            <g key={i} className="cursor-pointer" onClick={() => setSel(i)}>
              <rect
                x={x}
                y={112}
                width={w}
                height={24}
                rx={6}
                fill={isSel ? `${ACCENT}35` : wt > 0.2 ? '#38bdf825' : '#1c1c30'}
                stroke={isSel ? ACCENT : wt > 0.2 ? '#38bdf8' : '#3d3d5c'}
                strokeWidth={isSel ? 2 : 1}
              />
              <text
                x={x + w / 2}
                y={128}
                textAnchor="middle"
                fontSize={10.5}
                fill={isSel || wt > 0.2 ? '#e8e8f4' : '#7b7b9e'}
                fontWeight={isSel ? 700 : 400}
              >
                {word}
              </text>
              <text x={x + w / 2} y={152} textAnchor="middle" fontSize={8} fill={wt > 0.08 && !isSel ? ACCENT : '#3d3d5c'} fontFamily="monospace">
                {isSel ? '—' : `${(wt * 100).toFixed(0)}%`}
              </text>
            </g>
          )
        })}
        <text x={235} y={178} textAnchor="middle" fontSize={9.5} fill="#7b7b9e">
          arcs = attention paid by the selected word to every other word
        </text>
      </svg>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Click <em>"it"</em>: 52% of its attention goes to <em>"animal"</em> — the model resolves
        the pronoun. Now try the same sentence ending in <em>"too wide"</em> in your head: "it"
        would attend to <em>"street"</em> instead. Same word, different context, different
        blend — this is how transformers give words context-dependent meaning.
      </p>
    </WidgetShell>
  )
}

export default function SelfAttention() {
  return (
    <article>
      <Section title="Every word looks at every word">
        <P>
          Module 5 ended with attention as a bridge between two networks. The transformer's
          radical move: use attention <Term>within</Term> a sentence — every word simultaneously
          looks at every other word and updates its own meaning based on what it finds. This is{' '}
          <Term>self-attention</Term>, and it directly attacks language's core problem: a word's
          meaning depends on context. "It", "bank", "cross" mean nothing in isolation.
        </P>
        <AttentionVisualizer />
        <KeyIdea>
          Self-attention is a round of <Term>contextual updating</Term>: each word's vector
          becomes a weighted blend of all words' information, with weights determined by learned
          relevance. After one round, "it" isn't a generic pronoun vector anymore — it's
          "it-meaning-the-animal". Stack many rounds (layers) and meanings get progressively
          sharper and more global.
        </KeyIdea>
      </Section>

      <Section title="Queries, Keys, Values — the dating-app mechanics">
        <P>
          How does each word decide whom to attend to? Every word publishes three small vectors,
          produced by three learned weight matrices:
        </P>
        <List
          items={[
            <><Term>Query (Q):</Term> "what I'm looking for". The word "it" emits a query like <em>seeking: a recently-mentioned noun, likely a subject</em>.</>,
            <><Term>Key (K):</Term> "what I offer". The word "animal" carries a key like <em>I am: a singular animate noun</em>.</>,
            <><Term>Value (V):</Term> "what I'll actually hand over if chosen" — the information payload, e.g. animal's semantic content.</>,
          ]}
        />
        <P>
          Each word's query is dot-producted (similarity, Module 4!) against every word's key,
          the scores pass through softmax to become percentages, and each word collects the
          weighted blend of all values. All of it — what to seek, what to advertise, what to
          share — is <Term>learned</Term> from data by gradient descent.
        </P>
        <Analogy>
          It works like a conference mixer. Everyone wears a badge stating what they do (key)
          and holds a list of who they need to meet (query). You scan all badges, spend your
          limited time proportionally to how well badges match your list, and collect insights
          (values) from each conversation. You leave the room a more informed version of
          yourself — as does everyone else, simultaneously.
        </Analogy>
        <WhyItMatters>
          Two properties made this THE architecture. <Term>Parallelism:</Term> all words process
          simultaneously — no RNN-style waiting — so GPUs finally run at full tilt, unlocking
          scale (Module 7). <Term>Constant path length:</Term> word 1 and word 5,000 interact
          directly in a single step, not through 4,999 fading memory handoffs — long-range
          dependencies stopped being hard. The price: comparing everything to everything costs
          O(n²) — double the text, quadruple the work — which is why context windows (Module 8)
          are expensive and why "efficient attention" is a research industry.
        </WhyItMatters>
        <Misconception>
          "Attention weights show what the model is thinking." Partially at best. Real models
          have dozens of layers × dozens of heads, weights mix in non-obvious ways, and a head's
          pattern needn't equal its causal effect. Attention maps (like ours above) are honest
          for illustration, but "the model attended to X, therefore it reasoned about X" is a
          leap interpretability researchers treat with great care.
        </Misconception>
        <DeepDive title="Deep dive: why divide by √d?">
          <P>
            The famous formula is softmax(QKᵀ/√d)·V. That √d (square root of the key dimension)
            is a thermostat: dot products of high-dimensional vectors naturally produce large
            numbers, and large scores make softmax collapse into near-one-hot spikes — killing
            gradients (flat regions again!). Dividing by √d keeps scores in softmax's healthy,
            trainable range. A tiny detail that matters enormously in practice — much of deep
            learning engineering is this kind of plumbing.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'In "The animal didn\u2019t cross the street because it was too tired", what does self-attention do for "it"?',
            options: [
              'Deletes the ambiguous word',
              'Blends "animal"\u2019s information into "it"\u2019s vector, resolving the reference in context',
              'Looks the word up in a dictionary',
              'Asks the user for clarification',
            ],
            answer: 1,
            explanation:
              'The pronoun\u2019s query matches "animal"\u2019s key strongly, so "it" absorbs animal\u2019s value — its vector literally becomes "it, the animal" for later layers.',
          },
          {
            question: 'What are Query, Key and Value?',
            options: [
              'Three copies of the same vector',
              'Learned projections meaning: what I seek, what I advertise, what I share',
              'Database terminology unrelated to attention',
              'The three layers of a transformer',
            ],
            answer: 1,
            explanation:
              'Each word emits all three, computed by learned matrices. Q·K similarity decides the attention percentages; V is the payload actually blended.',
          },
          {
            question: 'Why did self-attention unlock massive scale where RNNs could not?',
            options: [
              'It uses fewer parameters',
              'All positions compute simultaneously — perfectly suited to GPUs — and distant words connect in one hop',
              'It requires less data',
              'It skips the training phase',
            ],
            answer: 1,
            explanation:
              'No sequential dependency = full parallelism = efficient use of thousands of GPUs. Plus direct any-to-any interaction replaces fading multi-hop memory. The cost is O(n²) in sequence length.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Self-attention: every word attends to every word and updates its meaning — context made computable.</>,
          <>Mechanics: Query (seek) · Key (advertise) → softmax percentages → blend of Values (share). All learned.</>,
          <>Fully parallel + one-hop long-range access = the properties that let transformers scale to GPT size.</>,
          <>The O(n²) cost of all-pairs comparison is the tax — the story behind context window limits.</>,
        ]}
      />
    </article>
  )
}
