import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const SRC = ['The', 'black', 'cat', 'crossed', 'the', 'street']
const TGT = ['Le', 'chat', 'noir', 'a', 'traversé', 'la', 'rue']

/* attention weights [target][source] — note the order flip for chat/noir */
const ATTN: number[][] = [
  [0.82, 0.06, 0.08, 0.01, 0.02, 0.01], // Le -> The
  [0.05, 0.12, 0.78, 0.02, 0.02, 0.01], // chat -> cat
  [0.03, 0.83, 0.1, 0.02, 0.01, 0.01], // noir -> black
  [0.02, 0.03, 0.1, 0.75, 0.05, 0.05], // a -> crossed
  [0.01, 0.02, 0.05, 0.85, 0.03, 0.04], // traversé -> crossed
  [0.05, 0.02, 0.02, 0.05, 0.72, 0.14], // la -> the
  [0.02, 0.02, 0.02, 0.06, 0.1, 0.78], // rue -> street
]

function AttentionDemo() {
  const [tIdx, setTIdx] = useState(2)
  const weights = ATTN[tIdx]

  const srcX = (i: number) => 40 + i * 72
  const tgtX = (i: number) => 28 + i * 62

  return (
    <WidgetShell
      title="Translation with a searchlight"
      hint="Click any French word to see where the decoder is looking"
      accent={ACCENT}
    >
      <svg viewBox="0 0 460 210" className="w-full rounded-lg bg-ink-950/70">
        {/* attention beams */}
        {weights.map((w, i) => (
          <motion.line
            key={`${tIdx}-${i}`}
            x1={tgtX(tIdx) + 22}
            y1={148}
            x2={srcX(i) + 26}
            y2={62}
            stroke={ACCENT}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 + w * 0.85, strokeWidth: 0.5 + w * 7 }}
            transition={{ duration: 0.35 }}
          />
        ))}

        {/* source words */}
        {SRC.map((w, i) => {
          const wt = weights[i]
          return (
            <g key={w + i}>
              <motion.rect
                x={srcX(i)}
                y={38}
                width={52}
                height={24}
                rx={6}
                fill={`#38bdf8${wt > 0.4 ? '35' : '12'}`}
                stroke="#38bdf8"
                animate={{ strokeWidth: 0.8 + wt * 2.5, strokeOpacity: 0.4 + wt * 0.6 }}
              />
              <text x={srcX(i) + 26} y={54} textAnchor="middle" fontSize={10.5} fill={wt > 0.4 ? '#e8e8f4' : '#a3a3c2'}>
                {w}
              </text>
              <text x={srcX(i) + 26} y={28} textAnchor="middle" fontSize={8.5} fill={wt > 0.15 ? ACCENT : '#3d3d5c'} fontFamily="monospace">
                {(wt * 100).toFixed(0)}%
              </text>
            </g>
          )
        })}

        {/* target words */}
        {TGT.map((w, i) => (
          <g key={w + i} className="cursor-pointer" onClick={() => setTIdx(i)}>
            <rect
              x={tgtX(i)}
              y={148}
              width={44}
              height={24}
              rx={6}
              fill={i === tIdx ? `${ACCENT}30` : '#1c1c30'}
              stroke={i === tIdx ? ACCENT : '#3d3d5c'}
              strokeWidth={i === tIdx ? 2 : 1}
            />
            <text x={tgtX(i) + 22} y={164} textAnchor="middle" fontSize={10.5} fill={i === tIdx ? '#e8e8f4' : '#7b7b9e'}>
              {w}
            </text>
          </g>
        ))}
        <text x={230} y={196} textAnchor="middle" fontSize={9.5} fill="#7b7b9e">
          French output (click a word) — beams show where it looks in the English source
        </text>
      </svg>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Click <em>chat</em> then <em>noir</em>: French says "cat black", so the decoder's
        attention <em>crosses over</em> — looking at "cat" first, then back at "black". Nobody
        programmed this alignment; it emerged from translation training. The percentages are the
        attention weights: a learned, soft lookup over the whole source.
      </p>
    </WidgetShell>
  )
}

