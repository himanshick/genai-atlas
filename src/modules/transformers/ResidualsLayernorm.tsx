import { useState } from 'react'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

function HighwayDiagram() {
  const [residualsOn, setResidualsOn] = useState(true)

  const layers = [0, 1, 2, 3]

  return (
    <WidgetShell
      title="The residual highway"
      hint="Toggle the skip connections and watch what survives 4 layers"
      accent={ACCENT}
    >
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setResidualsOn(true)}
          className="flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition"
          style={{
            borderColor: residualsOn ? '#34d399' : 'var(--color-ink-700)',
            color: residualsOn ? '#34d399' : 'var(--color-ink-400)',
            background: residualsOn ? '#34d39914' : 'transparent',
          }}
        >
          With residual connections
        </button>
        <button
          onClick={() => setResidualsOn(false)}
          className="flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition"
          style={{
            borderColor: !residualsOn ? '#f87171' : 'var(--color-ink-700)',
            color: !residualsOn ? '#f87171' : 'var(--color-ink-400)',
            background: !residualsOn ? '#f8717114' : 'transparent',
          }}
        >
          Without (pre-2015 style)
        </button>
      </div>

      <svg viewBox="0 0 440 250" className="w-full rounded-lg bg-ink-950/70">
        {/* the highway */}
        {residualsOn && (
          <>
            <line x1={70} y1={225} x2={70} y2={25} stroke="#34d399" strokeWidth={5} opacity={0.85} />
            <text x={70} y={16} textAnchor="middle" fontSize={9.5} fill="#34d399" fontWeight={700}>
              residual stream
            </text>
          </>
        )}

        {/* input */}
        <rect x={30} y={222} width={80} height={22} rx={6} fill="#38bdf825" stroke="#38bdf8" />
        <text x={70} y={237} textAnchor="middle" fontSize={9.5} fill="#e8e8f4">
          input signal
        </text>

        {layers.map((l) => {
          const y = 185 - l * 47
          const opacity = residualsOn ? 1 : Math.max(0.15, 1 - l * 0.28)
          return (
            <g key={l} opacity={residualsOn ? 1 : 1}>
              {/* layer box */}
              <rect x={170} y={y - 14} width={130} height={32} rx={8} fill="#a78bfa18" stroke={ACCENT} strokeWidth={1.2} />
              <text x={235} y={y + 5} textAnchor="middle" fontSize={10} fill={ACCENT}>
                layer {l + 1} (attention + MLP)
              </text>

              {residualsOn ? (
                <>
                  {/* branch off, through layer, add back */}
                  <path d={`M 70 ${y} L 168 ${y}`} stroke="#7b7b9e" strokeWidth={1.3} markerEnd="url(#arrR)" />
                  <path d={`M 300 ${y} Q 340 ${y} 340 ${y - 18} Q 340 ${y - 34} 74 ${y - 38}`} fill="none" stroke="#fbbf24" strokeWidth={1.3} markerEnd="url(#arrRY)" />
                  <circle cx={70} cy={y - 39} r={7} fill="#10101c" stroke="#fbbf24" strokeWidth={1.3} />
                  <text x={70} y={y - 35.5} textAnchor="middle" fontSize={9} fill="#fbbf24">
                    +
                  </text>
                </>
              ) : (
                <>
                  {/* sequential chain: signal must pass THROUGH each layer */}
                  <path d={`M 235 ${y + 18} L 235 ${y + 33}`} stroke="#f87171" strokeWidth={1.5} opacity={opacity} markerEnd="url(#arrRRed)" />
                </>
              )}
            </g>
          )
        })}

        {!residualsOn && (
          <>
            {/* input feeds bottom layer */}
            <path d="M 110 233 Q 235 233 235 204" fill="none" stroke="#f87171" strokeWidth={1.5} markerEnd="url(#arrRRed)" />
            {/* degraded output */}
            <rect x={175} y={5} width={120} height={22} rx={6} fill="#f8717115" stroke="#f87171" strokeDasharray="4 3" />
            <text x={235} y={20} textAnchor="middle" fontSize={9.5} fill="#f87171">
              signal degraded ✕
            </text>
          </>
        )}
        {residualsOn && (
          <>
            <rect x={30} y={25} width={80} height={22} rx={6} fill="#34d39920" stroke="#34d399" />
            <text x={70} y={40} textAnchor="middle" fontSize={9.5} fill="#34d399">
              signal intact ✓
            </text>
          </>
        )}

        <defs>
          <marker id="arrR" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#7b7b9e" />
          </marker>
          <marker id="arrRY" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#fbbf24" />
          </marker>
          <marker id="arrRRed" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="#f87171" />
          </marker>
        </defs>
      </svg>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        With residuals, each layer computes a small <em>edit</em> that is added onto the intact
        green stream. Without them, the signal must survive being fully transformed by every
        layer in turn — after enough layers, both the signal (forward) and the learning gradient
        (backward) degrade into mush.
      </p>
    </WidgetShell>
  )
}

