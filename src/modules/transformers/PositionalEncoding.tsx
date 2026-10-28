import { useMemo, useState } from 'react'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell, LabeledSlider } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const N_DIMS = 8
const N_POS = 48

/* sinusoidal encoding value for position p, dimension d */
function pe(p: number, d: number) {
  const i = Math.floor(d / 2)
  const angle = p / Math.pow(60, (2 * i) / N_DIMS)
  return d % 2 === 0 ? Math.sin(angle) : Math.cos(angle)
}

function PositionalWaves() {
  const [pos, setPos] = useState(12)

  const rows = useMemo(
    () =>
      Array.from({ length: N_DIMS }, (_, d) =>
        Array.from({ length: N_POS }, (_, p) => pe(p, d)),
      ),
    [],
  )

  return (
    <WidgetShell
      title="The position fingerprint machine"
      hint="Slide along the sentence — every position gets a unique stripe pattern"
      accent={ACCENT}
    >
      <svg viewBox="0 0 440 240" className="w-full rounded-lg bg-ink-950/70">
        {/* heatmap */}
        {rows.map((row, d) =>
          row.map((v, p) => (
            <rect
              key={`${d}-${p}`}
              x={30 + p * 8.2}
              y={16 + d * 20}
              width={7.4}
              height={17}
              rx={1.5}
              fill={v > 0 ? '#38bdf8' : '#f472b6'}
              opacity={Math.abs(v) * (p === pos ? 1 : 0.45)}
            />
          )),
        )}
        {/* dim labels */}
        {Array.from({ length: N_DIMS }, (_, d) => (
          <text key={d} x={24} y={30 + d * 20} textAnchor="end" fontSize={8} fill="#7b7b9e" fontFamily="monospace">
            d{d}
          </text>
        ))}
        {/* position marker */}
        <rect x={29 + pos * 8.2} y={12} width={9.4} height={168} rx={2} fill="none" stroke="#fbbf24" strokeWidth={1.8} />
        <text x={34 + pos * 8.2} y={196} textAnchor="middle" fontSize={9.5} fill="#fbbf24" fontWeight={700}>
          pos {pos}
        </text>
        {/* the fingerprint readout */}
        <g transform="translate(30, 208)">
          <text x={-6} y={12} textAnchor="end" fontSize={8.5} fill="#7b7b9e">
            code:
          </text>
          {Array.from({ length: N_DIMS }, (_, d) => {
            const v = pe(pos, d)
            return (
              <g key={d} transform={`translate(${d * 47}, 0)`}>
                <rect x={0} y={0} width={42} height={16} rx={4} fill={v > 0 ? '#38bdf820' : '#f472b620'} stroke={v > 0 ? '#38bdf8' : '#f472b6'} strokeWidth={0.7} />
                <text x={21} y={11.5} textAnchor="middle" fontSize={8.5} fill="#e8e8f4" fontFamily="monospace">
                  {v.toFixed(2)}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      <div className="mt-4">
        <LabeledSlider
          label="Word position in the sequence"
          value={pos}
          min={0}
          max={N_POS - 1}
          step={1}
          onChange={setPos}
          display={`${pos}`}
          accent="#fbbf24"
        />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Each row is one dimension oscillating at its own frequency — top rows tick fast (like a
        seconds hand), bottom rows crawl (like an hours hand). Read down any column and you get
        that position's unique 8-number fingerprint. Slide slowly: nearby positions have similar
        codes (good — "nearby" should look similar), distant ones differ completely.
      </p>
    </WidgetShell>
  )
}

export default function PositionalEncoding() {
  return (
    <article>
      <Section title="Attention is order-blind">
        <P>
          Here's an embarrassing secret about self-attention: it treats a sentence as a{' '}
          <Term>bag of words</Term>. Attention compares vectors pairwise — nothing in Q·K knows
          which word came first. "Dog bites man" and "man bites dog" would produce identical
          representations. RNNs never had this problem (they read in order by construction);
          transformers bought parallelism by throwing order away, and must now buy it back.
        </P>
        <P>
          The fix: before the first layer, <Term>add a position-dependent pattern</Term> to each
          word's embedding — a unique numerical fingerprint for "I am word #7". The original
          transformer built these fingerprints from sine and cosine waves:
        </P>
        <PositionalWaves />
        <KeyIdea>
          Positional encoding works like a clock with many hands: fast-spinning dimensions
          distinguish neighbors, slow-spinning ones distinguish paragraph-scale distances.
          Together they give every position a unique, <Term>smoothly-varying</Term> code — and
          because relative offsets correspond to consistent rotations of these waves, the model
          can easily learn relations like "3 words apart", not just absolute slots.
        </KeyIdea>
      </Section>

      <Section title="From added waves to rotated vectors">
        <Analogy>
          Think of GPS coordinates woven into the fabric of each word's meaning. The word "cat"
          at position 5 becomes "cat, standing at coordinate 5" — one combined vector. Attention
          can then learn location-aware questions ("find nouns <em>shortly before</em> me"), the
          way you might search for "coffee near me" instead of just "coffee".
        </Analogy>
        <List
          items={[
            <>
              <Term>Sinusoidal (2017):</Term> the wave fingerprints above — fixed, not learned,
              chosen for their elegant relative-shift property.
            </>,
            <>
              <Term>Learned positions (GPT-2 era):</Term> just train an embedding per position
              slot. Works fine, but position 2,049 is undefined if you trained to 2,048 — poor
              extrapolation.
            </>,
            <>
              <Term>RoPE (used by LLaMA, Qwen, most modern LLMs):</Term> instead of adding
              position to embeddings, <em>rotate</em> each query and key by an angle
              proportional to its position. The dot product between two rotated vectors then
              depends only on their <em>relative</em> distance — relative position built
              directly into the attention mechanism, elegant and extendable.
            </>,
          ]}
        />
        <WhyItMatters>
          Positional encoding is the hidden protagonist of the <Term>long context</Term> race
          (Module 18). Stretching a model from 8K to 1M tokens is mostly a fight with position
          codes: how do you represent positions the model never saw in training? Tricks like
          RoPE scaling and YaRN — the reason your favorite model suddenly supports 10x longer
          documents — are positional-encoding surgery, nothing more.
        </WhyItMatters>
        <Misconception>
          "Word order is handled by processing words in order." No — a transformer processes
          all words <em>simultaneously</em>; there is no "first". Order exists only because it
          was stamped into the numbers. If you removed positional encodings, GPT would become a
          genuinely order-blind bag-of-words model — and this isn't hypothetical: ablation
          experiments confirm coherence collapses.
        </Misconception>
        <DeepDive title="Deep dive: why not just use 1, 2, 3…?">
          <P>
            Numbering words 1, 2, 3… fails for reasons that illuminate why the waves are clever.
            Raw integers grow unboundedly — position 5,000 would dwarf the semantic content of
            the embedding it's added to. Normalizing (position ÷ length) makes the code depend
            on sentence length, so "3rd word" means different things in different sentences. The
            sinusoidal scheme solves both: every value stays in [−1, 1] forever, each position
            is unique, nearby codes are similar, and any fixed offset is a simple linear
            transformation of the code — exactly the properties attention needs to learn
            position-relative patterns.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Why do transformers need positional encoding when RNNs didn\u2019t?',
            options: [
              'Transformers are bigger',
              'Attention compares all words in parallel with no built-in notion of sequence order',
              'RNNs used punctuation',
              'It\u2019s only needed for translation',
            ],
            answer: 1,
            explanation:
              'RNNs consume words sequentially, so order is implicit in processing. Transformers gave that up for parallelism — order must be injected back as data.',
          },
          {
            question: 'In the clock-hands picture, why have both fast and slow dimensions?',
            options: [
              'Fast hands look better',
              'Fast frequencies distinguish adjacent positions; slow ones distinguish far-apart positions — together covering all scales',
              'Slow dimensions save energy',
              'Only one speed is actually used',
            ],
            answer: 1,
            explanation:
              'A seconds-hand alone repeats every minute (ambiguous at long range); an hours-hand alone barely moves between neighbors. The multi-frequency stack gives unique, informative codes at every scale.',
          },
          {
            question: 'Extending a model\u2019s context from 8K to 128K tokens mostly requires…',
            options: [
              'More attention heads',
              'Handling positions the model never saw — i.e., positional-encoding surgery like RoPE scaling',
              'A bigger vocabulary',
              'Better GPUs only',
            ],
            answer: 1,
            explanation:
              'The architecture already attends to any length (at O(n²) cost) — the real obstacle is that position codes beyond the training range are out-of-distribution. Long-context techniques are largely about stretching those codes gracefully.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Pure attention is order-blind; position must be injected as numbers added to (or rotated into) embeddings.</>,
          <>Sinusoidal codes = multi-speed clock hands: unique per position, similar for neighbors, bounded forever.</>,
          <>Modern models mostly use RoPE — rotate Q and K so attention sees <Term>relative</Term> distance directly.</>,
          <>Long-context breakthroughs are mostly positional-encoding engineering in disguise.</>,
        ]}
      />
    </article>
  )
}
