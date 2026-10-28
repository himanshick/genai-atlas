import { useMemo, useState } from 'react'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

/* Tiny corpus for the n-gram generator */
const CORPUS = `the cat sat on the mat . the dog sat on the rug . the cat saw the dog . the dog saw the cat and the cat ran . the dog ran after the cat . the cat climbed the tree . the dog sat under the tree . the cat and the dog became friends . the mat was warm and the rug was soft . the cat slept on the warm mat . the dog slept on the soft rug .`
  .split(/\s+/)

function buildTable(n: number): Map<string, string[]> {
  const table = new Map<string, string[]>()
  for (let i = 0; i + n - 1 < CORPUS.length - 1 + (n === 1 ? 1 : 0); i++) {
    const key = n === 1 ? '' : CORPUS.slice(i, i + n - 1).join(' ')
    const next = CORPUS[i + n - 1]
    if (next === undefined) continue
    if (!table.has(key)) table.set(key, [])
    table.get(key)!.push(next)
  }
  return table
}

function NGramGenerator() {
  const [n, setN] = useState(2)
  const [output, setOutput] = useState<string[]>(['the'])

  const table = useMemo(() => buildTable(n), [n])

  const generate = () => {
    const out = [...output]
    const key = n === 1 ? '' : out.slice(-(n - 1)).join(' ')
    const candidates = table.get(key) ?? CORPUS
    out.push(candidates[Math.floor(Math.random() * candidates.length)])
    setOutput(out.slice(-40))
  }

  const auto = () => {
    let out = ['the']
    for (let i = 0; i < 25; i++) {
      const key = n === 1 ? '' : out.slice(-(n - 1)).join(' ')
      const candidates = table.get(key) ?? CORPUS
      out.push(candidates[Math.floor(Math.random() * candidates.length)])
    }
    setOutput(out)
  }

  return (
    <WidgetShell
      title="The original autocomplete"
      hint="Generate text by counting — raise n and watch coherence (and repetition) grow"
      accent={ACCENT}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink-300">Context size:</span>
        {[1, 2, 3].map((v) => (
          <button
            key={v}
            onClick={() => {
              setN(v)
              setOutput(['the'])
            }}
            className="rounded-lg border px-3.5 py-1.5 text-sm font-semibold transition"
            style={{
              borderColor: n === v ? ACCENT : 'var(--color-ink-700)',
              color: n === v ? ACCENT : 'var(--color-ink-400)',
              background: n === v ? `${ACCENT}14` : 'transparent',
            }}
          >
            {v === 1 ? 'unigram (no context)' : v === 2 ? 'bigram (1 word)' : 'trigram (2 words)'}
          </button>
        ))}
      </div>

      <div className="min-h-[90px] rounded-lg bg-ink-950/70 p-4 font-mono text-[14px] leading-relaxed">
        {output.map((w, i) => (
          <span key={i} className={i >= output.length - (n - 1) && n > 1 ? 'rounded bg-part2/25 px-0.5 text-ink-100' : 'text-ink-300'}>
            {w}{' '}
          </span>
        ))}
        <span className="animate-pulse text-part2">▌</span>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={generate} className="rounded-lg px-4 py-2 text-sm font-bold text-ink-950" style={{ background: ACCENT }}>
          Next word →
        </button>
        <button onClick={auto} className="rounded-lg border border-ink-700 px-4 py-2 text-sm text-ink-300 hover:border-ink-600">
          Generate 25 words
        </button>
        <button onClick={() => setOutput(['the'])} className="rounded-lg border border-ink-700 px-3 py-2 text-sm text-ink-300">
          ↺
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        This model was "trained" on 11 sentences about a cat and a dog. The highlighted words are
        the only context it can see. Unigram output is word salad; trigram output is locally
        grammatical but wanders in circles — it can never plan beyond its {n === 3 ? 'two' : 'one'}-word
        window, and it can never say anything that wasn't literally in the training text.
      </p>
    </WidgetShell>
  )
}

