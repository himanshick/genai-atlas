import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const ROUNDS = [
  {
    prefix: 'The opposite of hot is',
    options: ['cold', 'warm', 'ice', 'blue'],
    dist: [78, 9, 8, 1],
    lesson: 'To win this round, a model must learn ANTONYMS — pure language structure.',
  },
  {
    prefix: 'The capital of Japan is',
    options: ['Tokyo', 'Kyoto', 'Osaka', 'Japan'],
    dist: [86, 7, 3, 1],
    lesson: 'To win this one, it must memorize WORLD FACTS. Geography enters the weights.',
  },
  {
    prefix: 'She poured coffee into her',
    options: ['cup', 'mug', 'shoe', 'thermos'],
    dist: [46, 34, 1, 12],
    lesson: 'This requires PHYSICAL COMMON SENSE — liquids go in containers, not footwear.',
  },
  {
    prefix: '2 + 2 =',
    options: ['4', '5', '22', '3'],
    dist: [91, 2, 4, 1],
    lesson: 'And this requires ARITHMETIC. Math is in the text too.',
  },
  {
    prefix: 'He dropped the glass and it',
    options: ['shattered', 'apologized', 'flew', 'sang'],
    dist: [81, 1, 6, 1],
    lesson: 'CAUSE AND EFFECT: gravity and fragility, learned from descriptions of the world.',
  },
]

