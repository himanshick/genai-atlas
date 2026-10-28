import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { StepThrough } from '../../components/learn/StepThrough'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#38bdf8'

/* --- tiny SVG scenes for the step-through --- */

function SceneTraining({ phase }: { phase: 0 | 1 | 2 }) {
  return (
    <svg viewBox="0 0 420 200" className="w-full max-w-md">
      {/* data stack */}
      <g opacity={phase === 0 ? 1 : 0.35}>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={20} y={60 + i * 22} width={70} height={18} rx={4} fill="#38bdf8" opacity={0.25 + i * 0.15} />
        ))}
        <text x={55} y={50} textAnchor="middle" fontSize={11} fill="#38bdf8" fontWeight={600}>
          examples
        </text>
        <text x={55} y={145} textAnchor="middle" fontSize={9} fill="#7b7b9e">
          input + right answer
        </text>
      </g>
      <path d="M 95 95 L 130 95" stroke="#7b7b9e" strokeWidth={1.5} markerEnd="url(#arr)" />

      {/* model box */}
      <g opacity={phase === 1 ? 1 : 0.5}>
        <rect x={140} y={55} width={110} height={80} rx={10} fill="#a78bfa22" stroke="#a78bfa" strokeWidth={1.5} />
        <text x={195} y={90} textAnchor="middle" fontSize={12} fill="#a78bfa" fontWeight={700}>
          model
        </text>
        <text x={195} y={108} textAnchor="middle" fontSize={9} fill="#a3a3c2">
          weights: adjustable
        </text>
      </g>
      <path d="M 255 95 L 290 95" stroke="#7b7b9e" strokeWidth={1.5} markerEnd="url(#arr)" />

      {/* compare + feedback */}
      <g opacity={phase === 2 ? 1 : 0.4}>
        <rect x={300} y={65} width={100} height={60} rx={10} fill="#f8717122" stroke="#f87171" strokeWidth={1.5} />
        <text x={350} y={90} textAnchor="middle" fontSize={11} fill="#f87171" fontWeight={700}>
          compare
        </text>
        <text x={350} y={106} textAnchor="middle" fontSize={9} fill="#a3a3c2">
          guess vs answer
        </text>
        {/* feedback arrow */}
        <path
          d="M 350 130 Q 350 175 195 175 Q 160 175 160 140"
          fill="none"
          stroke="#f87171"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          markerEnd="url(#arrRed)"
        />
        <text x={262} y={190} textAnchor="middle" fontSize={9.5} fill="#f87171">
          nudge every weight (gradient descent)
        </text>
      </g>

      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="#7b7b9e" />
        </marker>
        <marker id="arrRed" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="#f87171" />
        </marker>
      </defs>
    </svg>
  )
}

function SceneInference() {
  return (
    <svg viewBox="0 0 420 200" className="w-full max-w-md">
      <rect x={20} y={70} width={90} height={50} rx={10} fill="#34d39922" stroke="#34d399" strokeWidth={1.5} />
      <text x={65} y={92} textAnchor="middle" fontSize={11} fill="#34d399" fontWeight={700}>
        your prompt
      </text>
      <text x={65} y={108} textAnchor="middle" fontSize={9} fill="#a3a3c2">
        "write a haiku"
      </text>
      <path d="M 115 95 L 150 95" stroke="#7b7b9e" strokeWidth={1.5} markerEnd="url(#arr2)" />
      <rect x={160} y={55} width={110} height={80} rx={10} fill="#a78bfa22" stroke="#a78bfa" strokeWidth={1.5} />
      <text x={215} y={90} textAnchor="middle" fontSize={12} fill="#a78bfa" fontWeight={700}>
        model
      </text>
      <text x={215} y={108} textAnchor="middle" fontSize={9} fill="#a3a3c2">
        weights: 🔒 frozen
      </text>
      <path d="M 275 95 L 310 95" stroke="#7b7b9e" strokeWidth={1.5} markerEnd="url(#arr2)" />
      <rect x={320} y={70} width={80} height={50} rx={10} fill="#38bdf822" stroke="#38bdf8" strokeWidth={1.5} />
      <text x={360} y={92} textAnchor="middle" fontSize={11} fill="#38bdf8" fontWeight={700}>
        answer
      </text>
      <text x={360} y={108} textAnchor="middle" fontSize={9} fill="#a3a3c2">
        in milliseconds
      </text>
      <defs>
        <marker id="arr2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="#7b7b9e" />
        </marker>
      </defs>
    </svg>
  )
}

