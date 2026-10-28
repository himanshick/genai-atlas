import { useState } from 'react'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell, LabeledSlider } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const CX = 180
const CY = 150

function CosinePlayground() {
  const [angleA, setAngleA] = useState(30)
  const [angleB, setAngleB] = useState(75)
  const [lenA, setLenA] = useState(100)
  const [lenB, setLenB] = useState(70)

  const rad = (d: number) => (d * Math.PI) / 180
  const ax = CX + lenA * Math.cos(-rad(angleA))
  const ay = CY + lenA * Math.sin(-rad(angleA))
  const bx = CX + lenB * Math.cos(-rad(angleB))
  const by = CY + lenB * Math.sin(-rad(angleB))

  const diff = Math.abs(angleA - angleB)
  const cos = Math.cos(rad(diff))
  const euclid = Math.hypot(ax - bx, ay - by) / 100

  const verdict =
    cos > 0.95 ? { t: 'nearly identical meaning', c: '#34d399' }
    : cos > 0.7 ? { t: 'related', c: '#a78bfa' }
    : cos > 0.3 ? { t: 'loosely related', c: '#fbbf24' }
    : cos > -0.3 ? { t: 'unrelated', c: '#fb923c' }
    : { t: 'opposite-ish', c: '#f87171' }

  return (
    <WidgetShell
      title="The cosine similarity dial"
      hint="Rotate the two vectors; stretch them to see what cosine ignores"
      accent={ACCENT}
    >
      <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
        <svg viewBox="0 0 360 300" className="w-full rounded-lg bg-ink-950/70">
          {/* angle arc */}
          <path
            d={`M ${CX + 34 * Math.cos(-rad(angleA))} ${CY + 34 * Math.sin(-rad(angleA))} A 34 34 0 ${diff > 180 ? 1 : 0} 0 ${CX + 34 * Math.cos(-rad(angleB))} ${CY + 34 * Math.sin(-rad(angleB))}`}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={2}
          />
          <text
            x={CX + 52 * Math.cos(-rad((angleA + angleB) / 2))}
            y={CY + 52 * Math.sin(-rad((angleA + angleB) / 2))}
            textAnchor="middle"
            fontSize={11}
            fill="#fbbf24"
          >
            {diff.toFixed(0)}°
          </text>

          {/* vectors */}
          <defs>
            <marker id="mA" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0,0 L9,4.5 L0,9" fill="#38bdf8" />
            </marker>
            <marker id="mB" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0,0 L9,4.5 L0,9" fill="#f472b6" />
            </marker>
          </defs>
          <line x1={CX} y1={CY} x2={ax} y2={ay} stroke="#38bdf8" strokeWidth={3} markerEnd="url(#mA)" />
          <line x1={CX} y1={CY} x2={bx} y2={by} stroke="#f472b6" strokeWidth={3} markerEnd="url(#mB)" />
          <text x={ax + 10} y={ay} fontSize={12} fontWeight={700} fill="#38bdf8">doc A</text>
          <text x={bx + 10} y={by} fontSize={12} fontWeight={700} fill="#f472b6">doc B</text>
          <circle cx={CX} cy={CY} r={3.5} fill="#e8e8f4" />

          {/* euclid dashed line */}
          <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#7b7b9e" strokeWidth={1.2} strokeDasharray="4 4" />
        </svg>

        <div className="space-y-4">
          <LabeledSlider label="Direction of A (meaning)" value={angleA} min={0} max={180} onChange={setAngleA} display={`${angleA}°`} accent="#38bdf8" />
          <LabeledSlider label="Direction of B (meaning)" value={angleB} min={0} max={180} onChange={setAngleB} display={`${angleB}°`} accent="#f472b6" />
          <LabeledSlider label="Length of A (e.g. doc length)" value={lenA} min={40} max={130} onChange={setLenA} display={`${lenA}`} accent="#38bdf8" />
          <LabeledSlider label="Length of B" value={lenB} min={40} max={130} onChange={setLenB} display={`${lenB}`} accent="#f472b6" />

          <div className="rounded-lg bg-ink-850 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink-300">cosine similarity</span>
              <span className="font-mono text-xl font-bold" style={{ color: verdict.c }}>
                {cos.toFixed(3)}
              </span>
            </div>
            <div className="mt-1 text-right text-xs font-semibold" style={{ color: verdict.c }}>
              {verdict.t}
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t border-ink-700 pt-2">
              <span className="text-xs text-ink-400">straight-line (euclidean) distance</span>
              <span className="font-mono text-sm text-ink-300">{euclid.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-400">
        Key experiment: set both directions equal, then stretch the lengths apart. Cosine stays
        at 1.000 — same meaning! — while the dashed euclidean distance grows. Cosine only cares
        about <em>direction</em> (what you're about), not <em>length</em> (roughly, how much text
        or how emphatic).
      </p>
    </WidgetShell>
  )
}

export default function SimilarityMeasures() {
  return (
    <article>
      <Section title="Meaning needs a ruler">
        <P>
          Embeddings turned meaning into geometry. To use that — to search, cluster, or
          deduplicate — we need to actually <em>measure</em> how close two vectors are. The
          industry's ruler of choice is <Term>cosine similarity</Term>: the cosine of the angle
          between two vectors. It reads like a score: <Term>1</Term> = same direction (same
          meaning), <Term>0</Term> = perpendicular (unrelated), <Term>−1</Term> = opposite
          directions.
        </P>
        <CosinePlayground />
        <KeyIdea>
          Cosine similarity compares <Term>direction, not length</Term>. In embedding spaces,
          direction encodes <em>what something is about</em>, while length often reflects
          nuisance factors (document length, word frequency, emphasis). Measuring only the angle
          means a tweet and an essay about the same topic score as similar — usually exactly
          what you want.
        </KeyIdea>
      </Section>

      <Section title="Choosing and using a ruler">
        <Analogy>
          Two compasses pointing the same bearing agree — whether one needle is long and one is
          short. Cosine similarity treats every embedding as a compass needle: it asks "are these
          pointing the same way in meaning-space?" and deliberately ignores needle length.
          Euclidean distance, by contrast, is the crow-flies distance between the needle{' '}
          <em>tips</em> — it mixes direction and length together.
        </Analogy>
        <List
          items={[
            <>
              <Term>Cosine similarity:</Term> angle only. The default for text embeddings and
              semantic search. Range −1…1 (with typical text embeddings, mostly 0…1).
            </>,
            <>
              <Term>Dot product:</Term> cosine × both lengths. Cheaper to compute and used
              internally everywhere (it is <em>the</em> operation inside attention, Module 6).
              If vectors are pre-normalized to length 1, dot product and cosine are identical —
              which is why many systems normalize once and then use plain dot products.
            </>,
            <>
              <Term>Euclidean distance:</Term> straight-line distance between points. Fine for
              normalized vectors (it then ranks identically to cosine), misleading otherwise.
            </>,
          ]}
        />
        <WhyItMatters>
          Every vector database (Module 10) asks you to pick a similarity metric at setup, and
          mixing it up with your embedding model's convention silently ruins search quality.
          Practical calibration tip: with real text embeddings, "high similarity" is often ~0.8+,
          and scores like 0.5 can already mean "barely related" — the absolute numbers vary by
          model, so always compare <em>rankings</em>, not raw thresholds across models.
        </WhyItMatters>
        <Misconception>
          "Similarity 0.9 means 90% same meaning." Cosine scores are not percentages or
          probabilities. Different embedding models squash scores into different ranges (some
          never go below 0.6 for <em>any</em> pair!). A score is only meaningful relative to
          other scores from the same model — use it to rank candidates, not as an absolute
          truth-meter.
        </Misconception>
        <DeepDive title="Deep dive: the curse of high dimensions">
          <P>
            Our 2-D picture hides a strange fact: in 1,000-dimensional space, two{' '}
            <em>random</em> vectors are almost always nearly perpendicular (cosine ≈ 0). That's
            a feature — it means the space has room for millions of unrelated concepts to stay
            out of each other's way (near-orthogonality is how models pack so much in, sometimes
            called <Term>superposition</Term>). The flip side: any clearly positive cosine is a
            strong signal, because chance alone almost never produces it. Meanwhile plain
            euclidean distance becomes less informative in high dimensions — everything is
            "kind of far from everything" — one more reason angles beat distances for
            embeddings.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Cosine similarity between "short tweet about cats" and "long essay about cats" is ~0.85. Why so high despite the length difference?',
            options: [
              'The tweet quotes the essay',
              'Cosine measures direction (topic), not vector length — both point toward cat-space',
              'Cats dominate the internet',
              'The metric is broken',
            ],
            answer: 1,
            explanation:
              'Both texts point the same way in meaning-space. Length differences change vector magnitude, which cosine deliberately ignores.',
          },
          {
            question: 'When are dot product and cosine similarity exactly the same?',
            options: [
              'Never',
              'When both vectors are normalized to length 1',
              'When vectors are 2-dimensional',
              'When similarity is positive',
            ],
            answer: 1,
            explanation:
              'Dot product = cosine × lengthA × lengthB. Set both lengths to 1 and only the cosine remains — which is why pipelines often normalize embeddings once, then use fast dot products.',
          },
          {
            question: 'Model X gives your document pair similarity 0.62; Model Y gives 0.89 for the same pair. What can you conclude?',
            options: [
              'Model Y understands the documents better',
              'Nothing directly — raw scores aren\u2019t comparable across models; only rankings within one model are meaningful',
              'The documents changed',
              'Model X is broken',
            ],
            answer: 1,
            explanation:
              'Each embedding model distributes its scores differently. A 0.62 from one may rank a pair higher than a 0.89 from another. Compare candidates within a model; never compare raw scores across models.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Cosine similarity = angle between vectors: 1 same meaning, 0 unrelated. The default ruler for embeddings.</>,
          <>It ignores length on purpose — direction is topic, length is mostly noise.</>,
          <>Dot product (on normalized vectors) is the fast equivalent, and the core operation inside attention.</>,
          <>Scores are model-relative: rank with them, don't treat them as percentages.</>,
        ]}
      />
    </article>
  )
}