function NextTokenGame() {
  const [round, setRound] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const r = ROUNDS[round]

  return (
    <WidgetShell
      title="Play the pretraining game yourself"
      hint="Guess the next word — then see what winning requires"
      accent={ACCENT}
    >
      <div className="rounded-lg bg-ink-950/70 p-5">
        <div className="font-mono text-lg text-ink-100">
          {r.prefix} <span className="animate-pulse text-part2">▁▁▁</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {r.options.map((opt, i) => (
            <button
              key={opt}
              onClick={() => setPicked(i)}
              disabled={picked !== null}
              className="rounded-lg border px-3 py-2.5 font-mono text-sm transition disabled:cursor-default"
              style={{
                borderColor: picked !== null && i === 0 ? '#34d399' : picked === i ? ACCENT : 'var(--color-ink-700)',
                background: picked !== null && i === 0 ? '#34d39915' : picked === i ? `${ACCENT}15` : 'transparent',
                color: picked !== null && i === 0 ? '#34d399' : 'var(--color-ink-200)',
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {picked !== null && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <div className="space-y-1.5">
              {r.options.map((opt, i) => (
                <div key={opt} className="flex items-center gap-2">
                  <span className="w-20 font-mono text-xs text-ink-300">{opt}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-800">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: i === 0 ? '#34d399' : '#3d3d5c' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${r.dist[i]}%` }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                    />
                  </div>
                  <span className="w-9 text-right font-mono text-[10px] text-ink-400">{r.dist[i]}%</span>
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-lg bg-ink-850 p-3 text-sm leading-relaxed text-ink-300">
              <span className="font-semibold text-part2">The point: </span>
              {r.lesson}
            </p>
            <button
              onClick={() => {
                setRound((round + 1) % ROUNDS.length)
                setPicked(null)
              }}
              className="mt-3 rounded-lg px-4 py-2 text-sm font-bold text-ink-950"
              style={{ background: ACCENT }}
            >
              Next round →
            </button>
          </motion.div>
        )}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        A pretraining run plays this game roughly a <em>quadrillion</em> times (trillions of
        tokens × thousands of passes through batches), nudging weights after every guess. Bars
        show a plausible model probability distribution — the model never "picks one answer", it
        scores them all.
      </p>
    </WidgetShell>
  )
}

export default function Pretraining() {
  return (
    <article>
      <Section title="One dumb game, played a quadrillion times">
        <P>
          Everything GPT knows was learned from a single training objective, and you already met
          it in Module 5's n-grams: <Term>predict the next token</Term>. Take a chunk of
          internet text, hide the ending, ask the model to score every possible next token,
          grade it against what actually came next, backpropagate, repeat. That's{' '}
          <Term>pretraining</Term> — the "P" in GPT (Generative <em>Pre-trained</em>{' '}
          Transformer). There is no other secret. No grammar lessons, no fact database, no logic
          rules.
        </P>
        <P>The magic is in what the game silently demands. Play a few rounds:</P>
        <NextTokenGame />
        <KeyIdea>
          Next-token prediction is a <Term>forcing function for understanding</Term>. Because
          human text is saturated with facts, logic, physics, emotion and code, predicting it
          well eventually requires <em>modeling the processes that produced it</em>. The game is
          trivial to state and bottomless to master — that combination is why it works.
        </KeyIdea>
      </Section>

      <Section title="Compression is understanding">
        <Analogy>
          Imagine being paid to predict the next line of every play, textbook, argument and
          codebase ever written. At first you'd learn cheap tricks: "the" is common, questions
          end with "?". To keep improving, you'd need grammar. Then facts. Then how people argue,
          how stories resolve, how proofs proceed. There is no ceiling of shallow tricks that
          wins this game — every point of improvement past the basics must be purchased with
          genuine structure. Your paycheck (the loss) doesn't care <em>how</em> you predict;
          understanding just happens to be the only strategy that keeps working.
        </Analogy>
        <List
          items={[
            <>
              <Term>Self-supervised:</Term> no human labels needed — the text is its own answer
              key. This is what lets training scale to trillions of tokens; labeling that much
              data would be impossible.
            </>,
            <>
              <Term>What a run looks like:</Term> months on tens of thousands of GPUs, weights
              synchronized across the fleet after every batch, loss curves watched like patient
              vitals, checkpoints saved in case of crashes. Cost: $10M–$1B+ depending on scale.
            </>,
            <>
              <Term>The result — a "base model":</Term> a magnificent alien. It completes text
              brilliantly but doesn't answer questions. Prompt it "What is the capital of
              France?" and it may continue "What is the capital of Spain? What is the capital
              of…" — because quiz lists look like that on the internet. Making it{' '}
              <em>helpful</em> is a separate stage (instruction tuning, later this module).
            </>,
          ]}
        />
        <WhyItMatters>
          Pretraining explains the character of LLMs: why they know astonishing amounts (the
          internet is in the weights, compressed), why their knowledge has a cutoff date (the
          game stopped), why they imitate styles so well (styles are predictive patterns), and
          why they can be confidently wrong (plausible-sounding text scores well even when
          false — the fingerprint we'll dust for in Module 8's hallucination page).
        </WhyItMatters>
        <Misconception>
          "It just memorizes the internet." Memorization provably happens for repeated text, but
          it can't be the main story: models are hundreds of times smaller than their training
          data (terabytes of text into ~hundreds of gigabytes of weights) and handle brand-new
          inputs. What fits through that compression funnel is <em>patterns</em>, not
          transcripts — closer to how you remember the plot of a book than its exact sentences.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What supervision does pretraining require?',
            options: [
              'Millions of human-labeled examples',
              'None beyond raw text — the next token IS the label',
              'Expert-written rules of grammar',
              'A database of verified facts',
            ],
            answer: 1,
            explanation:
              'Self-supervision is the scaling superpower: every stretch of text automatically provides both question (the prefix) and answer (the next token).',
          },
          {
            question: 'Why does getting REALLY good at next-token prediction produce knowledge and reasoning?',
            options: [
              'It doesn\u2019t — knowledge is added separately',
              'Human text is generated by knowledge and reasoning, so predicting it deeply requires modeling them',
              'The tokenizer contains the knowledge',
              'GPUs inject facts during training',
            ],
            answer: 1,
            explanation:
              'Past shallow statistics, the only way to keep reducing prediction error on text about the world is to model the world\u2019s regularities that shaped the text.',
          },
          {
            question: 'Fresh out of pretraining, a base model asked "What\u2019s the capital of France?" might list more quiz questions instead of answering. Why?',
            options: [
              'It doesn\u2019t know the answer',
              'It\u2019s completing text the way its training data suggests, not following instructions — helpfulness comes from later tuning',
              'The question was tokenized wrong',
              'It\u2019s being deliberately unhelpful',
            ],
            answer: 1,
            explanation:
              'Base models are pure continuers. On the internet, one quiz question is often followed by another. Instruction tuning (later in this module) is what converts continuation into conversation.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Pretraining = next-token prediction on trillions of tokens. That is the whole objective.</>,
          <>It's self-supervised — text labels itself — which is why it can scale to internet size.</>,
          <>Understanding emerges because it's the only strategy that keeps winning the game.</>,
          <>The output is a base model: an encyclopedic continuer, not yet an assistant.</>,
        ]}
      />
    </article>
  )
}
