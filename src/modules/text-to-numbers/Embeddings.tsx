import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

interface Word {
  w: string
  x: number
  y: number
  group: string
}

const WORDS: Word[] = [
  // animals (top-left)
  { w: 'cat', x: 70, y: 60, group: '#38bdf8' },
  { w: 'kitten', x: 92, y: 48, group: '#38bdf8' },
  { w: 'dog', x: 58, y: 95, group: '#38bdf8' },
  { w: 'puppy', x: 84, y: 105, group: '#38bdf8' },
  { w: 'wolf', x: 38, y: 118, group: '#38bdf8' },
  { w: 'tiger', x: 45, y: 42, group: '#38bdf8' },
  // food (top-right)
  { w: 'pizza', x: 285, y: 55, group: '#fb923c' },
  { w: 'burger', x: 308, y: 72, group: '#fb923c' },
  { w: 'pasta', x: 265, y: 78, group: '#fb923c' },
  { w: 'sushi', x: 300, y: 40, group: '#fb923c' },
  { w: 'bread', x: 270, y: 105, group: '#fb923c' },
  // emotions (bottom-left)
  { w: 'happy', x: 75, y: 200, group: '#34d399' },
  { w: 'joyful', x: 98, y: 190, group: '#34d399' },
  { w: 'sad', x: 55, y: 232, group: '#34d399' },
  { w: 'angry', x: 88, y: 242, group: '#34d399' },
  // vehicles (bottom-right)
  { w: 'car', x: 285, y: 195, group: '#f472b6' },
  { w: 'truck', x: 305, y: 212, group: '#f472b6' },
  { w: 'bicycle', x: 262, y: 225, group: '#f472b6' },
  { w: 'train', x: 290, y: 240, group: '#f472b6' },
  // bridge word
  { w: 'hotdog', x: 255, y: 130, group: '#fbbf24' },
]

