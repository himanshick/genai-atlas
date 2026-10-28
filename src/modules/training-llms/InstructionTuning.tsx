import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const PROMPTS = [
  {
    prompt: 'What is the capital of France?',
    base: 'What is the capital of Spain? What is the capital of Italy? What is the capital of Germany? Answers on page 12.',
    tuned: 'The capital of France is Paris.',
    why: 'The base model continues the pattern "list of quiz questions" — statistically the most likely continuation on the web. The tuned model recognizes a question deserves an answer.',
  },
  {
    prompt: 'Write a haiku about the moon.',
    base: 'Write a sonnet about the sun. Write a limerick about the sea. Creative writing prompts for your classroom, volume 3.',
    tuned: 'Silver light spilling —\nthe moon rests on quiet roofs,\nowls trade slow secrets.',
    why: 'On the internet, writing prompts appear in LISTS of prompts (worksheets, blogs). Continuation ≠ compliance. Tuning teaches: when asked to write, write.',
  },
  {
    prompt: 'Fix this code: print("hello"',
    base: ') # TODO come back to this\n# also fix the login bug\n# and update the readme',
    tuned: 'You\u2019re missing a closing parenthesis:\n\nprint("hello")',
    why: 'The base model continues like a messy code file with TODO comments. The tuned model understands "fix" as a request with an expected deliverable.',
  },
]