export default function ResidualsLayernorm() {
  return (
    <article>
      <Section title="The plumbing that makes 100 layers possible">
        <P>
          Attention gets the fame, but two humble components make deep transformers physically
          trainable. Without them, stacking 96 layers would produce garbage. The first is the{' '}
          <Term>residual connection</Term>: instead of each layer replacing its input
          (output = Layer(x)), each layer <em>adds to</em> its input:
          output = x + Layer(x). The layer computes an <Term>edit</Term>, not a rewrite.
        </P>
        <HighwayDiagram />
        <KeyIdea>
          Residuals create a <Term>protected highway</Term> running the full height of the
          network — the same trick as the LSTM's conveyor belt (Module 5), applied to depth
          instead of time. Information rides the highway by default; layers are exit ramps that
          make refinements and merge back. Gradients flow backward down the same highway
          unimpeded, which is why 100-layer training works at all.
        </KeyIdea>
      </Section>

      <Section title="The residual stream as a workspace">
        <Analogy>
          Think of a document passed around a company for review. Without residuals, each
          department <em>retypes the entire document from memory</em> before passing it on —
          after ten departments, the original is unrecognizable. With residuals, the document
          itself travels untouched and each department attaches sticky-note edits. The final
          document = original + all edits. Nothing is ever lost by default.
        </Analogy>
        <P>
          This picture — layers as edits accumulating on a shared stream — is so useful that
          interpretability researchers treat the <Term>residual stream</Term> as the transformer's
          central object: a workspace where attention heads write notes like "the subject is
          plural" and later layers read them. It's also why the same token embedding can enter
          the network and emerge transformed-but-recognizable at the top.
        </P>
      </Section>

      <Section title="LayerNorm: the volume control">
        <P>
          The second piece of plumbing: with hundreds of additions onto the stream, the numbers
          themselves can drift — growing huge or shrinking toward zero, landing in activation
          functions' dead zones and destabilizing training. <Term>Layer normalization</Term>{' '}
          fixes this by re-standardizing each token's vector (mean 0, spread 1, then a learned
          re-scale) before each block. Same information, healthy scale.
        </P>
        <List
          items={[
            <>
              <Term>Where it sits matters:</Term> original transformers normalized <em>after</em>{' '}
              each block ("post-norm"); modern LLMs normalize <em>before</em> ("pre-norm"), which
              keeps the highway even cleaner and trains far more stably. This tiny reordering
              was a genuine breakthrough for training very deep models.
            </>,
            <>
              <Term>Modern variant:</Term> most current LLMs (LLaMA family, etc.) use{' '}
              <Term>RMSNorm</Term> — a leaner LayerNorm that skips mean-centering. Cheaper, works
              just as well.
            </>,
          ]}
        />
        <Analogy title="Analogy for LayerNorm">
          A mastering engineer between every stage of a long effects chain: each pedal (layer)
          can boost or cut the signal, and after fifty pedals unchecked audio would be either
          deafening or inaudible. The engineer resets levels to a standard loudness after each
          stage — the <em>music</em> (relative pattern) is untouched; only the volume is tamed.
        </Analogy>
        <WhyItMatters>
          When you read a model card saying "pre-norm transformer with RMSNorm and rotary
          embeddings", you can now parse every word. More deeply: training instability — loss
          spikes, divergence at scale — is the monster that eats frontier training runs, and
          norm placement is a first-line defense. The difference between a $100M run that
          converges and one that explodes can literally be this plumbing.
        </WhyItMatters>
        <Misconception>
          "Residuals and norms are minor implementation details." History says otherwise:
          ResNets (residuals, 2015) won ImageNet and made deep vision possible; pre-norm made
          GPT-scale training stable. In deep learning, "plumbing" that governs signal and
          gradient flow is regularly the difference between an idea working at toy scale and
          working at world scale. Architecture = attention + MLP; <em>trainability</em> =
          residuals + norms.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What does output = x + Layer(x) mean in words?',
            options: [
              'The layer runs twice',
              'The layer computes an edit that gets added to the untouched input — nothing is lost by default',
              'The input is doubled',
              'The layer output is discarded',
            ],
            answer: 1,
            explanation:
              'The "+x" is the residual highway: the original signal always passes through intact, and the layer contributes a refinement on top.',
          },
          {
            question: 'Why do residual connections also fix the vanishing gradient problem for depth?',
            options: [
              'They add more parameters',
              'Gradients can flow backward along the addition path without being multiplied by anything at each layer',
              'They make the network shallower',
              'They increase the learning rate',
            ],
            answer: 1,
            explanation:
              'Backprop through "+" passes gradients through unchanged — the same protected-path logic as the LSTM cell state, applied across layers instead of time steps.',
          },
          {
            question: 'What is LayerNorm\u2019s job?',
            options: [
              'To normalize the training data',
              'To reset each token vector to a healthy numerical scale between blocks, keeping training stable',
              'To remove grammatical errors',
              'To compress the model',
            ],
            answer: 1,
            explanation:
              'Hundreds of accumulated additions would let magnitudes drift into unstable or dead zones. LayerNorm re-standardizes the scale while preserving the information pattern.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Residual connections: layers <Term>edit</Term> a protected stream instead of rewriting it — signal and gradients survive any depth.</>,
          <>The "residual stream as shared workspace" picture is the key to reading interpretability research.</>,
          <>LayerNorm/RMSNorm keeps numerical scale healthy between blocks; pre-norm placement made GPT-scale training stable.</>,
          <>The recurring principle (LSTM belts, residual highways): protect the path that information travels.</>,
        ]}
      />
    </article>
  )
}
