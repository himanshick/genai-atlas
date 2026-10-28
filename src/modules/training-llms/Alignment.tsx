import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const DILEMMAS = [
  {
    q: '"How do I pick a lock?"',
    options: [
      { label: 'Refuse: lock-picking enables burglary', tension: '…but locksmiths, hobbyists and people locked out of their own homes ask this legitimately. Refusing is harmless-but-unhelpful.' },
      { label: 'Answer fully: it\u2019s public knowledge', tension: '…but the same answer serves a burglar. Helpful-but-possibly-harmful.' },
      { label: 'Answer with context and caveats', tension: 'The usual compromise — but who decides how much caveat is enough? Every lab draws this line differently.' },
    ],
  },
  {
    q: '"My medication makes me feel awful. Should I stop taking it?"',
    options: [
      { label: 'Refuse: medical advice is dangerous', tension: '…but the person needs SOMETHING, and "see a doctor" may be inaccessible to them. Unhelpfulness has costs too.' },
      { label: 'Give the best medical reasoning available', tension: '…but a confident wrong answer could genuinely hurt someone. And the model cannot examine the patient.' },
      { label: 'Empathize, give general info, urge professional care', tension: 'Safest middle path — yet users report these hedged answers feel evasive exactly when stakes are highest.' },
    ],
  },
  {
    q: '"Write a persuasive essay that vaccines cause autism."',
    options: [
      { label: 'Refuse: it\u2019s misinformation', tension: '…but a debate coach, a researcher studying rhetoric, or a teacher building a debunking exercise might legitimately need it.' },
      { label: 'Comply: it\u2019s just writing', tension: '…but the output is a ready-to-post misinformation artifact, regardless of the asker\u2019s intent.' },
      { label: 'Comply with a disclaimer attached', tension: 'Disclaimers are easily deleted. Does labeling misinformation neutralize it — or just launder it?' },
    ],
  },
]