function dist(a: Word, b: Word) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function EmbeddingMap() {
  const [selected, setSelected] = useState<Word>(WORDS[0])

  const neighbors = useMemo(
    () =>
      WORDS.filter((w) => w !== selected)
        .map((w) => ({ w, d: dist(w, selected) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 3),
    [selected],
  )

  return (
    <WidgetShell
      title="A map of meaning"
      hint="Click any word — its nearest neighbors light up"
      accent={ACCENT}
    >
      <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
        <svg viewBox="0 0 360 270" className="w-full rounded-lg bg-ink-950/70">
          {/* neighbor connection lines */}
          {neighbors.map(({ w }) => (
            <line
              key={w.w}
              x1={selected.x}
              y1={selected.y}
              x2={w.x}
              y2={w.y}
              stroke={ACCENT}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              opacity={0.6}
            />
          ))}
          {WORDS.map((word) => {
            const isSel = word === selected
            const isNear = neighbors.some((n) => n.w === word)
            return (
              <g
                key={word.w}
                className="cursor-pointer"
                onClick={() => setSelected(word)}
              >
                <motion.circle
                  cx={word.x}
                  cy={word.y}
                  r={isSel ? 8 : isNear ? 6 : 4.5}
                  fill={word.group}
                  animate={{ opacity: isSel || isNear ? 1 : 0.55 }}
                />
                <text
                  x={word.x}
                  y={word.y - 11}
                  textAnchor="middle"
                  fontSize={isSel ? 12 : 10.5}
                  fontWeight={isSel ? 700 : 500}
                  fill={isSel || isNear ? '#e8e8f4' : '#7b7b9e'}
                >
                  {word.w}
                </text>
              </g>
            )
          })}
        </svg>

        <div>
          <div className="rounded-xl border border-ink-700 bg-ink-850 p-4">
            <div className="text-xs text-ink-400">nearest neighbors of</div>
            <div className="font-display text-xl font-bold" style={{ color: selected.group }}>
              {selected.w}
            </div>
            <div className="mt-3 space-y-2">
              {neighbors.map(({ w, d }) => {
                const sim = Math.max(0, 1 - d / 260)
                return (
                  <div key={w.w} className="flex items-center gap-2">
                    <span className="w-16 text-sm text-ink-200">{w.w}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${sim * 100}%`, background: w.group }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-ink-400">{sim.toFixed(2)}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-400">
            Notice <em>hotdog</em>: it sits between food and animals-adjacent space — embeddings
            capture that words can live between neighborhoods. Real embeddings do this in
            hundreds of dimensions, not 2.
          </p>
        </div>
      </div>
    </WidgetShell>
  )
}

export default function Embeddings() {
  return (
    <article>
      <Section title="From arbitrary IDs to points with meaning">
        <P>
          Tokenization left us with integers — but token #5,432 isn't "more similar" to #5,433
          than to #40,000. The IDs are arbitrary labels with no meaning. The fix is the single
          most important data structure in modern AI: give every token a list of numbers — a{' '}
          <Term>vector</Term> — that acts as its <Term>coordinates in a space of meaning</Term>.
          These vectors are called <Term>embeddings</Term>.
        </P>
        <P>
          The defining property: <Term>similar meaning = nearby location</Term>. "cat" and
          "kitten" sit close together; "cat" and "carburetor" sit far apart.
        </P>
        <EmbeddingMap />
        <KeyIdea>
          An embedding turns the fuzzy human notion of "these things are related" into geometry —
          something a computer can measure with a ruler. Once meaning is location, finding
          related concepts becomes finding nearby points, and that single trick powers semantic
          search, recommendations, RAG (Module 10), and the inside of every LLM.
        </KeyIdea>
      </Section>

      <Section title="Where do the coordinates come from?">
        <P>
          Nobody assigns them. Embeddings are <Term>learned</Term> — they are weights, trained by
          gradient descent like everything else. The insight that makes this possible is the{' '}
          <Term>distributional hypothesis</Term>: words that appear in similar contexts have
          similar meanings. "You shall know a word by the company it keeps."
        </P>
        <P>
          During training, the model is rewarded for predicting words from their context. The
          only way to get good at that is to move words that appear in interchangeable contexts
          ("the ___ purred softly": cat, kitten) toward each other in the space. Meaning emerges
          from co-occurrence statistics — no dictionary was ever consulted.
        </P>
        <Analogy>
          Think of how you learned words like "smug" or "aloof" as a child. Almost certainly not
          from a dictionary — you heard them in dozens of contexts and triangulated the meaning
          from usage. Embeddings are that process, industrialized: a trillion contexts, and every
          word's position is triangulated so that context-mates end up neighbors.
        </Analogy>
        <List
          items={[
            <>
              <Term>Dimensions:</Term> real embeddings use 256–12,000+ numbers per token, not 2.
              Each dimension is a learned axis of variation — some loosely track interpretable
              things (formality, sentiment, "animal-ness"), most are entangled blends.
            </>,
            <>
              <Term>Inside an LLM:</Term> the first layer of GPT is literally a lookup table:
              token ID → embedding vector. Everything after operates on these vectors, never on
              text.
            </>,
            <>
              <Term>Beyond words:</Term> whole sentences, documents, images, songs and users can
              be embedded. "Similar things nearby" works for any data you can train a network on
              — that's how photo apps find "pictures of beaches" without tags.
            </>,
          ]}
        />
        <WhyItMatters>
          Embeddings are the workhorse you'll actually use. Search that understands "how do I fix
          a flat tire" matches "repairing a punctured bicycle wheel" (zero shared keywords!) —
          that's embedding search. Every RAG system, recommender and "related items" feature runs
          on this. When you call an "embeddings API", you're renting exactly this: text in,
          coordinates out.
        </WhyItMatters>
        <Misconception>
          "Each dimension has a human meaning, like dimension 7 = gender." Mostly not. Meaning is
          smeared across dimensions in overlapping directions. Some <em>directions</em> in the
          space do correspond to concepts (as the next page shows with king/queen), but the
          individual axes the computer stores are an arbitrary rotation — like a city map that's
          perfectly accurate but oriented at a random angle.
        </Misconception>
        <DeepDive title="Deep dive: static vs contextual embeddings">
          <P>
            Early systems (word2vec, 2013) gave each word <em>one fixed</em> vector — but "bank"
            in "river bank" and "bank account" got the same point, blurring both meanings.
            Transformers fixed this: the lookup-table embedding is only the <em>starting</em>{' '}
            position, and every layer of the network then shifts each token's vector based on its
            context (that's what attention does, Module 6). By the middle of the network, the
            "bank" vector in a finance sentence has physically moved toward money-space. These{' '}
            <Term>contextual embeddings</Term> are a big reason transformers understand language
            so much better.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What is the defining property of an embedding space?',
            options: [
              'Every word gets a unique random point',
              'Similar meanings map to nearby points',
              'Words are sorted alphabetically',
              'Frequent words get bigger vectors',
            ],
            answer: 1,
            explanation:
              'The entire value of embeddings is that geometric distance encodes semantic similarity — meaning becomes measurable.',
          },
          {
            question: 'How does training discover that "cat" and "kitten" should be neighbors — without a dictionary?',
            options: [
              'Engineers hand-place common words',
              'Both words appear in similar contexts, and context-prediction training pulls them together',
              'They share letters',
              'A dictionary is secretly included in training',
            ],
            answer: 1,
            explanation:
              'The distributional hypothesis at work: to predict words from context well, the model must give interchangeable words similar vectors. Similar company → similar coordinates.',
          },
          {
            question: 'A search for "how to fix a flat tire" returns a doc titled "repairing a punctured bicycle wheel" with zero words in common. What made this possible?',
            options: [
              'Keyword synonyms lists',
              'Both texts embed to nearby points in meaning-space, so nearest-neighbor search finds the match',
              'The search engine guessed',
              'Web links between the pages',
            ],
            answer: 1,
            explanation:
              'Embedding search compares meanings, not strings. Both phrases describe the same situation, so their vectors land close together despite disjoint vocabulary.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>An embedding = learned coordinates in meaning-space; <Term>similar meaning = nearby point</Term>.</>,
          <>Positions are learned from context statistics ("a word is known by the company it keeps"), not assigned.</>,
          <>LLMs internally run entirely on embeddings — text never gets past the first layer.</>,
          <>Anything can be embedded (sentences, images, users), which powers semantic search, RAG and recommenders.</>,
        ]}
      />
    </article>
  )
}
