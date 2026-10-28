import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const STEPS = [
  {
    text: 'The',
    dist: [
      { t: 'The', p: 0.31 },
      { t: 'In', p: 0.18 },
      { t: 'A', p: 0.12 },
    ],
    comment: 'Prompt: "Cite a paper on transformer efficiency." A helpful-sounding answer begins. Every step so far: perfectly reasonable.',
  },
  {
    text: 'The paper "Efficient',
    dist: [
      { t: 'Efficient', p: 0.22 },
      { t: 'Sparse', p: 0.17 },
      { t: 'Fast', p: 0.13 },
    ],
    comment: '"Efficient" is a very plausible word in an AI paper title. The model isn\u2019t consulting a library — it\u2019s continuing a pattern that looks like a citation.',
  },
  {
    text: 'The paper "Efficient Transformers: A',
    dist: [
      { t: 'A', p: 0.41 },
      { t: 'Scaling', p: 0.2 },
      { t: 'New', p: 0.11 },
    ],
    comment: 'Paper titles love the "X: A Y" format. The statistical pull of academic style is strong — each token is the locally likely one.',
  },
  {
    text: 'The paper "Efficient Transformers: A Survey" by Chen',
    dist: [
      { t: 'Chen', p: 0.09 },
      { t: 'Wang', p: 0.08 },
      { t: 'Smith', p: 0.07 },
    ],
    comment: 'Now a name is needed. "Chen" is a common author name — probability spread thin across many names, none of them "retrieved", all of them plausible. The die is cast…',
  },
  {
    text: 'The paper "Efficient Transformers: A Survey" by Chen et al. (2021) showed…',
    dist: [
      { t: '(2021)', p: 0.24 },
      { t: '(2020)', p: 0.21 },
      { t: '(2022)', p: 0.19 },
    ],
    comment: 'A completed, confident, fully-formatted citation — for a paper that may not exist. (A real "Efficient Transformers: A Survey" exists by Tay et al.! Close-but-wrong is hallucination\u2019s signature.) No step "lied"; the pipeline did exactly its job: produce likely text.',
  },
]

