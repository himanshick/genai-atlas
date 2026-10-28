import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const WORDS = ['The', 'cat', 'sat', 'on', 'mats']

const FAMILIES = [
  {
    id: 'encoder',
    name: 'Encoder-only',
    example: 'BERT (2018)',
    color: '#38bdf8',
    job: 'Understanding',
    desc: 'Every word sees every word — full bidirectional vision. Perfect for understanding tasks: classification, search relevance, extracting entities. But it has no natural way to generate text.',
    uses: 'Search ranking, sentiment analysis, embeddings for RAG',
    canSee: (_i: number, _j: number) => true,
  },
  {
    id: 'decoder',
    name: 'Decoder-only',
    example: 'GPT, Claude, LLaMA',
    color: '#a78bfa',
    job: 'Generation',
    desc: 'Each word sees only itself and the past — a causal mask blocks the future. This makes next-word prediction honest (no peeking!), and generation natural: predict, append, repeat. The architecture that won.',
    uses: 'Chat, code, writing — essentially all modern LLMs',
    canSee: (i: number, j: number) => j <= i,
  },
  {
    id: 'encdec',
    name: 'Encoder–decoder',
    example: 'T5, Whisper, translation models',
    color: '#34d399',
    job: 'Transformation',
    desc: 'An encoder reads the full input bidirectionally; a decoder generates output while attending to the encoded input (cross-attention). Ideal when input and output are clearly different things.',
    uses: 'Translation, speech-to-text (Whisper), summarization',
    canSee: (i: number, j: number) => j <= i,
  },
]

