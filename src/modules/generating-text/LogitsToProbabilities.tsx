import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell, LabeledSlider } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const TOKENS = [
  { t: 'mat', logit: 4.1, c: '#34d399' },
  { t: 'floor', logit: 3.2, c: '#38bdf8' },
  { t: 'couch', logit: 2.8, c: '#a78bfa' },
  { t: 'lap', logit: 2.5, c: '#fb923c' },
  { t: 'roof', logit: 1.9, c: '#f472b6' },
  { t: 'moon', logit: 0.4, c: '#fbbf24' },
  { t: 'idea', logit: -1.2, c: '#7b7b9e' },
]

function SoftmaxDemo() {
  const [boost, setBoost] = useState(0)

  const probs = useMemo(() => {
    const logits = TOKENS.map((tok, i) => (i === 2 ? tok.logit + boost : tok.logit))
    const exps = logits.map((l) => Math.exp(l))
    const sum = exps.reduce((a, b) => a + b, 0)
    return exps.map((e) => e / sum)
  }, [boost])

  return (
    <WidgetShell
      title="From scores to shares: softmax live"
      hint='Boost the logit of "couch" and watch every probability react'
      accent={ACCENT}
    >
      <div className="mb-1 font-mono text-sm text-ink-300">
        "The cat sat on the <span className="text-part2">___</span>"
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {/* logits */}
        <div>
          <div className="mb-2 text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
            logits (raw scores, any real number)
          </div>
          <div className="space-y-1.5">
            {TOKENS.map((tok, i) => {
              const l = i === 2 ? tok.logit + boost : tok.logit
              return (
                <div key={tok.t} className="flex items-center gap-2">
                  <span className="w-12 font-mono text-xs text-ink-300">{tok.t}</span>
                  <div className="relative h-4 flex-1">
                    <div className="absolute top-1/2 left-[28%] h-3.5 w-px -translate-y-1/2 bg-ink-600" />
                    <motion.div
                      className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full"
                      style={{ background: tok.c, left: l >= 0 ? '28%' : `${28 + l * 5.4}%` }}
                      animate={{ width: `${Math.abs(l) * 5.4}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-[10px] text-ink-400">
                    {l.toFixed(1)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        {/* probabilities */}
        <div>
          <div className="mb-2 text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
            after softmax (shares of 100%)
          </div>
          <div className="space-y-1.5">
            {TOKENS.map((tok, i) => (
              <div key={tok.t} className="flex items-center gap-2">
                <span className="w-12 font-mono text-xs text-ink-300">{tok.t}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-800">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: tok.c }}
                    animate={{ width: `${probs[i] * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="w-11 text-right font-mono text-[10px] text-ink-400">
                  {(probs[i] * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <LabeledSlider
          label='Nudge the logit of "couch"'
          value={boost}
          min={-2}
          max={4}
          step={0.1}
          onChange={setBoost}
          display={`${boost >= 0 ? '+' : ''}${boost.toFixed(1)}`}
          accent="#a78bfa"
        />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Two things to notice. Adding +2 to one logit doesn't add 2% — it <em>multiplies</em> its
        share by e² ≈ 7.4x, stealing probability from everyone else (the pie always sums to
        100%). And even "moon" keeps a sliver of probability — softmax never assigns exactly
        zero, which matters for sampling on the next page.
      </p>
    </WidgetShell>
  )
}

export default function LogitsToProbabilities() {
  return (
    <article>
      <Section title="The model never picks a word">
        <P>
          A common mental image of GPT: it "thinks of the next word". The reality is stranger
          and more useful to know. Each forward pass ends with the model assigning a raw score
          — a <Term>logit</Term> — to <em>every single token in its vocabulary</em>, all
          ~100,000 of them, every time. "mat" gets 4.1, "floor" 3.2, "photosynthesis" −5.8.
          Logits are unbounded, can be negative, and don't sum to anything meaningful. To use
          them, they're converted into a proper probability distribution by <Term>softmax</Term>:
          exponentiate every score, then divide by the total.
        </P>
        <SoftmaxDemo />
        <KeyIdea>
          The model's true output is a <Term>probability distribution over all possible next
          tokens</Term> — a ranked belief about everything that could come next. The word you
          see in a reply is a <em>sample drawn from</em> that distribution (next page), not the
          model's "choice". Everything about generation — creativity, determinism,
          hallucination — happens in the gap between the distribution and the draw.
        </KeyIdea>
      </Section>

      <Section title="Why exponentials? Why not just normalize?">
        <Analogy>
          Softmax is a talent-show scoreboard with amplification. If judges score contestants
          8, 7, and 3, simple normalization gives shares 44%, 39%, 17% — everyone stays in the
          running. Softmax instead exponentiates first: differences get amplified so the
          leaders dominate while stragglers keep token slivers. It's "soft" precisely because
          it's not a hard max — the winner takes <em>most</em>, never all.
        </Analogy>
        <List
          items={[
            <>
              <Term>Handles negatives gracefully:</Term> logits can be any real number;
              exponentials map them all to positive values before sharing out the pie.
            </>,
            <>
              <Term>Ratio-preserving:</Term> equal logit <em>gaps</em> mean equal probability{' '}
              <em>ratios</em> (a +1 gap always means e ≈ 2.7× more likely). This is why the
              temperature dial (next page) works by simply dividing logits.
            </>,
            <>
              <Term>Never zero:</Term> every token keeps some probability mass. Usually
              harmless; occasionally the source of bizarre rare-token glitches — and the reason
              filters like top-k exist.
            </>,
          ]}
        />
        <WhyItMatters>
          This page is the API decoder ring. <Term>logprobs</Term> (which many APIs return) are
          just logarithms of these probabilities — useful for measuring model confidence.{' '}
          <Term>logit bias</Term> lets you nudge specific tokens' scores before softmax (ban a
          word by setting −100, force it with +100) — you now know exactly what that does.
          Structured output / JSON mode works by masking logits of tokens that would violate
          the grammar. And <Term>perplexity</Term>, the classic LM metric, measures how much
          probability the model gave to the tokens that actually occurred.
        </WhyItMatters>
        <Misconception>
          "High probability = truth." Probability here means <em>likely as text</em>, not
          likely as fact. "The capital of Australia is Sydney" gets alarming probability
          because that error saturates the training data. The distribution encodes the
          statistics of human writing — including our popular mistakes. Hold this thought; it
          returns with force on the hallucination page.
        </Misconception>
        <DeepDive title="Deep dive: the last linear layer">
          <P>
            Where do logits physically come from? The final residual-stream vector (say 12,288
            numbers) is multiplied by an "unembedding" matrix of shape 12,288 × 100,000 —
            one learned direction per vocabulary token. Each logit is a dot product: <em>how
            much does the current state point in this token's direction?</em> Generation is
            literally a similarity search (Module 4!) between the model's final thought-vector
            and every word it knows. Many models even reuse the input embedding matrix here,
            transposed ("tied embeddings") — meaning-in and meaning-out share coordinates.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What does the model actually output at each generation step?',
            options: [
              'The single best next word',
              'A score for every token in the vocabulary, softmaxed into a probability distribution',
              'A complete sentence',
              'A database query',
            ],
            answer: 1,
            explanation:
              'Always all ~100k scores, every step. The visible "word choice" happens afterward, when a sampler draws from this distribution.',
          },
          {
            question: 'Adding +2 to one token\u2019s logit does what to its probability?',
            options: [
              'Adds exactly 2%',
              'Multiplies its relative weight by e² (~7.4×), with all shares renormalizing',
              'Nothing unless it was already the top token',
              'Doubles it exactly',
            ],
            answer: 1,
            explanation:
              'Softmax is exponential: logit differences become probability ratios. This is also exactly how the logit_bias API parameter works.',
          },
          {
            question: 'The model assigns 92% to "Sydney" completing "The capital of Australia is". What does this actually tell us?',
            options: [
              'Sydney is the capital of Australia',
              'That completion is statistically dominant in text the model trained on — likelihood-as-text, not truth',
              'The model is 92% intelligent',
              'The training data contained no geography',
            ],
            answer: 1,
            explanation:
              'It\u2019s Canberra — but the popular error outweighs the truth in written text. The distribution faithfully mirrors the statistics of human writing, mistakes included.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Every step, the model scores ALL tokens (logits) and softmax turns scores into a 100% probability pie.</>,
          <>Logit gaps = probability ratios; nothing ever gets exactly zero.</>,
          <>The reply you read is a sample from the distribution — the draw is a separate, controllable step.</>,
          <>Probability measures "likely as text", not "true" — the seed of the hallucination story.</>,
        ]}
      />
    </article>
  )
}
