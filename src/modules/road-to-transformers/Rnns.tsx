import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { StepThrough } from '../../components/learn/StepThrough'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const WORDS = ['The', 'cat', 'chased', 'the', 'mouse']
/* hidden state "memory bars" evolving as words are read */
const STATES = [
  [0.2, 0.1, 0.15, 0.1],
  [0.5, 0.55, 0.2, 0.15],
  [0.45, 0.5, 0.7, 0.3],
  [0.4, 0.45, 0.65, 0.35],
  [0.35, 0.42, 0.6, 0.75],
]
const STATE_LABELS = ['subject?', 'animal?', 'action?', 'object?']

function RnnScene({ step }: { step: number }) {
  const state = STATES[step]
  return (
    <svg viewBox="0 0 440 210" className="w-full max-w-lg">
      {/* input tokens */}
      {WORDS.map((w, i) => (
        <g key={i} opacity={i < step ? 0.3 : i === step ? 1 : 0.55}>
          <rect
            x={18 + i * 84}
            y={12}
            width={72}
            height={28}
            rx={7}
            fill={i === step ? '#a78bfa30' : '#1c1c30'}
            stroke={i === step ? ACCENT : '#3d3d5c'}
            strokeWidth={i === step ? 2 : 1}
          />
          <text x={54 + i * 84} y={31} textAnchor="middle" fontSize={12} fill={i === step ? '#e8e8f4' : '#7b7b9e'}>
            {w}
          </text>
        </g>
      ))}

      {/* arrow from current token into cell */}
      <path
        d={`M ${54 + step * 84} 44 Q ${54 + step * 84} 70 ${205} 92`}
        fill="none"
        stroke={ACCENT}
        strokeWidth={2}
        markerEnd="url(#arrRnn)"
      />

      {/* the recurrent cell */}
      <rect x={160} y={92} width={90} height={64} rx={12} fill="#a78bfa1e" stroke={ACCENT} strokeWidth={2} />
      <text x={205} y={120} textAnchor="middle" fontSize={11.5} fill={ACCENT} fontWeight={700}>
        RNN cell
      </text>
      <text x={205} y={137} textAnchor="middle" fontSize={9} fill="#a3a3c2">
        same weights each step
      </text>

      {/* recurrent loop arrow */}
      <path
        d="M 250 140 Q 285 175 205 172 Q 145 170 158 142"
        fill="none"
        stroke="#fbbf24"
        strokeWidth={1.8}
        strokeDasharray="5 4"
        markerEnd="url(#arrRnnY)"
      />
      <text x={228} y={188} textAnchor="middle" fontSize={9.5} fill="#fbbf24">
        memory loops back
      </text>

      {/* hidden state bars */}
      <g transform="translate(300, 84)">
        <text x={58} y={-6} textAnchor="middle" fontSize={10.5} fill="#38bdf8" fontWeight={600}>
          hidden state (the memory)
        </text>
        {state.map((v, i) => (
          <g key={i} transform={`translate(${i * 30}, 0)`}>
            <rect x={0} y={80 - v * 80} width={20} height={v * 80} rx={3} fill="#38bdf8" opacity={0.85} />
            <rect x={0} y={0} width={20} height={80} rx={3} fill="none" stroke="#2a2a44" />
            <text x={10} y={94} textAnchor="middle" fontSize={7.5} fill="#7b7b9e">
              {STATE_LABELS[i]}
            </text>
          </g>
        ))}
      </g>

      <defs>
        <marker id="arrRnn" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill={ACCENT} />
        </marker>
        <marker id="arrRnnY" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="#fbbf24" />
        </marker>
      </defs>
    </svg>
  )
}