export default function NGrams() {
  return (
    <article>
      <Section title="Language modeling = predicting the next word">
        <P>
          Before diving into transformers, meet the problem they solve. A{' '}
          <Term>language model</Term> is any system that answers one question: given some words,{' '}
          <Term>what word comes next?</Term> That deceptively simple game turns out to contain
          all of language — and the simplest possible player is the <Term>n-gram model</Term>,
          which answers by pure counting: "in my training text, after the phrase 'the cat', what
          words followed, and how often?"
        </P>
        <NGramGenerator />
        <KeyIdea>
          An n-gram model predicts the next word by looking at only the last <Term>n−1</Term>{' '}
          words and consulting a frequency table. It is the "predict the next word" objective in
          its purest form — the very same objective GPT trains on (Module 7). Everything that
          came after n-grams is a better way to <em>use context</em>; the game never changed.
        </KeyIdea>
      </Section>

      <Section title="Why counting hits a wall">
        <Analogy>
          An n-gram model is a parrot with a clipboard. It has tallied every short phrase it ever
          heard and repeats statistically plausible continuations. Ask it something phrased in a
          way it has never heard verbatim, and the clipboard is empty — it cannot generalize from
          "the cat sat" to "the lion sat", because to a counting model those are unrelated
          entries. It has statistics, but no notion that cats and lions are similar.
        </Analogy>
        <List
          items={[
            <>
              <Term>Combinatorial explosion:</Term> with a 50,000-word vocabulary, there are
              50,000⁵ possible 5-word phrases — more than atoms in the Earth. Almost every
              sentence you say today has <em>never been said before</em>, so most counts are
              zero. Bigger n = sharper context but emptier tables.
            </>,
            <>
              <Term>No similarity:</Term> counts for "the cat sat" teach it nothing about "the
              dog sat". Every phrase is an island. (This is exactly the problem embeddings —
              Module 4 — were invented to fix.)
            </>,
            <>
              <Term>No long-range memory:</Term> "The girl who grew up in Paris speaks fluent
              ___" — the answer depends on a word 8 positions back, forever beyond a trigram's
              horizon.
            </>,
          ]}
        />
        <WhyItMatters>
          N-grams aren't just history — they're the perfect baseline for understanding what
          neural language models actually add. When people say LLMs are "just autocomplete",
          n-grams show what <em>literal</em> just-autocomplete looks like: locally fluent,
          globally vacant, incapable of novelty. The gap between that and GPT-4 is the substance
          of the next four modules. (N-grams also genuinely powered phone keyboards and search
          suggestions for decades.)
        </WhyItMatters>
        <Misconception>
          "LLMs are basically giant n-gram tables." No — an n-gram model can only reproduce
          continuations it literally saw. LLMs represent words as embeddings and compute with
          them, so they generalize: they can continue sentences that have never existed, transfer
          patterns across similar words, and use context thousands of words back. Same game,
          fundamentally different player.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'A trigram model predicts the next word using…',
            options: [
              'The whole document so far',
              'Only the previous two words, via a lookup of counted frequencies',
              'The topic of the text',
              'A neural network',
            ],
            answer: 1,
            explanation:
              'Tri-gram = 3-word window: two words of context, one word predicted, chosen from frequency counts of that exact 2-word context in training text.',
          },
          {
            question: 'Why can\u2019t n-gram models handle "the cat sat" → "the lion sat" generalization?',
            options: [
              'Lions are rare animals',
              'Each phrase is a separate table entry — the model has no concept of word similarity',
              'The table is sorted wrong',
              'n is too large',
            ],
            answer: 1,
            explanation:
              'Counting treats phrases as opaque strings. Without embeddings, there is no sense in which "cat" and "lion" are related — knowledge cannot transfer between entries.',
          },
          {
            question: 'Why not just use a huge n, like a 50-gram model?',
            options: [
              'It would be too accurate',
              'Almost no 50-word sequence ever repeats, so nearly all counts would be zero — nothing to predict from',
              'Computers can\u2019t count that high',
              'Grammar forbids it',
            ],
            answer: 1,
            explanation:
              'The combinatorial explosion: possible sequences grow exponentially with n while training data stays finite. Long contexts are almost always novel, leaving the frequency table empty exactly when you need it.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>A language model plays one game: <Term>predict the next word</Term>. N-grams play it by counting phrase frequencies.</>,
          <>They fail for deep reasons: no generalization between similar words, no long-range context, and most sentences are brand new.</>,
          <>Every architecture in this module is an attempt to use context better at the same game.</>,
          <>"LLMs are just autocomplete" undersells what changed: computing with meaning vs looking up strings.</>,
        ]}
      />
    </article>
  )
}
