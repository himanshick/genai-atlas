import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { StepThrough } from '../../components/learn/StepThrough'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#38bdf8'

/* --- SVG scenes: features building up layer by layer --- */

function PixelGrid() {
  // random-ish dark/light pixels
  const cells = [
    1, 0, 0, 1, 1, 0, 1, 0,
    0, 1, 1, 0, 1, 1, 0, 1,
    1, 0, 1, 1, 0, 1, 1, 0,
    0, 1, 0, 1, 1, 0, 1, 1,
    1, 1, 1, 0, 1, 1, 0, 0,
    0, 1, 1, 1, 0, 1, 1, 0,
    1, 0, 1, 0, 1, 1, 0, 1,
    0, 1, 0, 1, 1, 0, 1, 1,
  ]
  return (
    <svg viewBox="0 0 200 200" className="max-h-56">
      {cells.map((c, i) => (
        <rect
          key={i}
          x={12 + (i % 8) * 22}
          y={12 + Math.floor(i / 8) * 22}
          width={20}
          height={20}
          rx={2}
          fill={c ? '#a3a3c2' : '#2a2a44'}
        />
      ))}
    </svg>
  )
}

function Edges() {
  return (
    <svg viewBox="0 0 200 200" className="max-h-56">
      <g stroke="#38bdf8" strokeWidth={3} strokeLinecap="round">
        <line x1={30} y1={40} x2={80} y2={40} />
        <line x1={120} y1={30} x2={170} y2={60} />
        <line x1={40} y1={90} x2={40} y2={140} />
        <line x1={100} y1={80} x2={140} y2={120} />
        <line x1={60} y1={170} x2={110} y2={165} />
        <line x1={150} y1={140} x2={175} y2={175} />
      </g>
      <text x={100} y={196} textAnchor="middle" fontSize={10} fill="#7b7b9e">
        tiny oriented edges, found everywhere
      </text>
    </svg>
  )
}

function Shapes() {
  return (
    <svg viewBox="0 0 200 200" className="max-h-56">
      <circle cx={55} cy={55} r={26} fill="none" stroke="#a78bfa" strokeWidth={3} />
      <path d="M 120 35 L 170 35 L 145 80 Z" fill="none" stroke="#a78bfa" strokeWidth={3} strokeLinejoin="round" />
      <path d="M 35 120 Q 60 95 85 120 Q 60 145 35 120 Z" fill="none" stroke="#a78bfa" strokeWidth={3} />
      <rect x={120} y={115} width={50} height={40} rx={6} fill="none" stroke="#a78bfa" strokeWidth={3} />
      <text x={100} y={192} textAnchor="middle" fontSize={10} fill="#7b7b9e">
        edges combine into curves, corners, blobs
      </text>
    </svg>
  )
}

function Parts() {
  return (
    <svg viewBox="0 0 200 200" className="max-h-56">
      {/* eye */}
      <g transform="translate(30,40)">
        <path d="M 0 15 Q 25 -8 50 15 Q 25 34 0 15 Z" fill="none" stroke="#fb923c" strokeWidth={2.5} />
        <circle cx={25} cy={14} r={8} fill="#fb923c" opacity={0.6} />
      </g>
      {/* ear */}
      <g transform="translate(125,30)">
        <path d="M 5 45 L 22 0 L 42 40 Q 24 52 5 45 Z" fill="none" stroke="#fb923c" strokeWidth={2.5} strokeLinejoin="round" />
      </g>
      {/* whiskers + nose */}
      <g transform="translate(45,120)">
        <path d="M 30 12 L 42 22 L 18 22 Z" fill="#fb923c" opacity={0.6} />
        <g stroke="#fb923c" strokeWidth={2}>
          <line x1={0} y1={14} x2={16} y2={16} />
          <line x1={0} y1={24} x2={16} y2={21} />
          <line x1={44} y1={16} x2={60} y2={14} />
          <line x1={44} y1={21} x2={60} y2={24} />
        </g>
      </g>
      <text x={100} y={192} textAnchor="middle" fontSize={10} fill="#7b7b9e">
        shapes combine into eyes, ears, whiskers
      </text>
    </svg>
  )
}

