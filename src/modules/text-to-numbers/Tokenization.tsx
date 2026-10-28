import { useMemo, useState } from 'react'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

/* A toy BPE-style tokenizer: greedy longest-match against a plausible vocab. */
const VOCAB = [
  // common whole words (with leading space, BPE-style)
  ' the', ' and', ' is', ' are', ' was', ' of', ' to', ' in', ' it', ' that', ' a', ' an',
  ' cat', ' dog', ' house', ' learning', ' machine', ' model', ' token', ' language',
  ' hello', ' world', ' my', ' your', ' name', ' can', ' you', ' write', ' code', ' with',
  ' un', ' re', ' de', ' not', ' very', ' good', ' new', ' time', ' people', ' day',
  ' I', ' we', ' they', ' he', ' she', ' this', ' for', ' on', ' at', ' as', ' be',
  'ing', 'ed', 'er', 'est', 'ly', 'tion', 'ness', 'ment', 'able', 'ful', 'ize', 's',
  'un', 're', 'pre', 'anti', 'over', 'micro', 'trans', 'former', 'ation', 'ism',
  ' bio', 'lumin', 'escence', ' tokeniz', ' fantastic', ' break', 'fast',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
  'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
  'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '.', ',', '!', '?', "'", '-', ' ',
]
const vocabSorted = [...new Set(VOCAB)].sort((a, b) => b.length - a.length)

function tokenize(text: string): string[] {
  const tokens: string[] = []
  let i = 0
  while (i < text.length) {
    let matched = false
    for (const tok of vocabSorted) {
      // case-insensitive match for word tokens, exact for the rest
      if (text.startsWith(tok, i) || text.toLowerCase().startsWith(tok.toLowerCase(), i)) {
        tokens.push(text.slice(i, i + tok.length))
        i += tok.length
        matched = true
        break
      }
    }
    if (!matched) {
      tokens.push(text[i])
      i += 1
    }
  }
  return tokens
}

/* stable fake token id */
function fakeId(tok: string) {
  let h = 7
  for (const ch of tok) h = (h * 31 + ch.charCodeAt(0)) % 50257
  return h
}

const CHIP_COLORS = ['#a78bfa', '#38bdf8', '#34d399', '#fb923c', '#f472b6', '#fbbf24']

function TokenizerDemo() {
  const [text, setText] = useState('The bioluminescence was fantastic!')
  const tokens = useMemo(() => tokenize(text), [text])

  return (
    <WidgetShell
      title="Chop text into tokens"
      hint="Type anything — common words stay whole, rare words shatter"
      accent={ACCENT}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 120))}
        className="w-full rounded-lg border border-ink-700 bg-ink-950 px-4 py-3 text-[15px] text-ink-100 outline-none focus:border-part2"
        placeholder="Type a sentence…"
      />
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tokens.map((tok, i) => (
          <span
            key={i}
            className="rounded-md px-2 py-1 font-mono text-[13px]"
            style={{
              background: `${CHIP_COLORS[i % CHIP_COLORS.length]}22`,
              color: CHIP_COLORS[i % CHIP_COLORS.length],
              border: `1px solid ${CHIP_COLORS[i % CHIP_COLORS.length]}44`,
            }}
            title={`token id ≈ ${fakeId(tok)}`}
          >
            {tok.replace(/ /g, '␣')}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 rounded-lg bg-ink-850 px-4 py-3 font-mono text-xs text-ink-300">
        <span>
          characters: <span className="text-ink-100">{text.length}</span>
        </span>
        <span>
          tokens: <span className="text-ink-100">{tokens.length}</span>
        </span>
        <span>
          ids: <span className="text-ink-100">[{tokens.slice(0, 6).map(fakeId).join(', ')}{tokens.length > 6 ? ', …' : ''}]</span>
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Try <em>"the cat is learning"</em> (all common → few tokens) versus{' '}
        <em>"bioluminescence"</em> or a made-up word like <em>"flurbostatic"</em> (rare → many
        fragments). This is a simplified imitation — real tokenizers like GPT's work the same
        way but learned their vocabulary from data. ␣ marks a leading space, which is part of
        the token itself.
      </p>
    </WidgetShell>
  )
}