export default function BirthOfAttention() {
  return (
    <article>
      <Section title="Just let it look back">
        <P>
          The bottleneck's absurdity — a translator forbidden from re-reading the source — had
          an equally direct fix, published by Bahdanau, Cho and Bengio in 2014: keep{' '}
          <Term>every</Term> encoder hidden state (one per source word), and at each output
          step, let the decoder <Term>look back at all of them</Term> and decide which are
          relevant right now.
        </P>
        <P>
          "Deciding what's relevant" is done with machinery you already know: the decoder's
          current state is compared against every source position (a similarity score — Module
          4!), the scores are normalized into percentages, and the source states are blended in
          those proportions. Those percentages are the <Term>attention weights</Term>:
        </P>
        <AttentionDemo />
        <KeyIdea>
          Attention = a <Term>soft, learned lookup</Term>. Instead of choosing one source word
          to consult (hard, non-differentiable, untrainable), the decoder takes a{' '}
          <em>weighted average of everything</em>, with learned weights that usually concentrate
          on the few positions that matter. Soft choices are differentiable — so gradient
          descent can train the looking itself. That is the whole trick.
        </KeyIdea>
      </Section>

      <Section title="Small patch, seismic consequences">
        <Analogy>
          Before attention: taking an exam from memory after one read of the textbook — hope the
          summary in your head is enough. With attention: an <em>open-book exam</em>. For every
          question you flip straight to relevant pages. Nothing about your memory improved; your
          access changed. And crucially, "knowing where to flip" is itself a skill the network
          learns.
        </Analogy>
        <List
          items={[
            <>
              <Term>The bottleneck dissolved:</Term> information available to the decoder now
              grows <em>with</em> the input — long sentences stopped degrading, and translation
              quality jumped immediately.
            </>,
            <>
              <Term>Interpretability for free:</Term> attention weights can be plotted (as
              above), showing word alignments the model discovered on its own — one of the first
              windows into what neural language models actually learn.
            </>,
            <>
              <Term>The radical follow-up (2017):</Term> if attention is powerful enough to
              connect decoder to source… why keep the RNN at all? Replace recurrence itself with
              attention — words attending to other words in the same sentence. The paper's title
              said it plainly: <em>"Attention Is All You Need."</em> The result is the
              transformer, and it's where we go next.
            </>,
          ]}
        />
        <WhyItMatters>
          This is the single most consequential idea in this atlas. Attention is the beating
          heart of every GPT, Claude, Gemini and LLaMA; of image generators' text conditioning
          (Module 13); of AlphaFold's protein reasoning. Understand this open-book move deeply —
          the entire next module just industrializes it.
        </WhyItMatters>
        <Misconception>
          "Attention means the model focuses on one thing, like human attention." It's a{' '}
          <em>weighted blend over everything</em>, always — usually peaked, but never exclusive,
          and multiple places at once is routine. The borrowed word "attention" is evocative but
          loose; "soft lookup" or "learned relevance-weighted averaging" is what the math
          actually does.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What does attention give the decoder that seq2seq denied it?',
            options: [
              'A bigger hidden state',
              'Access to ALL source-word states at every output step, weighted by learned relevance',
              'A dictionary of translations',
              'More training data',
            ],
            answer: 1,
            explanation:
              'Instead of one squeezed summary vector, the decoder consults every encoder state each time it writes a word — the open-book exam.',
          },
          {
            question: 'Why must the lookup be SOFT (a weighted average) rather than picking the single best source word?',
            options: [
              'Averages are more accurate',
              'A hard pick isn\u2019t differentiable, so gradient descent couldn\u2019t train the looking behavior',
              'Softness saves memory',
              'To keep translations polite',
            ],
            answer: 1,
            explanation:
              'Training needs gradients, and "select index 3" has no useful slope. A weighted blend changes smoothly with the weights, so the network can learn where to look by gradient descent.',
          },
          {
            question: 'Translating "black cat" → "chat noir", attention for "noir" points mostly at "black" — position 2 in English, position 3 in French. What does this demonstrate?',
            options: [
              'A bug in the model',
              'The model learned word alignment across different word orders, without anyone programming it',
              'French is read backwards',
              'Attention only works for adjacent words',
            ],
            answer: 1,
            explanation:
              'The crossing pattern shows learned alignment: the network discovered from data that French adjective order flips, and its attention follows meaning rather than position.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Attention lets the decoder consult <Term>all</Term> input positions at every step — the open-book exam that dissolved the bottleneck.</>,
          <>It's a soft lookup: similarity scores → percentages → weighted blend. Soft = differentiable = trainable.</>,
          <>Attention weights are readable — early neural interpretability came free.</>,
          <>The 2017 sequel asked "why keep the RNN?" — and the transformer was born.</>,
        ]}
      />
    </article>
  )
}
