import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Section, P, Term, Takeaways } from '../../components/learn/Prose'
import { KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#38bdf8'

interface Era {
  name: string
  color: string
  events: { year: string; title: string; emoji: string; detail: string }[]
}

const eras: Era[] = [
  {
    name: 'The Dream (1950–2010)',
    color: '#7b7b9e',
    events: [
      {
        year: '1950',
        title: 'The Turing Test',
        emoji: '💭',
        detail:
          'Alan Turing asks: "Can machines think?" and proposes a test — if you chat with something and cannot tell it is a machine, does the difference matter? For 70 years this stays a thought experiment. Today, LLMs pass casual versions of it routinely.',
      },
      {
        year: '1957',
        title: 'The Perceptron',
        emoji: '🧠',
        detail:
          'Frank Rosenblatt builds the first artificial neuron — a machine that learns to classify simple images by adjusting weights. The press predicts walking, talking robots. A 1969 book showing its limits helps trigger the first "AI winter" of frozen funding.',
      },
      {
        year: '1986',
        title: 'Backpropagation goes mainstream',
        emoji: '🔄',
        detail:
          'Rumelhart, Hinton and Williams popularize the algorithm that lets multi-layer networks learn from mistakes (you will meet it in Module 3). The key ingredient of deep learning now exists — but computers are still a million times too slow to exploit it.',
      },
      {
        year: '1997',
        title: 'LSTM',
        emoji: '🧵',
        detail:
          'Hochreiter and Schmidhuber invent a network that can remember over long sequences without forgetting. For 20 years LSTMs quietly power translation, Siri and autocomplete — the best language tech before transformers.',
      },
    ],
  },
  {
    name: 'Deep Learning Ignites (2012–2016)',
    color: '#38bdf8',
    events: [
      {
        year: '2012',
        title: 'AlexNet wins ImageNet',
        emoji: '🖼️',
        detail:
          'A deep network trained on gaming GPUs crushes the world image-recognition contest, halving the error rate overnight. The field pivots en masse: GPUs + big data + deep nets works. Every lab, then every tech giant, goes all-in on deep learning.',
      },
      {
        year: '2014',
        title: 'GANs invented',
        emoji: '🎭',
        detail:
          'Ian Goodfellow devises Generative Adversarial Networks — a forger network and a detective network training against each other (Module 13). For the first time, machines generate photorealistic faces of people who do not exist. Modern generative image AI begins here.',
      },
      {
        year: '2014',
        title: 'Attention is born',
        emoji: '👀',
        detail:
          'Bahdanau and colleagues let translation models "look back" at any input word instead of relying on one squeezed summary vector. It seems like a small trick for translation. It becomes the single most important idea in modern AI.',
      },
    ],
  },
  {
    name: 'The Transformer Era (2017–2021)',
    color: '#a78bfa',
    events: [
      {
        year: '2017',
        title: '"Attention Is All You Need"',
        emoji: '⚡',
        detail:
          'Eight Google researchers throw away recurrence entirely and build a network from attention alone: the Transformer. It trains in parallel (fast!), scales beautifully, and becomes the architecture behind GPT, BERT, Stable Diffusion, AlphaFold — essentially everything in this atlas.',
      },
      {
        year: '2018',
        title: 'GPT-1 & BERT',
        emoji: '📚',
        detail:
          'Two recipes emerge: OpenAI\'s GPT generates text left-to-right; Google\'s BERT reads text bidirectionally for understanding. Both prove the same thing — pretrain a transformer on raw internet text, and it learns language itself, transferable to any task.',
      },
      {
        year: '2020',
        title: 'GPT-3 & scaling laws',
        emoji: '📈',
        detail:
          'OpenAI scales the same recipe 100x to 175 billion parameters — and abilities nobody programmed appear: translation, arithmetic, code. Scaling-law papers show performance improves predictably with size, turning AI progress into an engineering (and money) race.',
      },
      {
        year: '2021',
        title: 'DALL·E & CLIP',
        emoji: '🎨',
        detail:
          'OpenAI connects text and images: CLIP learns which captions match which pictures, DALL·E generates images from text descriptions. "Type what you want to see" becomes real, setting the stage for the image-generation explosion.',
      },
    ],
  },
  {
    name: 'GenAI Goes Public (2022–now)',
    color: '#f472b6',
    events: [
      {
        year: '2022',
        title: 'Stable Diffusion & Midjourney',
        emoji: '🌫️',
        detail:
          'Diffusion models (Module 13) — which generate images by reversing noise — go public. Stable Diffusion is fully open-source and runs on a gaming PC. Within months, millions of people are generating art, and "prompt" enters everyday vocabulary.',
      },
      {
        year: 'Nov 2022',
        title: 'ChatGPT',
        emoji: '💬',
        detail:
          'OpenAI wraps GPT-3.5 in a chat interface, aligned to be helpful via RLHF (Module 7). It reaches 100 million users in two months — the fastest-adopted product in history. GenAI stops being a research topic and becomes a household tool.',
      },
      {
        year: '2023',
        title: 'GPT-4 & the open-weights wave',
        emoji: '🌊',
        detail:
          'GPT-4 handles images and passes professional exams. Meta releases LLaMA\'s weights, igniting an open-model ecosystem (Mistral, and later DeepSeek) that puts near-frontier AI in anyone\'s hands. The closed-vs-open race that defines today begins.',
      },
      {
        year: '2024',
        title: 'Reasoning models & video',
        emoji: '🎬',
        detail:
          'OpenAI\'s o1 shows models can "think longer" before answering — trading compute at answer-time for accuracy (Module 18). Sora generates minute-long coherent video. Agents that use tools and browse start working reliably.',
      },
      {
        year: '2025+',
        title: 'The agentic era',
        emoji: '🤖',
        detail:
          'Models stop just chatting and start doing: writing and running code, operating browsers, coordinating as teams via protocols like MCP (Module 11). The open question shifts from "can AI understand?" to "what should we let it do?"',
      },
    ],
  },
]

function Timeline() {
  const [selected, setSelected] = useState<{ era: number; event: number }>({ era: 3, event: 1 })
  const current = eras[selected.era].events[selected.event]
  const currentColor = eras[selected.era].color

  return (
    <WidgetShell title="70 years in one timeline" hint="Click any event to read its story" accent={ACCENT}>
      <div className="grid gap-5 md:grid-cols-[1fr_1.1fr]">
        {/* Timeline rail */}
        <div className="thin-scroll max-h-[430px] overflow-y-auto pr-2">
          {eras.map((era, ei) => (
            <div key={era.name} className="mb-4">
              <div
                className="mb-2 font-display text-[11px] font-bold tracking-widest uppercase"
                style={{ color: era.color }}
              >
                {era.name}
              </div>
              <div className="space-y-1 border-l-2 pl-3" style={{ borderColor: `${era.color}44` }}>
                {era.events.map((ev, vi) => {
                  const active = selected.era === ei && selected.event === vi
                  return (
                    <button
                      key={ev.title}
                      onClick={() => setSelected({ era: ei, event: vi })}
                      className="relative flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition"
                      style={{
                        background: active ? `${era.color}1c` : 'transparent',
                        color: active ? 'var(--color-ink-100)' : 'var(--color-ink-400)',
                      }}
                    >
                      <span
                        className="absolute -left-[19.5px] h-2.5 w-2.5 rounded-full border-2"
                        style={{
                          borderColor: era.color,
                          background: active ? era.color : 'var(--color-ink-950)',
                        }}
                      />
                      <span className="font-mono text-[11px]" style={{ color: era.color }}>
                        {ev.year}
                      </span>
                      <span className="truncate font-medium">{ev.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Detail card */}
        <div className="min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selected.era}-${selected.event}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="sticky top-20 rounded-xl border p-5"
              style={{
                borderColor: `${currentColor}55`,
                background: `linear-gradient(160deg, ${currentColor}12, transparent 55%)`,
              }}
            >
              <div className="text-3xl">{current.emoji}</div>
              <div className="mt-2 font-mono text-xs" style={{ color: currentColor }}>
                {current.year}
              </div>
              <h4 className="mt-1 font-display text-xl font-bold text-ink-100">{current.title}</h4>
              <p className="mt-3 text-sm leading-[1.75] text-ink-300">{current.detail}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </WidgetShell>
  )
}

export default function HistoryOfGenai() {
  return (
    <article>
      <Section title="An overnight success, 70 years in the making">
        <P>
          ChatGPT felt like it appeared from nowhere in late 2022. In reality, almost every
          ingredient — artificial neurons, learning from mistakes, attention — had been invented
          decades earlier and sat waiting for computers fast enough and data big enough to make
          them shine. This timeline is the story of those ingredients coming together.
        </P>
        <Timeline />
        <KeyIdea>
          Progress in AI has never been a smooth line. It moves in <Term>step changes</Term>: a
          long quiet period, then one unlock — GPUs in 2012, the transformer in 2017, RLHF-powered
          chat in 2022 — after which everything reorganizes around the new idea within months.
        </KeyIdea>
      </Section>

      <Section title="The pattern behind the breakthroughs">
        <P>
          Look closely and each explosion has the same three preconditions, arriving in different
          orders:
        </P>
        <P>
          <Term>1. Compute catches up.</Term> Backpropagation existed in 1986; it needed 2012's
          gaming GPUs to matter. <Term>2. Data catches up.</Term> Neural networks are hungry — the
          web, and later the entire digitized human record, became the food.{' '}
          <Term>3. An architecture that scales.</Term> The transformer's superpower is not being
          clever — it is being <em>parallelizable</em>, so throwing 10,000 GPUs at it actually
          works.
        </P>
        <WhyItMatters>
          This pattern is your compass for evaluating AI news. When you hear a bold claim, ask:
          did compute, data, or architecture actually change — or is it repackaging? It also
          explains why progress keeps surprising experts: each unlock makes previously "decades
          away" things arrive in months.
        </WhyItMatters>
        <Misconception>
          "AI progress = smarter algorithms." Mostly false. The core algorithms of 2024's frontier
          models would be legible to a 1990s researcher. What changed is a{' '}
          <em>billion-fold</em> increase in compute, internet-scale data, and one architecture
          that could absorb both. Scale, not cleverness, drove the revolution — which is itself
          one of the deepest scientific surprises of the era (see Scaling Laws, Module 7).
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Why did the 2017 transformer architecture matter so much?',
            options: [
              'It was the first neural network',
              'It could train in parallel and scale almost without limit',
              'It was the first model to generate images',
              'It required less data than older models',
            ],
            answer: 1,
            explanation:
              'RNNs processed words one at a time, so you could not throw thousands of GPUs at them efficiently. Transformers process all words at once — parallelizable, and therefore scalable. Scale did the rest.',
          },
          {
            question: 'Backpropagation was popularized in 1986. Why did deep learning only take off around 2012?',
            options: [
              'The algorithm had a bug until 2012',
              'Nobody believed in it before',
              'Compute (GPUs) and large datasets finally caught up with the idea',
              'It was kept secret by governments',
            ],
            answer: 2,
            explanation:
              'The idea was ready; the hardware and data were not. AlexNet in 2012 combined the old algorithm with gaming GPUs and the million-image ImageNet dataset — and the error rate collapsed.',
          },
          {
            question: 'What made ChatGPT (Nov 2022) the breakout moment, given GPT-3 existed since 2020?',
            options: [
              'ChatGPT used a 100x bigger model',
              'A chat interface plus RLHF alignment made the raw model usable by anyone',
              'It was the first model on the internet',
              'It was open-source',
            ],
            answer: 1,
            explanation:
              'GPT-3 was a powerful but raw autocomplete engine, accessible only via API. ChatGPT wrapped similar capability in a conversation format and tuned it with human feedback to be helpful — packaging and alignment, not raw scale, created the moment.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>The core ideas are old: neurons (1957), backprop (1986), attention (2014). Scale made them work.</>,
          <>Every breakthrough required three things to align: <Term>compute, data, and a scalable architecture</Term>.</>,
          <>2012 (GPUs meet deep nets), 2017 (transformer) and 2022 (ChatGPT) are the three step-changes that created modern GenAI.</>,
          <>Progress is lumpy, not linear — expect long plateaus punctuated by sudden reorganizing unlocks.</>,
        ]}
      />
    </article>
  )
}