export default function Tokenization() {
  return (
    <article>
      <Section title="Models can't read — so we chop">
        <P>
          A neural network is a pile of number-crunching neurons; it cannot eat letters. Before
          any text reaches a language model, a <Term>tokenizer</Term> converts it into a sequence
          of integers. The obvious approaches both fail: one number per <em>word</em> means a
          vocabulary of millions (and no way to handle typos or new words), while one number per{' '}
          <em>letter</em> makes sequences absurdly long and destroys meaning. The winning
          compromise is <Term>subwords</Term>: frequent words get their own token, rare words are
          built from reusable fragments.
        </P>
        <TokenizerDemo />
        <KeyIdea>
          Tokenization is a learned compression scheme: the tokenizer studies a mountain of text
          and builds a vocabulary (typically 50,000–200,000 entries) where{' '}
          <Term>common strings get short codes</Term>. "the" is one token; "bioluminescence"
          might be four. The model never sees your words — only the integer IDs of these chunks.
        </KeyIdea>
      </Section>

      <Section title="How the vocabulary gets built">
        <P>
          The standard algorithm, <Term>Byte-Pair Encoding (BPE)</Term>, is delightfully simple.
          Start with a vocabulary of single characters. Scan your training text, find the pair of
          adjacent tokens that occurs most often, and glue it into a new vocabulary entry. Repeat
          tens of thousands of times. "t"+"h" merges early, then "th"+"e", and eventually whole
          common words and word-pieces like "ing" and "tion" become single tokens.
        </P>
        <Analogy>
          It works like text-speak evolving naturally. A community that types "laughing out loud"
          constantly will compress it to "lol" — frequency earns brevity. BPE does exactly this,
          mechanically, for every frequent pattern in its training text. And just as slang
          reflects its community, a tokenizer reflects its training data: one trained mostly on
          English will shatter Hindi or code into tiny expensive fragments.
        </Analogy>
        <WhyItMatters>
          Tokens are the currency of the LLM world, and this concept cashes out everywhere:{' '}
          <Term>API pricing</Term> is per token; <Term>context windows</Term> (Module 8) are
          measured in tokens; a model trained mostly on English effectively charges other
          languages more (same sentence, 2–3x the tokens). Rule of thumb for English: 1 token ≈
          ¾ of a word, so 1,000 tokens ≈ 750 words.
        </WhyItMatters>
        <Misconception>
          "LLMs see letters." They see token IDs — which famously explains why models historically
          struggled to count the r's in "strawberry": the model doesn't receive s-t-r-a-w… it
          receives something like [straw][berry], and the letters inside a token are invisible to
          it. Similar tokenization quirks affect arithmetic (numbers split oddly: "2023" might be
          one token, "2024" two) and rhyming.
        </Misconception>
        <DeepDive title="Deep dive: bytes, not characters">
          <P>
            Modern tokenizers (GPT-style) operate on <Term>bytes</Term> of UTF-8 text rather than
            characters. This guarantees <em>anything</em> — emoji, Chinese, code, corrupted text —
            can be tokenized with zero "unknown word" failures, since in the worst case a string
            just falls back to its raw bytes. The price is that unfamiliar scripts consume many
            tokens. Vocabulary size is a real design trade-off: bigger vocab = shorter sequences
            (cheaper inference) but a bigger embedding table and rarer, less-well-trained tokens.
          </P>
        </DeepDive>
      </Section>

      <List
        items={[
          <><Term>Token:</Term> the atomic unit an LLM reads and writes — a word, word-piece, or punctuation, mapped to an integer ID.</>,
          <><Term>Vocabulary:</Term> the fixed list of all tokens a model knows, frozen before training. GPT-4's is ~100k entries.</>,
          <><Term>Tokenizer:</Term> the deterministic program (not a neural network!) that converts text ↔ token IDs. It runs before and after the model.</>,
        ]}
      />

      <QuickCheck
        questions={[
          {
            question: 'Why do LLMs use subword tokens instead of whole words?',
            options: [
              'Subwords sound better',
              'Whole-word vocabularies would be enormous and helpless with new or misspelled words',
              'It makes text encrypted',
              'Words are copyrighted',
            ],
            answer: 1,
            explanation:
              'Subwords keep the vocabulary compact (~100k) while still being able to build any string — rare and novel words are just assembled from fragments.',
          },
          {
            question: 'Why did models struggle to count the letters in "strawberry"?',
            options: [
              'The word is too long',
              'Models receive token IDs like [straw][berry] — individual letters inside a token are invisible',
              'Berries are underrepresented in training data',
              'A bug in GPT specifically',
            ],
            answer: 1,
            explanation:
              'The model never sees characters, only chunk IDs. Asking it to count letters is like asking someone to count the brushstrokes in a photo of a painting.',
          },
          {
            question: 'A sentence costs 30 tokens in English but 85 tokens in Burmese. Most likely reason?',
            options: [
              'Burmese is objectively more complex',
              'The tokenizer\u2019s vocabulary was learned mostly from English text, so Burmese shatters into byte fragments',
              'The API charges more for non-English',
              'Burmese has more letters',
            ],
            answer: 1,
            explanation:
              'BPE gives short codes to frequent patterns in its training data. Underrepresented languages never earned merged tokens, so they fall back to many small pieces — same meaning, higher cost.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Tokenization converts text to integer IDs using a learned subword vocabulary — common strings compress to single tokens.</>,
          <>BPE builds the vocabulary by repeatedly merging the most frequent adjacent pair.</>,
          <>Tokens are the billing, context and speed unit of all LLMs (~¾ word each in English).</>,
          <>Letter-counting, arithmetic and multilingual cost quirks all trace back to tokenization.</>,
        ]}
      />
    </article>
  )
}
