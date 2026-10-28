import { useMemo, useState } from 'react'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell, LabeledSlider } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#38bdf8'

function SingleNeuron() {
  // Should I bring an umbrella? Inputs 0..10
  const [clouds, setClouds] = useState(7)
  const [humidity, setHumidity] = useState(5)
  const [forecast, setForecast] = useState(3)

  // Fixed learned weights + bias
  const w = { clouds: 0.55, humidity: 0.3, forecast: 0.9 }
  const bias = -7

  const { sum, out } = useMemo(() => {
    const s = clouds * w.clouds + humidity * w.humidity + forecast * w.forecast + bias
    return { sum: s, out: 1 / (1 + Math.exp(-s)) } // sigmoid squash
  }, [clouds, humidity, forecast])

  const fires = out > 0.5

  const inputs = [
    { label: '☁️ cloud cover', value: clouds, set: setClouds, weight: w.clouds, y: 45 },
    { label: '💧 humidity', value: humidity, set: setHumidity, weight: w.humidity, y: 115 },
    { label: '📻 rain forecast', value: forecast, set: setForecast, weight: w.forecast, y: 185 },
  ]

  return (
    <WidgetShell
      title="One neuron: should I bring an umbrella?"
      hint="Drag the evidence sliders and watch the neuron vote"
      accent={ACCENT}
    >
      <div className="grid items-center gap-5 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {inputs.map((inp) => (
            <LabeledSlider
              key={inp.label}
              label={`${inp.label} (weight ${inp.weight})`}
              value={inp.value}
              min={0}
              max={10}
              step={0.5}
              onChange={inp.set}
              display={inp.value.toFixed(1)}
              accent={ACCENT}
            />
          ))}
        </div>

        <svg viewBox="0 0 340 230" className="w-full">
          {/* input nodes + weighted connections */}
          {inputs.map((inp) => {
            const strength = Math.min(1, (inp.value * inp.weight) / 6)
            return (
              <g key={inp.label}>
                <line
                  x1={72}
                  y1={inp.y}
                  x2={185}
                  y2={115}
                  stroke={ACCENT}
                  strokeWidth={1 + strength * 5}
                  opacity={0.25 + strength * 0.7}
                />
                <circle cx={55} cy={inp.y} r={17} fill="#1c1c30" stroke="#3d3d5c" />
                <text x={55} y={inp.y + 4} textAnchor="middle" fontSize={11}>
                  {inp.label.slice(0, 2)}
                </text>
                <text x={122} y={(inp.y + 115) / 2 - 6} fontSize={9} fill="#7b7b9e" textAnchor="middle">
                  ×{inp.weight}
                </text>
              </g>
            )
          })}

          {/* neuron body */}
          <circle
            cx={210}
            cy={115}
            r={30}
            fill={fires ? '#38bdf830' : '#1c1c30'}
            stroke={fires ? ACCENT : '#3d3d5c'}
            strokeWidth={2.5}
          />
          <text x={210} y={110} textAnchor="middle" fontSize={10} fill="#a3a3c2">
            add up,
          </text>
          <text x={210} y={124} textAnchor="middle" fontSize={10} fill="#a3a3c2">
            then squash
          </text>

          {/* output */}
          <line x1={240} y1={115} x2={290} y2={115} stroke={fires ? ACCENT : '#3d3d5c'} strokeWidth={2} />
          <text x={296} y={104} fontSize={22}>
            {fires ? '🌂' : '😎'}
          </text>
          <text x={303} y={130} textAnchor="middle" fontSize={9.5} fill={fires ? ACCENT : '#7b7b9e'}>
            {fires ? 'umbrella!' : 'no need'}
          </text>

          {/* running math */}
          <text x={210} y={190} textAnchor="middle" fontSize={10.5} fill="#7b7b9e" fontFamily="monospace">
            sum = {sum.toFixed(2)} → squashed = {out.toFixed(2)}
          </text>
          <text x={210} y={207} textAnchor="middle" fontSize={9.5} fill="#7b7b9e">
            (bias −7 means "stay skeptical unless evidence piles up")
          </text>
        </svg>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-400">
        Notice the wire thickness: each input is multiplied by its weight, so the radio forecast
        (weight 0.9) moves the neuron three times more than humidity (weight 0.3). Learning, as
        you saw in Module 2, is precisely the process of finding these weights.
      </p>
    </WidgetShell>
  )
}