export default function TrainingVsInference() {
  return (
    <article>
      <Section title="Two lives of every model">
        <P>
          Every AI model lives two completely different lives. <Term>Training</Term> is school:
          months of processing examples, adjusting weights after every mistake, burning through
          megawatts on thousands of GPUs. <Term>Inference</Term> is the job: weights frozen, a
          prompt comes in, an answer goes out in milliseconds. When you chat with an LLM, you are
          always talking to a model in its inference life — school ended long ago.
        </P>
        <StepThrough
          accent={ACCENT}
          steps={[
            {
              title: 'Training, step 1: feed labeled examples',
              visual: <SceneTraining phase={0} />,
              caption: (
                <>
                  Millions of examples stream through: an input plus the answer we want. For an
                  LLM the "label" is simply the next word of real text — which is why the whole
                  internet can be its textbook without anyone labeling anything.
                </>
              ),
            },
            {
              title: 'Training, step 2: the model guesses',
              visual: <SceneTraining phase={1} />,
              caption: (
                <>
                  With its current weights, the model makes a prediction. Early in training the
                  weights are random, so the guesses are garbage — pure static.
                </>
              ),
            },
            {
              title: 'Training, step 3: compare and nudge — repeat a trillion times',
              visual: <SceneTraining phase={2} />,
              caption: (
                <>
                  The guess is compared to the truth, the loss is computed, and gradient descent
                  nudges <em>every</em> weight a tiny bit. One loop is cheap; a trillion loops on
                  a frontier model costs months and over $100 million of GPU time.
                </>
              ),
            },
            {
              title: 'Inference: the weights are frozen',
              visual: <SceneInference />,
              caption: (
                <>
                  Deployment flips one switch: weights stop changing. Now the model is a fixed
                  function — prompt in, answer out. No comparing, no nudging, no learning. Fast
                  and cheap per request… but multiplied by billions of requests a day.
                </>
              ),
            },
          ]}
        />
        <KeyIdea>
          Training changes the weights; inference only <Term>uses</Term> them. This single
          distinction explains half the practical facts about AI: why models have knowledge
          cutoffs, why they don't remember you between chats, and why "the model learned from my
          conversation" is (almost always) false.
        </KeyIdea>
      </Section>

      <Section title="Why your chatbot doesn't remember you">
        <Analogy>
          A published textbook is a trained model. Writing it took the author years of drafts and
          corrections (training). But once printed, reading it changes nothing — scribble notes
          in the margins all you like, next print run is identical (inference). When ChatGPT
          seems to "remember" earlier messages, that is not learning: the app quietly re-sends
          the whole conversation with every request. Close the chat, and it is a fresh copy of
          the book.
        </Analogy>
        <List
          items={[
            <>
              <Term>Knowledge cutoff:</Term> the model knows nothing after its training data was
              collected. New events require retraining or giving it documents at inference time
              (RAG, Module 10).
            </>,
            <>
              <Term>"Memory" features:</Term> products that remember you store notes in a normal
              database and paste them into the prompt — the weights never change.
            </>,
            <>
              <Term>Cost asymmetry:</Term> training is one enormous upfront cost; inference is a
              tiny cost paid billions of times. At ChatGPT scale, total inference spending
              dwarfs training — which is why so much engineering (quantization, caching, Module
              8 and 12) targets making inference cheaper.
            </>,
          ]}
        />
        <WhyItMatters>
          This distinction is the number-one source of public confusion about AI. "Does the AI
          learn from what I type?" — during your chat, no; your text may be <em>collected</em>{' '}
          and used in a future training run, which is a data-privacy question, not a live-learning
          one. Knowing the difference lets you reason clearly about privacy policies, knowledge
          cutoffs and why models need external tools for fresh information.
        </WhyItMatters>
        <Misconception>
          "GPT-5 got smarter since last month — it must be learning from users." When a deployed
          model improves, the provider swapped in a <em>newly trained</em> version (or changed
          the system prompt). The model you talked to yesterday did not learn overnight; it was
          replaced.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'You correct ChatGPT\u2019s mistake mid-conversation and it apologizes and gets it right. What happened to its weights?',
            options: [
              'They were updated by your correction',
              'Nothing — the correction only lives in the conversation text being re-sent each turn',
              'They were partially retrained',
              'They reset to random',
            ],
            answer: 1,
            explanation:
              'Inference never changes weights. The model appears to adapt because the full conversation (including your correction) is fed back in as context on every turn. Start a new chat, and the mistake can happen again.',
          },
          {
            question: 'Which phase consumes more total compute for a service like ChatGPT over its lifetime?',
            options: [
              'Training — it takes months on thousands of GPUs',
              'Inference — small per request, but multiplied by billions of requests',
              'They are exactly equal',
              'Neither uses much compute',
            ],
            answer: 1,
            explanation:
              'Training is a huge one-time cost, but serving billions of requests every day adds up to more. This is why inference optimization is a massive engineering field of its own.',
          },
        ]}
      />

      <Takeaways
        items={[
          <><Term>Training</Term>: weights change, costs millions, happens once (per version). <Term>Inference</Term>: weights frozen, costs micro-cents, happens billions of times.</>,
          <>You always interact with a frozen model — apparent memory is the conversation being re-sent, not learning.</>,
          <>Knowledge cutoffs exist because learning stopped the day training ended.</>,
          <>Improvements to deployed models come from swapping in newly trained versions.</>,
        ]}
      />
    </article>
  )
}
