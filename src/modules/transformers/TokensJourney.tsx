import { Section, P, Term, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { StepThrough } from '../../components/learn/StepThrough'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

/* ---- compact SVG scenes for each stage ---- */

function SceneText() {
  return (
    <svg viewBox="0 0 400 150" className="w-full max-w-md">
      <rect x={60} y={55} width={280} height={40} rx={10} fill="#1c1c30" stroke="#3d3d5c" />
      <text x={200} y={80} textAnchor="middle" fontSize={15} fill="#e8e8f4" fontFamily="monospace">
        "The cat sat on the"
      </text>
      <text x={200} y={125} textAnchor="middle" fontSize={10} fill="#7b7b9e">
        your prompt — plain text, unreadable to a neural network
      </text>
    </svg>
  )
}

function SceneTokenize() {
  const toks = [
    { t: 'The', id: 464 },
    { t: ' cat', id: 3797 },
    { t: ' sat', id: 3332 },
    { t: ' on', id: 319 },
    { t: ' the', id: 262 },
  ]
  return (
    <svg viewBox="0 0 400 150" className="w-full max-w-md">
      {toks.map((tok, i) => (
        <g key={i}>
          <rect x={30 + i * 70} y={45} width={62} height={30} rx={7} fill="#a78bfa20" stroke="#a78bfa" />
          <text x={61 + i * 70} y={64} textAnchor="middle" fontSize={11} fill="#e8e8f4" fontFamily="monospace">
            {tok.t}
          </text>
          <text x={61 + i * 70} y={95} textAnchor="middle" fontSize={10} fill="#7b7b9e" fontFamily="monospace">
            {tok.id}
          </text>
        </g>
      ))}
      <text x={200} y={128} textAnchor="middle" fontSize={10} fill="#7b7b9e">
        tokenizer: text → 5 integer IDs (Module 4)
      </text>
    </svg>
  )
}

function SceneEmbed() {
  return (
    <svg viewBox="0 0 400 160" className="w-full max-w-md">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <text x={50 + i * 70} y={30} textAnchor="middle" fontSize={10} fill="#7b7b9e" fontFamily="monospace">
            {[464, 3797, 3332, 319, 262][i]}
          </text>
          <path d={`M ${50 + i * 70} 38 L ${50 + i * 70} 52`} stroke="#7b7b9e" strokeWidth={1} markerEnd="url(#aTJ)" />
          {/* vector column */}
          {[0, 1, 2, 3, 4, 5].map((d) => (
            <rect
              key={d}
              x={38 + i * 70}
              y={58 + d * 13}
              width={24}
              height={11}
              rx={2}
              fill="#38bdf8"
              opacity={0.25 + ((i * 7 + d * 5) % 10) * 0.07}
            />
          ))}
        </g>
      ))}
      <text x={200} y={152} textAnchor="middle" fontSize={10} fill="#7b7b9e">
        each ID looks up its embedding vector + position stamp is added
      </text>
      <defs>
        <marker id="aTJ" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7" fill="#7b7b9e" />
        </marker>
      </defs>
    </svg>
  )
}

function SceneLayer({ highlight }: { highlight: 'attn' | 'mlp' }) {
  return (
    <svg viewBox="0 0 400 170" className="w-full max-w-md">
      {/* residual stream */}
      <line x1={40} y1={140} x2={40} y2={20} stroke="#34d399" strokeWidth={4} opacity={0.7} />
      <text x={40} y={158} textAnchor="middle" fontSize={9} fill="#34d399">
        residual stream
      </text>

      {/* attention box */}
      <rect
        x={110}
        y={95}
        width={230}
        height={38}
        rx={9}
        fill={highlight === 'attn' ? '#a78bfa30' : '#1c1c30'}
        stroke={highlight === 'attn' ? '#a78bfa' : '#3d3d5c'}
        strokeWidth={highlight === 'attn' ? 2 : 1}
      />
      <text x={225} y={112} textAnchor="middle" fontSize={11} fill={highlight === 'attn' ? '#a78bfa' : '#7b7b9e'} fontWeight={700}>
        multi-head attention
      </text>
      <text x={225} y={126} textAnchor="middle" fontSize={8.5} fill="#7b7b9e">
        tokens exchange information ("the" learns about "cat sat on")
      </text>

      {/* mlp box */}
      <rect
        x={110}
        y={35}
        width={230}
        height={38}
        rx={9}
        fill={highlight === 'mlp' ? '#fb923c28' : '#1c1c30'}
        stroke={highlight === 'mlp' ? '#fb923c' : '#3d3d5c'}
        strokeWidth={highlight === 'mlp' ? 2 : 1}
      />
      <text x={225} y={52} textAnchor="middle" fontSize={11} fill={highlight === 'mlp' ? '#fb923c' : '#7b7b9e'} fontWeight={700}>
        MLP block
      </text>
      <text x={225} y={66} textAnchor="middle" fontSize={8.5} fill="#7b7b9e">
        each token consults stored knowledge (cats sit on mats, laps…)
      </text>

      {/* connections */}
      <path d="M 40 114 L 108 114" stroke="#7b7b9e" strokeWidth={1.2} />
      <path d="M 340 114 Q 370 114 370 95 Q 370 80 44 76" fill="none" stroke="#fbbf24" strokeWidth={1.2} strokeDasharray="4 3" />
      <path d="M 40 54 L 108 54" stroke="#7b7b9e" strokeWidth={1.2} />
      <path d="M 340 54 Q 370 54 370 38 Q 370 24 44 22" fill="none" stroke="#fbbf24" strokeWidth={1.2} strokeDasharray="4 3" />
    </svg>
  )
}

