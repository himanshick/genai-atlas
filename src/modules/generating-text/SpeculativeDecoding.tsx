import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

/* rounds of speculative decoding: draft proposes 5, big model verifies */
const ROUNDS = [
  {
    context: 'The recipe calls for two cups of',
    draft: ['flour', ',', 'one', 'cup', 'of'],
    accepted: 5,
    fix: null,
    note: 'Easy, predictable text — the little model nails all 5 tokens. One big-model pass verified five tokens at once: 5× speedup this round.',
  },
  {
    context: '…one cup of',
    draft: ['sugar', 'and', 'a', 'pinch', 'of'],
    accepted: 5,
    fix: null,
    note: 'Another full acceptance. Recipes are the little model\u2019s home turf — boilerplate text is where speculation shines.',
  },
  {
    context: '…a pinch of',
    draft: ['salt', '.', 'Mix', 'the', 'wet'],
    accepted: 2,
    fix: 'Preheat',
    note: 'The big model agreed with "salt ." but would have said "Preheat", not "Mix". Tokens 3–5 are discarded, the big model\u2019s own token is used, and drafting resumes from there. Correctness preserved.',
  },
]

function SpecDemo() {
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<'draft' | 'verify'>('draft')
  const r = ROUNDS[round]

  const next = () => {
    if (phase === 'draft') setPhase('verify')
    else {
      setRound((round + 1) % ROUNDS.length)
      setPhase('draft')
    }
  }

  return (
    <WidgetShell
      title="Draft fast, verify in bulk"
      hint="Step through: little model drafts 5 tokens, big model checks them all at once"
      accent={ACCENT}
    >
      <div className="rounded-lg bg-ink-950/70 p-4">
        <div className="font-mono text-xs text-ink-400">context so far:</div>
        <div className="mb-4 font-mono text-sm text-ink-200">{r.context}</div>

        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-[11px] font-semibold tracking-wide text-sky-400 uppercase">
            🐇 draft model proposes (cheap & fast):
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {r.draft.map((tok, i) => {
            const verdict =
              phase === 'verify' ? (i < r.accepted ? 'ok' : i === r.accepted && r.fix ? 'fixed' : 'rejected') : 'pending'
            return (
              <motion.span
                key={`${round}-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: verdict === 'rejected' ? 0.35 : 1, x: 0 }}
                transition={{ delay: phase === 'draft' ? i * 0.12 : 0 }}
                className="rounded-md border px-2.5 py-1 font-mono text-sm"
                style={{
                  borderColor:
                    verdict === 'ok' ? '#34d399' : verdict === 'rejected' || verdict === 'fixed' ? '#f87171' : '#38bdf8',
                  color: verdict === 'ok' ? '#34d399' : verdict === 'rejected' || verdict === 'fixed' ? '#f87171' : '#38bdf8',
                  background:
                    verdict === 'ok' ? '#34d39912' : verdict === 'rejected' || verdict === 'fixed' ? '#f8717110' : '#38bdf812',
                  textDecoration: verdict === 'rejected' || verdict === 'fixed' ? 'line-through' : 'none',
                }}
              >
                {tok}
              </motion.span>
            )
          })}
          {phase === 'verify' && r.fix && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-md border border-part2 bg-part2/15 px-2.5 py-1 font-mono text-sm text-part2"
            >
              {r.fix} ← big model's pick
            </motion.span>
          )}
        </div>

        {phase === 'verify' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4">
            <div className="mb-1.5 text-[11px] font-semibold tracking-wide text-part2 uppercase">
              🐘 big model verifies all 5 in ONE forward pass:
            </div>
            <div className="rounded-lg bg-ink-850 p-3 text-xs leading-relaxed text-ink-300">
              <span className="font-mono text-emerald-400">{r.accepted}/5 accepted</span> — {r.note}
            </div>
          </motion.div>
        )}
      </div>

      <button onClick={next} className="mt-4 rounded-lg px-4 py-2 text-sm font-bold text-ink-950" style={{ background: ACCENT }}>
        {phase === 'draft' ? 'Verify with big model →' : 'Next round →'}
      </button>
    </WidgetShell>
  )
}

export default function SpeculativeDecoding() {
  return (
    <article>
      <Section title="The bottleneck isn't thinking — it's taking turns">
        <P>
          Here's an odd asymmetry from the KV cache page: a big model can <em>verify</em> the
          probabilities of 100 tokens in one parallel forward pass (prefill is fast), but{' '}
          <em>generating</em> 100 tokens takes 100 sequential passes — each waiting for the
          last, each bottlenecked on shuttling the giant weights through memory for a single
          token's worth of work. Generation wastes the GPU's parallelism.
        </P>
        <P>
          <Term>Speculative decoding</Term> exploits the asymmetry: let a tiny, fast{' '}
          <Term>draft model</Term> (or a lightweight head bolted onto the big model) race ahead
          and propose several tokens, then have the big model check them all <em>at once</em>:
        </P>
        <SpecDemo />
        <KeyIdea>
          The exchange rate: one big-model pass used to buy 1 token; now it buys{' '}
          <Term>as many consecutive draft tokens as the big model agrees with</Term> (+1 of its
          own on a miss). And crucially, the output distribution is{' '}
          <Term>mathematically unchanged</Term> — rejected tokens are resampled exactly as the
          big model would have. It's a pure speed trick: 2–3× faster, zero quality cost.
        </KeyIdea>
      </Section>

      <Section title="Free speed from predictable text">
        <Analogy>
          A senior surgeon and a resident doing paperwork. The resident fills in the routine
          fields at speed; the surgeon reviews a full page at a glance — signing off ninety
          percent, correcting the occasional line that needs expertise. Reviewing is far faster
          than writing, so the pair vastly outpaces the surgeon alone — and every page still
          carries, in effect, the surgeon's judgment on every field. The resident never
          "decides" anything.
        </Analogy>
        <List
          items={[
            <>
              <Term>Why it works — text is bursty:</Term> much of language is nearly forced
              (grammar glue, boilerplate, "of the", closing brackets, obvious continuations).
              Cheap models predict those stretches perfectly, saving the big model for the
              genuinely hard tokens. Acceptance rates of 60–80% are common.
            </>,
            <>
              <Term>Variants everywhere:</Term> a separate small model (original recipe),
              extra prediction heads on the same model (Medusa), n-gram lookup from the prompt
              itself (great for code editing, where output copies input heavily), and
              multi-token prediction trained in. Production APIs (yours included) quietly run
              some flavor of this.
            </>,
            <>
              <Term>The catch:</Term> speedup depends on agreement. Creative high-temperature
              prose → drafts miss often → modest gains. Code, structured output, low
              temperature → drafts sail through → big gains. Same trick, workload-dependent
              dividend.
            </>,
          ]}
        />
        <WhyItMatters>
          Speculative decoding is why streaming tokens got visibly faster across the industry
          without models changing. It also completes your mental toolkit for inference
          economics: <Term>prefill parallelism + KV cache + speculation</Term> are the three
          pillars every serving stack stands on. And conceptually it's a beautiful pattern —
          <em>cheap proposer, expensive verifier</em> — that recurs across AI (from
          best-of-n reasoning to agent architectures in Module 11).
        </WhyItMatters>
        <Misconception>
          "A small model helping means quality drops." The verification step guarantees the
          final token stream follows the big model's distribution exactly — provably, not
          approximately. A wrong draft token is never kept; it's replaced by what the big model
          would have said anyway. If you observe quality differences, something else in the
          stack changed. The draft model can be hilariously dumb and the output remains 100%
          big-model.
        </Misconception>
        <DeepDive title="Deep dive: verifying without bias">
          <P>
            The subtle part: the big model doesn't just accept "correct" tokens — there is no
            single correct token, only distributions. The acceptance rule compares the draft's
            probability q(token) with the target's p(token): accept with probability
            min(1, p/q); on rejection, resample from the leftover distribution (p − q,
            renormalized). This <Term>rejection sampling</Term> scheme provably yields samples
            from p exactly — the elegant math that lets the whole industry take the speedup
            with zero hand-wringing about quality.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'What asymmetry does speculative decoding exploit?',
            options: [
              'Small models are smarter per parameter',
              'Verifying many tokens in parallel is cheap for the big model; generating them one-by-one is slow',
              'GPUs prefer small numbers',
              'Drafts compress better over networks',
            ],
            answer: 1,
            explanation:
              'Same asymmetry as prefill vs decode: parallel token processing uses the GPU fully; sequential generation is memory-bandwidth-bound. Speculation converts slow generation into fast verification.',
          },
          {
            question: 'The draft model proposes 5 tokens and the big model disagrees with token 3. What happens?',
            options: [
              'All 5 are kept — drafts are final',
              'Tokens 1–2 are kept, 3–5 discarded, and the big model\u2019s own choice replaces token 3',
              'The whole response restarts',
              'The user sees both options',
            ],
            answer: 1,
            explanation:
              'Acceptance is prefix-based: everything before the first disagreement survives, and the big model supplies the correction — so the stream is always exactly what it would have produced alone.',
          },
          {
            question: 'Which workload gets the BIGGEST speculative speedup?',
            options: [
              'High-temperature poetry',
              'Low-temperature structured output like code or JSON, where continuations are highly predictable',
              'Random number generation',
              'All workloads speed up equally',
            ],
            answer: 1,
            explanation:
              'Speedup = average accepted tokens per round, which tracks how predictable the text is. Boilerplate-heavy, low-entropy output lets the draft run long streaks.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Little model drafts k tokens; big model verifies them in one pass; agreement = multiple tokens per big-model step.</>,
          <>Rejection-sampling math guarantees output identical to the big model alone — speed without quality loss.</>,
          <>Gains track text predictability: code and boilerplate fly, creative prose less so.</>,
          <>Pattern to remember: cheap proposer + expensive verifier — it recurs all over AI systems.</>,
        ]}
      />
    </article>
  )
}