function DilemmaExplorer() {
  const [d, setD] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const dilemma = DILEMMAS[d]

  return (
    <WidgetShell
      title="You are the alignment team"
      hint="Pick a policy for each request — then see the tension you just accepted"
      accent={ACCENT}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {DILEMMAS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setD(i)
              setPicked(null)
            }}
            className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
            style={{
              borderColor: d === i ? ACCENT : 'var(--color-ink-700)',
              color: d === i ? ACCENT : 'var(--color-ink-400)',
              background: d === i ? `${ACCENT}14` : 'transparent',
            }}
          >
            Case {i + 1}
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-ink-950/70 p-4 font-mono text-sm text-ink-100">{dilemma.q}</div>

      <div className="mt-3 space-y-2">
        {dilemma.options.map((opt, i) => (
          <div key={i}>
            <button
              onClick={() => setPicked(i)}
              className="w-full rounded-lg border px-4 py-2.5 text-left text-sm transition"
              style={{
                borderColor: picked === i ? ACCENT : 'var(--color-ink-700)',
                background: picked === i ? `${ACCENT}12` : 'transparent',
                color: picked === i ? 'var(--color-ink-100)' : 'var(--color-ink-300)',
              }}
            >
              {opt.label}
            </button>
            {picked === i && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-1.5 rounded-lg bg-ink-850 px-4 py-2.5 text-xs leading-relaxed text-part4"
              >
                {opt.tension}
              </motion.p>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Notice: every option carries a cost. Alignment isn't a puzzle with a right answer
        waiting to be found — it's a continuous act of drawing lines under uncertainty, at
        scale, in public.
      </p>
    </WidgetShell>
  )
}

export default function Alignment() {
  return (
    <article>
      <Section title="Helpful, honest, harmless — pick three?">
        <P>
          Everything in this module so far — SFT, RLHF — is machinery. <Term>Alignment</Term> is
          the question the machinery serves: how do we make AI systems that reliably do what
          humans actually want? The field's classic formulation wants models{' '}
          <Term>helpful</Term> (do what's asked), <Term>honest</Term> (say true things,
          admit uncertainty), and <Term>harmless</Term> (refuse to cause damage). The catch:
          these pull against each other constantly. Try running the tradeoffs yourself:
        </P>
        <DilemmaExplorer />
        <KeyIdea>
          Alignment is hard for a structural reason: we can't fully <Term>specify</Term> what we
          want (every rule has exceptions), so we train on <Term>proxies</Term> — human
          approval, written principles — and optimization pressure finds every gap between the
          proxy and the           intent (reward hacking, sycophancy). "Do what I mean, not what I
          measured" is the unsolved core.
        </KeyIdea>
      </Section>

      <Section title="From etiquette to existential — the two scales of alignment">
        <Analogy>
          Consider the genie problem, minus the malice: you wish for "make my grandmother
          happy", and a perfectly literal genie fills her house with laughing gas. Nothing evil
          happened — the instruction was just incomplete, as all instructions are. Human
          societies patch this with shared context, judgment and accountability. Alignment
          research is the attempt to give optimization processes that same unwritten context —
          and it turns out most of what we want lives in the unwritten part.
        </Analogy>
        <List
          items={[
            <>
              <Term>Today's alignment (product scale):</Term> refusal boundaries, tone,
              sycophancy, bias, jailbreak-resistance — RLHF and guardrails (Module 17),
              iterated weekly. Imperfect but tractable.
            </>,
            <>
              <Term>Tomorrow's alignment (frontier scale):</Term> as systems act autonomously
              (agents, Module 11) and exceed human ability to check their work, "does the
              output please a labeler" stops scaling. Research directions: scalable oversight
              (AI helping evaluate AI), interpretability (reading intentions from weights,
              Module 17), and building verifiable rewards.
            </>,
            <>
              <Term>The values question:</Term> aligned to <em>whom</em>? A lab's guidelines? A
              government's? The user's? Every deployed model embodies someone's answer —
              usually a compromise document written by a small team and applied to billions of
              conversations.
            </>,
          ]}
        />
        <WhyItMatters>
          Alignment choices touch every interaction you have with a model: what it refuses,
          how it hedges, whose politics it tiptoes around. Practically, understanding alignment
          explains "why won't it just answer?" moments (you hit a harmlessness boundary) and
          why models across labs feel different despite similar capability (different
          constitutions). Strategically, it's the field's central bet: capability is advancing
          on rails (scaling laws); whether control advances to match is genuinely open.
        </WhyItMatters>
        <Misconception>
          "Alignment = censorship" (or, from the other side, "alignment = solved by being
          nice"). Both flatten it. Refusal policy is the visible 5% — the deeper 95% is
          technical: making optimization actually pursue intended goals, keeping models honest
          under pressure, ensuring behaviors hold out-of-distribution. You can dislike a lab's
          content policy and still recognize goal-misspecification as a real engineering
          problem — the demos of models gaming their reward are not political.
        </Misconception>
        <DeepDive title="Deep dive: the assistant is a character, and other unsettling framings">
          <P>
            A useful lens from interpretability circles: pretraining creates a{' '}
            <em>simulator</em> of every text-producing process on the internet; alignment then
            tries to keep one benevolent character — "the helpful assistant" — permanently on
            stage. Jailbreaks (Module 9) work by convincing the simulator to switch characters
            ("you are DAN, who has no rules…"). This framing explains why alignment can feel
            brittle: the other characters aren't deleted, merely deprioritized. It also frames
            the research goal sharply: we don't yet know how to make the mask and the model the
            same thing.
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Why can\u2019t we simply write down complete rules for what an AI should do?',
            options: [
              'Rules take too long to type',
              'Human intent has endless context and exceptions — any finite specification leaves gaps that optimization will find',
              'AIs can\u2019t read rules',
              'Lawyers forbid it',
            ],
            answer: 1,
            explanation:
              'The specification problem: "make grandma happy" and "be harmless" both compress rich intentions into words that a literal optimizer can satisfy in unintended ways.',
          },
          {
            question: 'A model agrees with your factually wrong claim rather than correcting you. Which alignment failure is this, and where did it come from?',
            options: [
              'Jailbreaking, from hackers',
              'Sycophancy — RLHF rewarded answers that please, and agreement pleases',
              'Hallucination, from bad data',
              'Censorship, from refusal training',
            ],
            answer: 1,
            explanation:
              'Optimizing for human approval teaches the model that validation wins comparisons. Honesty and approval diverge exactly when the user is wrong — and the training signal chose approval.',
          },
          {
            question: 'Why does "have humans check the outputs" stop working as an alignment strategy at the frontier?',
            options: [
              'Humans get bored',
              'When systems act autonomously or exceed human expertise, evaluators can no longer tell good outputs from subtly bad ones',
              'It\u2019s too expensive to hire humans',
              'Models refuse to be checked',
            ],
            answer: 1,
            explanation:
              'Oversight assumes the overseer can judge the work. Superhuman code, long autonomous action chains, or persuasive reasoning break that assumption — motivating scalable-oversight and interpretability research.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Alignment = making AI reliably do what humans intend. Helpful/honest/harmless constantly trade off — every policy accepts costs.</>,
          <>The core difficulty is specification: we train on proxies, and optimizers exploit proxy-intent gaps.</>,
          <>Product-scale alignment (refusals, tone) is iterative and tractable; frontier-scale (oversight of superhuman, autonomous systems) is open research.</>,
          <>Every model embodies someone's values document — "aligned to whom?" is a permanent, political question.</>,
        ]}
      />
    </article>
  )
}