function CatFace() {
  return (
    <svg viewBox="0 0 200 200" className="max-h-56">
      <g stroke="#f472b6" strokeWidth={2.5} fill="none" strokeLinejoin="round">
        {/* head */}
        <circle cx={100} cy={110} r={55} />
        {/* ears */}
        <path d="M 55 80 L 45 35 L 85 60" />
        <path d="M 145 80 L 155 35 L 115 60" />
        {/* eyes */}
        <path d="M 65 100 Q 78 90 91 100 Q 78 110 65 100 Z" />
        <path d="M 109 100 Q 122 90 135 100 Q 122 110 109 100 Z" />
        <circle cx={78} cy={100} r={4} fill="#f472b6" />
        <circle cx={122} cy={100} r={4} fill="#f472b6" />
        {/* nose + mouth */}
        <path d="M 94 122 L 106 122 L 100 130 Z" fill="#f472b6" />
        <path d="M 100 130 Q 100 140 88 142 M 100 130 Q 100 140 112 142" />
        {/* whiskers */}
        <g strokeWidth={1.8}>
          <line x1={40} y1={120} x2={68} y2={124} />
          <line x1={40} y1={132} x2={68} y2={131} />
          <line x1={132} y1={124} x2={160} y2={120} />
          <line x1={132} y1={131} x2={160} y2={132} />
        </g>
      </g>
      <text x={100} y={192} textAnchor="middle" fontSize={10} fill="#7b7b9e">
        parts combine into "cat face" — one concept
      </text>
    </svg>
  )
}