function MaskExplorer() {
  const [fam, setFam] = useState(1)
  const family = FAMILIES[fam]

  return (
    <WidgetShell
      title="Who is allowed to see whom?"
      hint="Switch families — the grid shows which words each word can attend to"
      accent={ACCENT}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {FAMILIES.map((f, i) => (
          <button
            key={f.id}
            onClick={() => setFam(i)}
            className="rounded-lg border px-3.5 py-2 text-sm font-semibold transition"
            style={{
              borderColor: fam === i ? f.color : 'var(--color-ink-700)',
              color: fam === i ? f.color : 'var(--color-ink-400)',
              background: fam === i ? `${f.color}14` : 'transparent',
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-[auto_1fr]">
        <svg viewBox="0 0 250 250" className="mx-auto w-full max-w-[260px]">
          {/* column labels (attended-to) */}
          {WORDS.map((w, j) => (
            <text key={`c${j}`} x={78 + j * 34} y={38} textAnchor="middle" fontSize={9.5} fill="#7b7b9e">
              {w}
            </text>
          ))}
          <text x={145} y={16} textAnchor="middle" fontSize={8.5} fill="#3d3d5c">
            …can look at ↓
          </text>
          {/* row labels (attending) */}
          {WORDS.map((w, i) => (
            <text key={`r${i}`} x={52} y={70 + i * 34} textAnchor="end" fontSize={9.5} fill="#7b7b9e">
              {w}
            </text>
          ))}
          {/* mask cells */}
          {WORDS.map((_, i) =>
            WORDS.map((_, j) => {
              const visible = family.canSee(i, j)
              return (
                <motion.rect
                  key={`${fam}-${i}-${j}`}
                  x={62 + j * 34}
                  y={54 + i * 34}
                  width={30}
                  height={30}
                  rx={5}
                  initial={{ opacity: 0.4 }}
                  animate={{
                    fill: visible ? `${family.color}45` : '#1c1c30',
                    opacity: 1,
                  }}
                  stroke={visible ? family.color : '#2a2a44'}
                  strokeWidth={0.8}
                />
              )
            }),
          )}
          {/* blocked marks */}
          {WORDS.map((_, i) =>
            WORDS.map((_, j) =>
              !family.canSee(i, j) ? (
                <text key={`x${fam}-${i}-${j}`} x={77 + j * 34} y={73 + i * 34} textAnchor="middle" fontSize={10} fill="#3d3d5c">
                  ✕
                </text>
              ) : null,
            ),
          )}
        </svg>

        <motion.div key={fam} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
          <div className="mb-1 flex items-baseline gap-2">
            <h4 className="font-display text-lg font-bold" style={{ color: family.color }}>
              {family.name}
            </h4>
            <span className="font-mono text-xs text-ink-400">{family.example}</span>
          </div>
          <div
            className="mb-2 inline-block rounded px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase"
            style={{ background: `${family.color}20`, color: family.color }}
          >
            job: {family.job}
          </div>
          <p className="text-sm leading-relaxed text-ink-300">{family.desc}</p>
          <p className="mt-2 text-xs text-ink-400">
            <span className="font-semibold text-ink-300">Used for: </span>
            {family.uses}
          </p>
          {fam === 2 && (
            <p className="mt-2 rounded-lg bg-ink-850 p-2.5 text-xs leading-relaxed text-ink-400">
              (Grid shows the decoder side; its tokens additionally cross-attend to the full
              encoded input.)
            </p>
          )}
        </motion.div>
      </div>
    </WidgetShell>
  )
}

export default function EncoderVsDecoder() {
  return (
    <article>
      <Section title="One block, three blueprints">
        <P>
          The transformer layer is a universal building block — but you can wire the blocks into
          different machines by changing one thing: <Term>the attention mask</Term>, the rule for
          which tokens may look at which. Three wirings define the three great families:
        </P>
        <MaskExplorer />
        <KeyIdea>
          The mask <Term>is</Term> the personality. Full vision (encoder) makes a great{' '}
          <em>reader</em> but can't generate honestly. Past-only vision (decoder) makes
          next-token prediction a fair game — the model trains on every prefix of every sentence
          simultaneously, each token predicting its successor without cheating. That "causal
          mask" is the entire difference between BERT and GPT at the architectural level.
        </KeyIdea>
      </Section>

      <Section title="Why decoder-only conquered the world">
        <Analogy>
          An encoder is a literature professor: hand them a finished essay and they'll analyze it
          brilliantly — themes, tone, errors — because they can read it forwards and backwards.
          A decoder is an improv performer: they can only build on what's been said so far, never
          peek ahead — which is exactly the constraint that makes them able to <em>perform</em>{' '}
          (generate) rather than just critique. GPT is the improv artist who read the whole
          internet.
        </Analogy>
        <List
          items={[
            <>
              <Term>One model, every task:</Term> generation subsumes understanding — ask a
              generator to classify by having it <em>write</em> the answer ("Sentiment:
              positive"). The reverse doesn't work: BERT can't chat. Decoder-only turned every
              NLP task into "just continue the text".
            </>,
            <>
              <Term>Training economics:</Term> causal masking means every token in the corpus is
              a training example (predict-the-next at every position) with no special data
              preparation. Simple objective + unlimited raw text + scalable architecture =
              the scaling recipe of Module 7.
            </>,
            <>
              <Term>Where the others survive:</Term> encoders still power most embedding models
              (Module 10's RAG retrievers!) and cheap classifiers; encoder-decoders excel where
              input/output are different modalities — Whisper (audio→text) and many translation
              systems.
            </>,
          ]}
        />
        <WhyItMatters>
          "Decoder-only transformer" appears in the first line of virtually every modern model
          card — now you can unpack it: causal mask, next-token training, generation by
          append-and-repeat. And when you pick an embedding model for search (encoder) versus a
          chat model (decoder), you're navigating exactly this family tree.
        </WhyItMatters>
        <Misconception>
          "GPT-style models are 'weaker' because they can't see the future context." For
          generation, seeing the future is not a superpower — it's cheating that makes training
          incoherent (predicting a word you can already see). The constraint is the point:
          past-only vision is what aligns training with the act of writing. Different masks
          aren't better or worse; they're matched to different jobs.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Architecturally, what is the core difference between BERT and GPT?',
            options: [
              'BERT is much larger',
              'The attention mask: BERT\u2019s tokens see everything; GPT\u2019s see only the past',
              'GPT uses different neurons',
              'BERT has no attention',
            ],
            answer: 1,
            explanation:
              'Both stack transformer layers. Bidirectional attention (BERT) optimizes understanding; causal attention (GPT) makes honest next-token prediction — and therefore generation — possible.',
          },
          {
            question: 'Why does the causal mask make training so efficient?',
            options: [
              'It reduces the number of layers',
              'Every position in every text becomes a fair next-token training example, all computed in one pass',
              'It skips half the data',
              'It compresses the vocabulary',
            ],
            answer: 1,
            explanation:
              'With the future blocked, the model can be trained to predict token 2 from token 1, token 3 from 1–2, etc., simultaneously across the whole sequence — maximal signal from raw text.',
          },
          {
            question: 'You need an embedding model to power semantic search. Which family is the traditional fit?',
            options: [
              'Decoder-only, because it\u2019s newest',
              'Encoder-only — full bidirectional reading builds the richest representation of a complete text',
              'Neither can do it',
              'Only encoder-decoder',
            ],
            answer: 1,
            explanation:
              'Embedding a finished document is an understanding task: bidirectional context helps and generation isn\u2019t needed. Most embedding models are encoder-style (though decoder-based embedders now exist too).',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Same blocks, different masks: encoder (see all) reads, decoder (see past) writes, encoder-decoder transforms.</>,
          <>The causal mask aligns training with generation and turns all raw text into training signal.</>,
          <>Decoder-only won because generation subsumes every task: "just continue the text".</>,
          <>Encoders live on in embeddings/search; encoder-decoders in translation and speech.</>,
        ]}
      />
    </article>
  )
}