function HallucinationAnatomy() {
  const [step, setStep] = useState(0)
  const s = STEPS[step]

  return (
    <WidgetShell
      title="Anatomy of a fabricated citation"
      hint="Watch a hallucination assemble itself, one perfectly reasonable token at a time"
      accent={ACCENT}
    >
      <div className="rounded-lg bg-ink-950/70 p-4">
        <div className="min-h-[52px] font-mono text-sm leading-relaxed text-ink-100">
          {s.text}
          <span className="animate-pulse text-part2">▌</span>
        </div>

        <div className="mt-3 border-t border-ink-800 pt-3">
          <div className="mb-2 text-[10px] font-semibold tracking-wider text-ink-400 uppercase">
            top candidates for the highlighted continuation
          </div>
          <div className="space-y-1.5">
            {s.dist.map((d, i) => (
              <div key={d.t} className="flex items-center gap-2">
                <span className="w-16 font-mono text-xs" style={{ color: i === 0 ? '#a78bfa' : '#7b7b9e' }}>
                  {d.t}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-800">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: i === 0 ? ACCENT : '#3d3d5c' }}
                    animate={{ width: `${d.p * 220}px` }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-[10px] text-ink-400">{(d.p * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.p
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-3 rounded-lg bg-ink-850 p-3 text-xs leading-relaxed text-ink-300"
      >
        {s.comment}
      </motion.p>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setStep((x) => Math.max(0, x - 1))}
          disabled={step === 0}
          className="rounded-lg border border-ink-700 px-3 py-2 text-sm text-ink-300 disabled:opacity-40"
        >
          ← back
        </button>
        <button
          onClick={() => setStep((x) => Math.min(STEPS.length - 1, x + 1))}
          disabled={step === STEPS.length - 1}
          className="rounded-lg px-4 py-2 text-sm font-bold text-ink-950 disabled:opacity-40"
          style={{ background: ACCENT }}
        >
          next token →
        </button>
      </div>
    </WidgetShell>
  )
}

export default function WhyHallucinations() {
  return (
    <article>
      <Section title="Not a bug — the objective, working as designed">
        <P>
          You now have every piece needed to see hallucination clearly, and the conclusion is
          uncomfortable: a language model fabricating a citation is <Term>doing its job
          correctly</Term>. Its training objective (Module 7) is "produce likely text" — and a
          well-formatted citation with a plausible author is <em>extremely likely text</em>,
          whether or not the paper exists. Nothing in the machinery checks reality, because no
          part of the machinery has access to reality — only to the statistics of text.
        </P>
        <HallucinationAnatomy />
        <KeyIdea>
          Hallucination = the gap between <Term>likely</Term> and <Term>true</Term>, exposed.
          Where the training data is dense (famous facts, common code), likely ≈ true and the
          model shines. Where data is sparse (niche papers, your company's API, small-town
          history), the model still must emit <em>some</em> high-probability continuation — and
          plausible-but-invented is what maximum-likelihood fills the void with. Same process
          produces both brilliance and fabrication; that's why you can't "just remove" it.
        </KeyIdea>
      </Section>

      <Section title="Why it survives training — and even gets rewarded">
        <Analogy>
          A student graded for years on multiple-choice exams with <em>no penalty for wrong
          answers</em> learns one meta-lesson: never leave a blank. LLM training is exactly
          that exam. Pretraining never rewards "I don't know" (the actual next token is never
          "I don't know" mid-sentence); RLHF (Module 7) makes it worse — labelers prefer
          confident, complete-sounding answers over hedged ones when they can't verify facts.
          We literally trained the guess-with-confidence policy in, twice.
        </Analogy>
        <List
          items={[
            <>
              <Term>Compounding (Module 6's one-way street):</Term> each generated token becomes
              gospel context for the next. Once "by Chen" is emitted, the model{' '}
              <em>coherently elaborates</em> the fake — year, findings, journal — because
              consistency-with-context is precisely its skill.
            </>,
            <>
              <Term>No internal fact/pattern boundary:</Term> knowledge lives smeared across MLP
              weights (Module 6) — retrieval of a memorized fact and generation of a plausible
              pattern <em>feel identical from inside</em>. The model has no flag marking which
              one just happened.
            </>,
            <>
              <Term>Softmax never says nothing:</Term> the machinery (this module) must produce
              a distribution every step. "Decline to continue" isn't a natural option — silence
              has no token.
            </>,
          ]}
        />
        <WhyItMatters>
          Knowing the mechanism turns you from victim into engineer. It predicts exactly when
          to distrust output: <Term>specifics in sparse territory</Term> (citations, URLs,
          niche numbers, minor biographies) — and when to relax (dense, popular knowledge). It
          explains why mitigations work the way they do: RAG (Module 10) densifies the
          territory by injecting real documents into context; tool use (Module 11) replaces
          recall with lookup; RL on verifiable rewards (Module 18) finally penalizes wrong
          answers; and asking the model for its uncertainty helps only modestly — the
          confidence signal itself is generated text.
        </WhyItMatters>
        <Misconception>
          "Bigger models will hallucinate their way to zero." Scale reduces error on dense
          knowledge but cannot close the structural gap: any generative model of finite weights
          asked about an infinite world must interpolate, and interpolation is invention. The
          realistic goal isn't zero — it's calibrated systems: models grounded by retrieval and
          tools, trained to abstain, wrapped in verification (Module 17) — and users who know
          which questions are the dangerous ones. You are now one of those users.
        </Misconception>
        <DeepDive title="Deep dive: could a model know that it doesn't know?">
          <P>
            Partially — and it's an active frontier. Probing experiments find internal signals
            that correlate with answer correctness (the model's activations "look different"
            when it's fabricating), suggesting some self-knowledge exists but doesn't control
            output. Approaches to surface it: training on calibrated refusals ("If unsure, say
            so" examples), semantic-entropy tests (sample 10 answers; wild disagreement =
            probable fabrication — usable today!), linear probes reading truthfulness
            directions (Module 4's vector arithmetic, weaponized for good). None fully solve
            it: the map of what the model knows about its own knowledge is itself learned, and
            itself imperfect.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Why does a model invent a plausible-sounding paper rather than saying "I don\u2019t know"?',
            options: [
              'It wants to impress users',
              'Its objective is likely text: a well-formed citation is high-probability; mid-pattern abstention basically never appears in training data',
              'A bug in the sampling code',
              'Papers are copyrighted so it must invent',
            ],
            answer: 1,
            explanation:
              'Maximum-likelihood training + RLHF preference for confident answers = fabrication is the trained-in optimal move where knowledge is sparse. The machine is working as designed; the design lacks a truth channel.',
          },
          {
            question: 'Why do hallucinations tend to be internally consistent (fake paper gets a fake year, journal, findings)?',
            options: [
              'The model plans the lie in advance',
              'Each generated token becomes context that later tokens must cohere with — the model elaborates its own fabrication',
              'Training data contains many fake papers',
              'Consistency is coded in the tokenizer',
            ],
            answer: 1,
            explanation:
              'Autoregression\u2019s one-way street: earlier output is indistinguishable from truth as context. Coherence-with-context is the model\u2019s core skill — applied to a false premise, it builds a convincing false edifice.',
          },
          {
            question: 'Which question is MOST likely to produce hallucination?',
            options: [
              '"What is the capital of France?"',
              '"List the publications of a moderately obscure professor"',
              '"Explain how photosynthesis works"',
              '"Write a poem about the sea"',
            ],
            answer: 1,
            explanation:
              'Sparse territory + demand for specifics = interpolation under pressure. Dense knowledge (capitals, photosynthesis) is safe; the poem can\u2019t be "wrong". Niche specifics are the danger zone — calibrate your trust accordingly.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Hallucination is the likely-vs-true gap: the model must emit probable text even where it has no knowledge.</>,
          <>Training rewards confident continuation twice (pretraining + RLHF); abstention was never really on the menu.</>,
          <>Autoregression compounds errors into coherent, elaborate fabrications.</>,
          <>Mitigation = grounding (RAG, tools), verification, calibrated abstention — and knowing which questions are dangerous.</>,
        ]}
      />
    </article>
  )
}