function LayersDiagram() {
  const layers = [4, 6, 6, 3]
  const xs = [40, 140, 240, 340]
  const nodeYs = (n: number) => Array.from({ length: n }, (_, i) => 30 + (i * 170) / Math.max(1, n - 1))
  return (
    <svg viewBox="0 0 380 230" className="mx-auto my-6 w-full max-w-lg">
      {layers.slice(0, -1).map((n, li) =>
        nodeYs(n).map((y1, i) =>
          nodeYs(layers[li + 1]).map((y2, j) => (
            <line
              key={`${li}-${i}-${j}`}
              x1={xs[li]}
              y1={y1}
              x2={xs[li + 1]}
              y2={y2}
              stroke="#3d3d5c"
              strokeWidth={0.6}
              opacity={0.55}
            />
          )),
        ),
      )}
      {layers.map((n, li) =>
        nodeYs(n).map((y, i) => (
          <circle
            key={`n${li}-${i}`}
            cx={xs[li]}
            cy={y}
            r={9}
            fill={li === 0 ? '#38bdf8' : li === layers.length - 1 ? '#f472b6' : '#a78bfa'}
            opacity={0.85}
          />
        )),
      )}
      <text x={40} y={225} textAnchor="middle" fontSize={10} fill="#38bdf8">
        input layer
      </text>
      <text x={190} y={225} textAnchor="middle" fontSize={10} fill="#a78bfa">
        hidden layers
      </text>
      <text x={340} y={225} textAnchor="middle" fontSize={10} fill="#f472b6">
        output layer
      </text>
    </svg>
  )
}

export default function NeuronsAndLayers() {
  return (
    <article>
      <Section title="A neuron is a tiny voting machine">
        <P>
          Everything in deep learning is built from one absurdly simple unit. An artificial{' '}
          <Term>neuron</Term> does three things: it takes several input numbers, multiplies each
          by a <Term>weight</Term> (how much that input's opinion counts), adds them up along
          with a <Term>bias</Term> (a built-in lean), and squashes the result into a tidy output.
          That's it. No memory, no logic, no magic.
        </P>
        <SingleNeuron />
        <KeyIdea>
          A neuron = <Term>weighted vote + squash</Term>. The weights encode what the neuron pays
          attention to; the bias encodes its default skepticism; the squash (the{' '}
          <em>activation function</em>, next concept) turns the raw tally into a clean signal for
          the next neuron.
        </KeyIdea>
      </Section>

      <Section title="Stacking votes into layers">
        <P>
          One umbrella-neuron is trivial. The power move is composition: wire many neurons in
          parallel to form a <Term>layer</Term>, then feed that layer's outputs into another
          layer, and another. Each neuron in the next layer votes on <em>the votes of the
          previous layer</em>.
        </P>
        <LayersDiagram />
        <List
          items={[
            <>
              <Term>Input layer:</Term> the raw numbers — pixel brightnesses, token embeddings,
              sensor readings. Not really neurons, just the data's entry point.
            </>,
            <>
              <Term>Hidden layers:</Term> the workhorses. Each learns to detect increasingly
              abstract features of the input (much more on this in "Why Depth Matters").
            </>,
            <>
              <Term>Output layer:</Term> the final verdict, shaped for the task — one neuron per
              class for classification, or one per vocabulary word for a language model choosing
              the next token.
            </>,
          ]}
        />
        <Analogy>
          Think of a company hierarchy. Front-line staff (first layer) each watch one small thing
          — a dial, a queue, a door. Team leads (second layer) combine several staff reports into
          "the warehouse is busy". Directors (third layer) combine leads' summaries into "demand
          is spiking". The CEO (output) hears three refined signals and decides. Nobody in the
          building is smart alone; the <em>structure</em> is smart.
        </Analogy>
        <WhyItMatters>
          When you read "GPT-4 has ~1.8 trillion parameters", you can now decode it: parameters
          are exactly these weights and biases — the vote-strengths on the wires. Model size,
          memory use, and inference cost all scale with the number of wires. And "neural
          architecture" (Modules 5–6) is nothing but the wiring diagram: which neurons connect to
          which.
        </WhyItMatters>
        <Misconception>
          "Artificial neurons work like brain neurons." Only as loose inspiration. Real neurons
          spike in time, run on chemistry, and are vastly more complex. The artificial version
          kept one idea — many weighted inputs, one output — because it happens to be
          mathematically trainable at scale. Deep learning is not simulated biology; it is
          engineering that borrowed a metaphor.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What are the "parameters" counted in headlines like "a 70-billion-parameter model"?',
            options: [
              'The number of neurons',
              'The weights and biases — the learned vote-strengths',
              'The number of training examples',
              'The number of layers',
            ],
            answer: 1,
            explanation:
              'Parameters are the adjustable numbers: one weight per connection plus one bias per neuron. Neurons are the units; parameters are the knobs on their wires — and there are far more wires than neurons.',
          },
          {
            question: 'In the umbrella neuron, the radio forecast had weight 0.9 and humidity 0.3. What does that mean?',
            options: [
              'The forecast input arrives faster',
              'The neuron treats the forecast as 3x more influential evidence than humidity',
              'Humidity is measured in different units',
              'The forecast is always correct',
            ],
            answer: 1,
            explanation:
              'A weight is influence. The same input value moves the neuron\u2019s total three times as much through a 0.9 wire as through a 0.3 wire. Training discovered that forecasts predict rain better than humidity.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>A neuron: multiply inputs by weights, add a bias, squash. A weighted vote — nothing more.</>,
          <>Layers stack votes on votes; intelligence emerges from the structure, not from any single unit.</>,
          <>"Parameters" = all the weights and biases. Model size is a count of wires.</>,
          <>The metaphor with brains is loose — this is trainable math, not simulated biology.</>,
        ]}
      />
    </article>
  )
}