export default function Rnns() {
  return (
    <article>
      <Section title="Give the network a memory">
        <P>
          N-grams died of amnesia — so the next idea was to build a network that <em>carries a
          memory</em>. A <Term>Recurrent Neural Network (RNN)</Term> reads text the way you read
          a ticker tape: one word at a time, updating a running summary — the{' '}
          <Term>hidden state</Term> — after each word. The same small network is applied at every
          step: new word + old summary in, updated summary out.
        </P>
        <StepThrough
          accent={ACCENT}
          steps={WORDS.map((w, i) => ({
            title: `Step ${i + 1}: read "${w}"`,
            visual: <RnnScene step={i} />,
            caption:
              i === 0 ? (
                <>The first word arrives. The hidden state starts near zero — a blank mind — and the cell mixes "The" into it. Not much to remember yet.</>
              ) : i === 1 ? (
                <>"cat" gets folded into the memory. The state now encodes something like <em>the subject is an animal</em>. Note: the state is a fixed-size vector — this same handful of numbers must hold everything remembered.</>
              ) : i === 2 ? (
                <>"chased" updates the memory again: an action is underway. The cell is identical at every step — one set of weights, reused — which is elegant and, as we'll see, also the root of its problems.</>
              ) : i === 3 ? (
                <>A second "the" barely changes the memory. But notice what's happening to "The cat" from steps 1–2: each update slightly overwrites the past. Old information fades with every step.</>
              ) : (
                <>After "mouse", the state summarizes the whole sentence — dimly. To predict the next word, the network uses only this vector. Everything it will ever know about the sentence must fit in there.</>
              ),
          }))}
        />
        <KeyIdea>
          The RNN's bet: compress <Term>everything read so far</Term> into one fixed-size vector,
          updated word by word. It gives the model memory of arbitrary-length text with a tiny,
          reusable network — a genuinely beautiful idea that powered translation and speech
          systems for two decades.
        </KeyIdea>
      </Section>

      <Section title="The fading-memory problem">
        <Analogy>
          Reading with an RNN is like listening to a story while only allowed to keep{' '}
          <em>one sticky note</em> of notes — and after every sentence you must rewrite the whole
          note to fit the new information. Details from the story's opening get summarized,
          re-summarized, and eventually smoothed out of existence. By chapter three, "the
          detective's sister" has become "someone important, probably".
        </Analogy>
        <List
          items={[
            <>
              <Term>Vanishing gradients over time:</Term> training an RNN backpropagates through
              every time step — a 100-word sentence is effectively a 100-layer network. The
              learning signal shrinks multiplicatively (Module 3's vanishing gradient, now in
              time), so the network <em>can't learn</em> to connect distant words even when it
              needs to.
            </>,
            <>
              <Term>One word at a time:</Term> step 57 needs step 56's output first. This
              sequential chain cannot be parallelized across a sentence — GPUs, whose whole
              superpower is doing 10,000 things at once, sit mostly idle. This bottleneck, more
              than anything, capped how big RNNs could get.
            </>,
          ]}
        />
        <WhyItMatters>
          RNNs matter today mostly as the <em>why</em> behind the transformer: its two designed
          advantages — attention instead of fading memory, parallelism instead of sequential
          reading — are point-by-point answers to RNN failures. (And the idea isn't dead:
          modern state-space models like Mamba, Module 18, are RNNs reborn with fixes, attractive
          precisely because a running summary is cheap at inference time.)
        </WhyItMatters>
        <Misconception>
          "RNNs failed because they were too simple." They failed at <em>scale</em>, not at
          concept. Given the same compute, an RNN spends it dribbling through words one by one
          while a transformer floods all words in parallel. The lesson that reshaped AI:
          architectures win not by being clever, but by being <em>trainable on more data with
          more hardware</em>.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What is the hidden state of an RNN?',
            options: [
              'A secret setting engineers hide',
              'A fixed-size vector holding a running summary of everything read so far',
              'The list of all previous words',
              'The network\u2019s weights',
            ],
            answer: 1,
            explanation:
              'The hidden state is the RNN\u2019s memory: one vector, overwritten at every step, that must compress the entire history. It is not a transcript — it\u2019s a lossy summary.',
          },
          {
            question: 'Why are RNNs painfully slow to train on modern GPUs?',
            options: [
              'They have too many weights',
              'Each step needs the previous step\u2019s result, so words can\u2019t be processed in parallel',
              'GPUs don\u2019t support recurrence',
              'They read words backwards',
            ],
            answer: 1,
            explanation:
              'The sequential dependency chain is the killer: a GPU that could process 10,000 words at once is forced to handle them one by one. Transformers removed exactly this constraint.',
          },
          {
            question: '"The girl who grew up in Paris, moved to Rome, and studied art speaks fluent ___." Why do plain RNNs struggle here?',
            options: [
              'The sentence is grammatically wrong',
              '"Paris" was read many steps ago and has been repeatedly overwritten in the fading hidden state',
              'French is hard to predict',
              'RNNs cannot handle names',
            ],
            answer: 1,
            explanation:
              'Each update partially overwrites the memory. Information from 15 words back survives only as a faint trace — and vanishing gradients mean the network struggles even to learn that it should preserve it.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>RNNs read word-by-word, maintaining a fixed-size <Term>hidden state</Term> — a running lossy summary.</>,
          <>Two fatal flaws: memory fades over distance (vanishing gradients through time), and sequential reading blocks GPU parallelism.</>,
          <>The transformer was engineered specifically to fix both.</>,
          <>The recurring lesson of AI history: the most <em>scalable</em> architecture wins, not the most intricate.</>,
        ]}
      />
    </article>
  )
}