function BaseVsTuned() {
  const [idx, setIdx] = useState(0)
  const [mode, setMode] = useState<'base' | 'tuned'>('base')
  const ex = PROMPTS[idx]

  return (
    <WidgetShell
      title="Same weights, different manners"
      hint="Try each prompt against the base model and the instruction-tuned one"
      accent={ACCENT}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="rounded-lg border px-3 py-1.5 text-xs transition"
            style={{
              borderColor: idx === i ? ACCENT : 'var(--color-ink-700)',
              color: idx === i ? ACCENT : 'var(--color-ink-400)',
              background: idx === i ? `${ACCENT}14` : 'transparent',
            }}
          >
            {p.prompt.length > 32 ? p.prompt.slice(0, 30) + '…' : p.prompt}
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-ink-950/70 p-4">
        <div className="mb-2 font-mono text-xs text-ink-400">user prompt:</div>
        <div className="font-mono text-sm text-ink-100">{ex.prompt}</div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setMode('base')}
          className="flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition"
          style={{
            borderColor: mode === 'base' ? '#fb923c' : 'var(--color-ink-700)',
            color: mode === 'base' ? '#fb923c' : 'var(--color-ink-400)',
            background: mode === 'base' ? '#fb923c14' : 'transparent',
          }}
        >
          🦖 Base model (raw pretrained)
        </button>
        <button
          onClick={() => setMode('tuned')}
          className="flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition"
          style={{
            borderColor: mode === 'tuned' ? '#34d399' : 'var(--color-ink-700)',
            color: mode === 'tuned' ? '#34d399' : 'var(--color-ink-400)',
            background: mode === 'tuned' ? '#34d39914' : 'transparent',
          }}
        >
          🤖 Instruction-tuned
        </button>
      </div>

      <motion.div
        key={`${idx}-${mode}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-lg border p-4"
        style={{
          borderColor: mode === 'base' ? '#fb923c44' : '#34d39944',
          background: mode === 'base' ? '#fb923c0a' : '#34d3990a',
        }}
      >
        <pre className="font-mono text-sm whitespace-pre-wrap text-ink-200">
          {mode === 'base' ? ex.base : ex.tuned}
        </pre>
      </motion.div>
      <p className="mt-3 rounded-lg bg-ink-850 p-3 text-xs leading-relaxed text-ink-400">
        {ex.why}
      </p>
    </WidgetShell>
  )
}

export default function InstructionTuning() {
  return (
    <article>
      <Section title="The brilliant intern who won't answer questions">
        <P>
          Pretraining ends with a paradox: the base model contains staggering knowledge but is
          useless as an assistant. It has learned exactly one behavior — <Term>continue the
          text</Term> — and a question is just text to continue, not a request to fulfill. Try
          the difference:
        </P>
        <BaseVsTuned />
        <KeyIdea>
          <Term>Instruction tuning</Term> (also called SFT — supervised fine-tuning) is a short
          second phase of training on a very different diet: tens or hundreds of thousands of{' '}
          <em>(instruction → good response)</em> pairs, written or curated by humans. Same
          next-token training, but on transcripts of an assistant behaving well. It doesn't add
          knowledge — it changes the model's <Term>default persona</Term> from "continuer of the
          internet" to "assistant that answers".
        </KeyIdea>
      </Section>

      <Section title="A costume, not a brain transplant">
        <Analogy>
          A base model is an actor who has read every script in the world. Instruction tuning
          hands them one role: the helpful assistant. Thousands of example scenes teach the part
          — how to greet a question, how to structure an answer, when to say "I'm not sure". The
          actor's knowledge is untouched; what changed is which character walks on stage by
          default. (And like any actor, a jailbreak — Module 9 — is someone convincing them to
          break character.)
        </Analogy>
        <List
          items={[
            <>
              <Term>The data is tiny but potent:</Term> ~1,000–100,000 examples versus trillions
              of pretraining tokens — a rounding error of compute that transforms usability.
              Famously, the LIMA paper got a competent assistant from just 1,000 exquisite
              examples: quality over quantity, again.
            </>,
            <>
              <Term>Chat formatting is learned here too:</Term> special tokens marking
              system/user/assistant turns, when to stop talking, how to format code blocks —
              the conversational costume's stitching.
            </>,
            <>
              <Term>What SFT can't do:</Term> examples show what a good answer looks like, but
              never show <em>what humans prefer between two decent answers</em>, or what to
              never say. Grading and preferences need the next stage: RLHF.
            </>,
          ]}
        />
        <WhyItMatters>
          Every model you use daily is instruction-tuned — "chat" or "instruct" in a model name
          means exactly this stage. Understanding it demystifies model behavior: the assistant
          personality, the eagerness to answer, the formatting of responses are all learned from a
          curated example set — which is also why different companies' models have such
          different "personalities" despite similar pretraining.
        </WhyItMatters>
        <Misconception>
          "Instruction tuning makes models smarter." Benchmarks say otherwise — raw capability
          barely moves, and some narrow skills even degrade slightly (the "alignment tax"). What
          changes is <em>access</em>: capabilities the base model always had become reachable by
          asking plainly instead of by crafting clever completions. SFT is an interface upgrade,
          not an intelligence upgrade.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Why does a base model respond to a question with more questions?',
            options: [
              'It\u2019s being evasive',
              'Its only learned behavior is text continuation, and on the web questions often appear in lists',
              'It lacks the knowledge to answer',
              'Its tokenizer breaks on question marks',
            ],
            answer: 1,
            explanation:
              'The base model does exactly what it was trained to do: predict likely continuations. A quiz question is statistically followed by more quiz questions more often than by a direct answer.',
          },
          {
            question: 'What does instruction tuning primarily change?',
            options: [
              'The model\u2019s factual knowledge',
              'The default behavior: from continuing text to responding to requests',
              'The model\u2019s size',
              'The tokenizer vocabulary',
            ],
            answer: 1,
            explanation:
              'Same architecture, same knowledge, tiny extra training — but the model now interprets input as instructions to fulfill. An interface transformation.',
          },
          {
            question: 'The LIMA result (1,000 examples sufficing) suggests what about instruction tuning?',
            options: [
              'It requires more data than pretraining',
              'It mostly UNLOCKS latent capability and style rather than teaching new skills — so a small, high-quality demonstration set goes far',
              'It only works for English',
              'It replaces pretraining',
            ],
            answer: 1,
            explanation:
              'If assistant behavior needed learning from scratch, 1,000 examples would be hopeless. Its sufficiency implies the base model already "knows how" — tuning shows it which persona to adopt.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Base models continue; assistants respond. Instruction tuning (SFT) converts one into the other.</>,
          <>Tiny data, huge effect: thousands of curated (instruction → response) pairs, standard next-token training.</>,
          <>It changes persona and accessibility, not knowledge — an interface upgrade with a small "alignment tax".</>,
          <>What it can't teach — preferences and boundaries — is the job of RLHF, next.</>,
        ]}
      />
    </article>
  )
}