export default function WhyDepthMatters() {
  return (
    <article>
      <Section title="What each layer actually learns">
        <P>
          We keep saying networks "learn features automatically". Depth is <em>how</em>. Each
          layer builds slightly more abstract concepts out of the previous layer's concepts —
          and researchers have peered inside trained vision networks and literally found this
          hierarchy. Step through what layers of an image network learn to detect:
        </P>
        <StepThrough
          accent={ACCENT}
          steps={[
            {
              title: 'Input: just numbers',
              visual: <PixelGrid />,
              caption: (
                <>
                  The network sees no cat — only a grid of brightness numbers. Any concept it
                  ever forms must be built from these raw values. This is true for every domain:
                  audio is amplitude numbers, text is token IDs.
                </>
              ),
            },
            {
              title: 'Early layers: edges',
              visual: <Edges />,
              caption: (
                <>
                  First-layer neurons learn the simplest useful pattern: <em>"is there a
                  dark-to-light boundary at my spot, tilted this way?"</em> Nobody programmed
                  "edge" — it emerges because edges are the most reusable building block for
                  predicting anything about images.
                </>
              ),
            },
            {
              title: 'Middle layers: shapes and textures',
              visual: <Shapes />,
              caption: (
                <>
                  Second- and third-layer neurons vote on <em>combinations of edges</em>: "a
                  curve here", "a corner there", "fur-like texture everywhere". Each neuron only
                  does its weighted-vote-and-squash — abstraction comes free from stacking.
                </>
              ),
            },
            {
              title: 'Deeper layers: object parts',
              visual: <Parts />,
              caption: (
                <>
                  Combinations of shapes become recognizable parts: an eye (two curves + a
                  circle), a pointed ear (two lines + fur texture), whiskers. These neurons fire
                  wherever an eye appears — any size, any cat.
                </>
              ),
            },
            {
              title: 'Final layers: whole concepts',
              visual: <CatFace />,
              caption: (
                <>
                  A late neuron fires when eyes + ears + whiskers + fur all report in the right
                  arrangement: <em>cat face</em>. From pixels to "cat" in a handful of steps —
                  each one simple, the composition powerful. LLMs do the same with text: letters
                  → words → grammar → meaning → intent.
                </>
              ),
            },
          ]}
        />
        <KeyIdea>
          Depth = <Term>compositionality</Term>. The world is made of parts within parts (letters
          → words → sentences; edges → shapes → objects), and a deep network mirrors that
          structure: each layer composes the previous layer's concepts into richer ones. A
          shallow network would have to detect "cat" directly from raw pixels in one step —
          possible in theory, hopeless in practice.
        </KeyIdea>
      </Section>

      <Section title="Deep beats wide">
        <P>
          A famous theorem says a network with just <em>one</em> enormous hidden layer can
          approximate any function. So why bother with depth? Because "can in theory" hides an
          exponential price tag:
        </P>
        <List
          items={[
            <>
              <Term>Reuse:</Term> a deep network learns "edge detector" once and every
              higher concept reuses it. A shallow network must re-learn edge-like machinery
              separately inside every single pattern it detects — massive duplication.
            </>,
            <>
              <Term>Exponential efficiency:</Term> some patterns that a 10-layer network captures
              with thousands of neurons would need a shallow network with more neurons than atoms
              in the universe. Depth buys expressiveness at an exponential discount.
            </>,
            <>
              <Term>Transfer:</Term> because early layers learn generic building blocks, a
              network trained on one task can be recycled for another (fine-tuning, Module 12) —
              only the later, task-specific layers need adjusting.
            </>,
          ]}
        />
        <Analogy>
          Lego versus wood-carving. Depth is Lego: standard bricks (edges) snap into walls
          (shapes), walls into houses (parts), houses into cities (concepts) — every level reuses
          the level below. A shallow network is carving each city from a single log: possible,
          but you re-carve every window from scratch, every time.
        </Analogy>
        <WhyItMatters>
          This hierarchy explains modern AI practice. <Term>Pretraining</Term> (Module 7) works
          because generic lower-layer features transfer across tasks. <Term>Interpretability</Term>{' '}
          research (peeking at what neurons detect) is possible because layers encode
          human-recognizable concepts. And "deep" in deep learning finally has content for you:
          GPT-4 stacks on the order of a hundred transformer layers — a hundred rounds of
          composing meaning out of meaning.
        </WhyItMatters>
        <Misconception>
          "More layers is always better." Past a point, naively adding layers makes networks{' '}
          <em>harder</em> to train — the learning signal degrades as it travels backwards through
          many layers. The 2015 invention of <Term>residual connections</Term> (skip-wires that
          let signals bypass layers; Module 6) is what unlocked 100+ layer networks. Depth is
          power that required plumbing to harness.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What do the earliest layers of a trained image network typically detect?',
            options: [
              'Whole objects like faces',
              'Simple oriented edges and color blobs',
              'The image\u2019s file format',
              'Nothing — early layers are random',
            ],
            answer: 1,
            explanation:
              'Researchers consistently find edge and blob detectors in first layers — the most reusable primitive features, from which everything richer is composed.',
          },
          {
            question: 'Why does a deep network need exponentially fewer neurons than a shallow one for many tasks?',
            options: [
              'Deep networks use better GPUs',
              'Each layer reuses the building blocks of the layer below instead of re-learning them per pattern',
              'They train on more data',
              'They use bigger weights',
            ],
            answer: 1,
            explanation:
              'Hierarchical reuse is the discount: learn "edge" once, use it in every shape; learn "eye" once, use it in every face. A shallow network duplicates that machinery inside every detector.',
          },
          {
            question: 'Why does fine-tuning a pretrained network on a new task work so well?',
            options: [
              'The network memorizes the new data instantly',
              'Early layers already contain generic building blocks that transfer; only later layers need adapting',
              'Fine-tuning adds more layers',
              'It doesn\u2019t — you always train from scratch',
            ],
            answer: 1,
            explanation:
              'Edges, textures, grammar, word meanings — the lower floors of the hierarchy are shared across tasks. Fine-tuning mostly renovates the upper, task-specific floors.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Layers form a concept hierarchy: pixels → edges → shapes → parts → objects (and for text: characters → words → grammar → meaning).</>,
          <>Depth = compositionality: each layer builds on the last, mirroring how the world itself is made of parts within parts.</>,
          <>Deep beats wide because building blocks are <Term>reused</Term>, giving exponential efficiency.</>,
          <>Very deep networks only became trainable with tricks like residual connections — coming in Module 6.</>,
        ]}
      />
    </article>
  )
}