function SceneStack() {
  return (
    <svg viewBox="0 0 400 170" className="w-full max-w-md">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} opacity={0.35 + i * 0.16}>
          <rect x={120} y={128 - i * 26} width={160} height={20} rx={6} fill="#a78bfa20" stroke="#a78bfa" strokeWidth={0.9} />
          <text x={200} y={142 - i * 26} textAnchor="middle" fontSize={9} fill="#a3a3c2">
            layer {i === 4 ? '…96' : i + 1}
          </text>
        </g>
      ))}
      <path d="M 200 160 L 200 152" stroke="#7b7b9e" strokeWidth={1.5} markerEnd="url(#aTJ2)" />
      <text x={318} y={80} fontSize={9.5} fill="#7b7b9e">
        meaning refines
      </text>
      <text x={318} y={93} fontSize={9.5} fill="#7b7b9e">
        layer by layer
      </text>
      <defs>
        <marker id="aTJ2" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7" fill="#7b7b9e" />
        </marker>
      </defs>
    </svg>
  )
}

function SceneLogits() {
  const preds = [
    { w: 'mat', p: 0.42, c: '#34d399' },
    { w: 'floor', p: 0.18, c: '#38bdf8' },
    { w: 'couch', p: 0.12, c: '#a78bfa' },
    { w: 'lap', p: 0.09, c: '#fb923c' },
    { w: 'roof', p: 0.05, c: '#f472b6' },
  ]
  return (
    <svg viewBox="0 0 400 170" className="w-full max-w-md">
      <text x={200} y={20} textAnchor="middle" fontSize={10.5} fill="#a3a3c2">
        "The cat sat on the ___" — scores for all ~100,000 tokens (top 5 shown)
      </text>
      {preds.map((p, i) => (
        <g key={p.w}>
          <text x={95} y={49 + i * 26} textAnchor="end" fontSize={11} fill="#e8e8f4" fontFamily="monospace">
            {p.w}
          </text>
          <rect x={105} y={38 + i * 26} width={p.p * 520} height={16} rx={4} fill={p.c} opacity={0.85} />
          <text x={112 + p.p * 520} y={50 + i * 26} fontSize={9.5} fill="#a3a3c2" fontFamily="monospace">
            {(p.p * 100).toFixed(0)}%
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function TokensJourney() {
  return (
    <article>
      <Section title="The whole machine, end to end">
        <P>
          You now hold every piece: tokens, embeddings, attention, MLPs, residuals, masks. Time
          to assemble them and follow one prompt — <Term>"The cat sat on the"</Term> — through an
          entire GPT-style model, from keystroke to prediction.
        </P>
        <StepThrough
          accent={ACCENT}
          steps={[
            {
              title: '1 · Text arrives',
              visual: <SceneText />,
              caption: (
                <>You type five words. To the network this is just a string of characters — completely opaque. Everything that follows exists to turn this into numbers, transform those numbers, and turn the result back into language.</>
              ),
            },
            {
              title: '2 · Tokenize',
              visual: <SceneTokenize />,
              caption: (
                <>The tokenizer (a plain program, no neurons) chops the text into 5 tokens and looks up their IDs in its fixed vocabulary. Note "␣cat" carries its leading space — from here on, the model deals only in these integers.</>
              ),
            },
            {
              title: '3 · Embed + stamp positions',
              visual: <SceneEmbed />,
              caption: (
                <>Each ID indexes into the embedding table, retrieving its meaning-vector (thousands of dimensions; 6 shown). A positional stamp is added so "the"#1 and "the"#5 are distinguishable. These vectors are the residual stream's starting state.</>
              ),
            },
            {
              title: '4 · Attention: tokens talk',
              visual: <SceneLayer highlight="attn" />,
              caption: (
                <>Inside layer 1, every token queries every earlier token (causal mask!). "sat" pulls in who did the sitting; the final "the" gathers hints that a sit-on-able object must follow. Communication only — nothing looked up yet.</>
              ),
            },
            {
              title: '5 · MLP: tokens think',
              visual: <SceneLayer highlight="mlp" />,
              caption: (
                <>Each enriched token then passes alone through the MLP's detector bank, retrieving stored knowledge: cat-facts, sitting-facts, idioms about mats. Both results are added onto the residual stream — edits, not rewrites.</>
              ),
            },
            {
              title: '6 · Repeat ×96',
              visual: <SceneStack />,
              caption: (
                <>The talk-then-think cycle repeats through dozens of layers. Early layers resolve syntax; middle layers assemble meaning; late layers become increasingly consumed with one question: what comes next? Meaning sharpens with every floor.</>
              ),
            },
            {
              title: '7 · Score every possible next token',
              visual: <SceneLogits />,
              caption: (
                <>The final vector of the LAST token — which has absorbed the whole sentence — is projected against the entire vocabulary, producing ~100,000 scores, softmaxed into probabilities. "mat" leads. A sampler picks one (Module 8), it's appended, and the whole journey runs again for the next word. That loop, repeated, is every chatbot reply you've ever read.</>
              ),
            },
          ]}
        />
        <KeyIdea>
          A GPT is a <Term>pipeline with one loop</Term>: tokenize → embed → (attend, think) ×
          layers → score vocabulary → sample one token → append → repeat. Every capability you've
          seen — essays, code, reasoning — is this loop running once per token, a few dozen
          tokens per second.
        </KeyIdea>
      </Section>

      <Section title="Standing back from the machine">
        <Analogy>
          The journey resembles a newsroom producing one word of tomorrow's paper: wire copy
          arrives (text), gets sorted into standard pieces (tokens), each piece is briefed with
          background (embeddings), then dozens of editorial rounds alternate between meetings
          (attention) and desk research (MLPs), until the editor-in-chief (final layer) polls
          every word in the dictionary and prints the winner. Then — absurdly, wonderfully — the
          whole newsroom reconvenes to choose the <em>next</em> word.
        </Analogy>
        <WhyItMatters>
          This mental model makes practical facts obvious. <Term>Why is long context
          expensive?</Term> Step 4 compares all pairs — O(n²). <Term>Why does output stream
          word-by-word?</Term> The loop genuinely runs once per token. <Term>Why do costs scale
          with output length?</Term> Same reason. <Term>What's a KV cache?</Term> (Module 8): a
          way to avoid redoing steps 2–6 for old tokens each iteration. You can now reason about
          LLM behavior from first principles instead of folklore.
        </WhyItMatters>
        <Misconception>
          "The model plans its whole answer, then types it out." There is no plan buffer — the
          model commits to one token at a time, and each choice becomes irrevocable context for
          the next. The apparent coherence of long answers emerges because each step conditions
          on everything before it. This one-way street is also why early errors compound (a
          hallucination theme for Module 8) and why "thinking" models that draft before
          answering (Module 18) change the game.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Which token\u2019s final vector is used to predict the next word?',
            options: [
              'The first token\u2019s',
              'The last token\u2019s — after attention it has absorbed the entire prefix',
              'An average of all tokens',
              'A special planning token',
            ],
            answer: 1,
            explanation:
              'Under the causal mask, the last position is the only one that has seen everything. Its final-layer vector is matched against the vocabulary to score all possible continuations.',
          },
          {
            question: 'To generate a 200-token answer, how many times does the full model run?',
            options: [
              'Once',
              '~200 times — once per generated token, each time on the grown sequence',
              'Twice: draft and final',
              '96 times, once per layer',
            ],
            answer: 1,
            explanation:
              'Generation is a loop: predict → append → run again. This is why output streams token-by-token and why long answers cost proportionally more.',
          },
          {
            question: 'What alternates inside every one of the ~96 layers?',
            options: [
              'Training and inference',
              'Attention (tokens exchange info) and MLP (each token consults stored knowledge)',
              'Encoding and decoding',
              'Compression and decompression',
            ],
            answer: 1,
            explanation:
              'Talk then think: communication across tokens, then per-token knowledge lookup — with both results added to the residual stream.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Full pipeline: tokenize → embed+position → (attention + MLP) × layers → vocabulary scores → sample → append → repeat.</>,
          <>One loop iteration per generated token — the source of streaming output and per-token pricing.</>,
          <>No planning buffer: coherence emerges from conditioning on everything so far, and early errors compound.</>,
          <>You can now derive LLM behaviors (cost, latency, context limits) from the machine itself.</>,
        ]}
      />
    </article>
  )
}
