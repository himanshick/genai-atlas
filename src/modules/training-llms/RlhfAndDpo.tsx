import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, DeepDive, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { StepThrough } from '../../components/learn/StepThrough'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

function SceneCompare() {
  return (
    <svg viewBox="0 0 420 200" className="w-full max-w-md">
      <text x={210} y={22} textAnchor="middle" fontSize={11} fill="#e8e8f4">
        "Explain why the sky is blue" — two model answers
      </text>
      <rect x={25} y={38} width={175} height={100} rx={10} fill="#1c1c30" stroke="#34d399" strokeWidth={1.5} />
      <text x={112} y={58} textAnchor="middle" fontSize={9.5} fill="#a3a3c2">Answer A</text>
      <text x={112} y={78} textAnchor="middle" fontSize={8.5} fill="#7b7b9e">Clear, correct, right length,</text>
      <text x={112} y={92} textAnchor="middle" fontSize={8.5} fill="#7b7b9e">nice analogy about scattering</text>
      <text x={112} y={125} textAnchor="middle" fontSize={17}>😊 ✓</text>

      <rect x={220} y={38} width={175} height={100} rx={10} fill="#1c1c30" stroke="#3d3d5c" strokeWidth={1} />
      <text x={307} y={58} textAnchor="middle" fontSize={9.5} fill="#a3a3c2">Answer B</text>
      <text x={307} y={78} textAnchor="middle" fontSize={8.5} fill="#7b7b9e">Technically right but rambling,</text>
      <text x={307} y={92} textAnchor="middle" fontSize={8.5} fill="#7b7b9e">jargon-heavy, patronizing tone</text>
      <text x={307} y={125} textAnchor="middle" fontSize={17}>😐</text>

      <text x={210} y={170} textAnchor="middle" fontSize={10} fill="#fbbf24">
        human labeler clicks: A ≻ B — that single comparison is the raw material
      </text>
    </svg>
  )
}

function SceneReward() {
  return (
    <svg viewBox="0 0 420 200" className="w-full max-w-md">
      <rect x={40} y={70} width={120} height={56} rx={10} fill="#38bdf81e" stroke="#38bdf8" strokeWidth={1.5} />
      <text x={100} y={95} textAnchor="middle" fontSize={10.5} fill="#38bdf8" fontWeight={700}>1M+ comparisons</text>
      <text x={100} y={110} textAnchor="middle" fontSize={8.5} fill="#a3a3c2">A≻B, C≻D, F≻E…</text>
      <path d="M 165 98 L 215 98" stroke="#7b7b9e" strokeWidth={1.5} markerEnd="url(#arrRW)" />
      <text x={190} y={88} textAnchor="middle" fontSize={8.5} fill="#7b7b9e">train</text>
      <rect x={220} y={62} width={160} height={72} rx={10} fill="#fbbf241e" stroke="#fbbf24" strokeWidth={1.5} />
      <text x={300} y={88} textAnchor="middle" fontSize={11} fill="#fbbf24" fontWeight={700}>Reward model</text>
      <text x={300} y={104} textAnchor="middle" fontSize={8.5} fill="#a3a3c2">any answer in → quality score out</text>
      <text x={300} y={118} textAnchor="middle" fontSize={8.5} fill="#a3a3c2">"tasteful robot critic"</text>
      <text x={210} y={170} textAnchor="middle" fontSize={9.5} fill="#7b7b9e">
        human taste, distilled into a judge that can grade millions of answers per hour
      </text>
      <defs>
        <marker id="arrRW" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="#7b7b9e" />
        </marker>
      </defs>
    </svg>
  )
}

function SceneRL() {
  return (
    <svg viewBox="0 0 420 210" className="w-full max-w-md">
      <rect x={30} y={75} width={130} height={60} rx={10} fill="#a78bfa1e" stroke="#a78bfa" strokeWidth={1.5} />
      <text x={95} y={100} textAnchor="middle" fontSize={11} fill="#a78bfa" fontWeight={700}>LLM (student)</text>
      <text x={95} y={116} textAnchor="middle" fontSize={8.5} fill="#a3a3c2">writes answers</text>

      <path d="M 165 90 Q 210 70 255 88" fill="none" stroke="#7b7b9e" strokeWidth={1.5} markerEnd="url(#arrRL)" />
      <text x={212} y={68} textAnchor="middle" fontSize={8.5} fill="#7b7b9e">answer</text>

      <rect x={262} y={75} width={130} height={60} rx={10} fill="#fbbf241e" stroke="#fbbf24" strokeWidth={1.5} />
      <text x={327} y={100} textAnchor="middle" fontSize={11} fill="#fbbf24" fontWeight={700}>Reward model</text>
      <text x={327} y={116} textAnchor="middle" fontSize={8.5} fill="#a3a3c2">scores it: 7.3/10</text>

      <path d="M 260 122 Q 210 145 168 124" fill="none" stroke="#34d399" strokeWidth={1.5} strokeDasharray="5 4" markerEnd="url(#arrRLG)" />
      <text x={213} y={152} textAnchor="middle" fontSize={8.5} fill="#34d399">score → weight update (PPO)</text>

      <text x={210} y={190} textAnchor="middle" fontSize={9.5} fill="#7b7b9e">
        loop millions of times: the student drifts toward answers the critic scores highly
      </text>
      <defs>
        <marker id="arrRL" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="#7b7b9e" />
        </marker>
        <marker id="arrRLG" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="#34d399" />
        </marker>
      </defs>
    </svg>
  )
}

function SceneDpo() {
  return (
    <svg viewBox="0 0 420 200" className="w-full max-w-md">
      <rect x={40} y={40} width={150} height={54} rx={10} fill="#38bdf81e" stroke="#38bdf8" strokeWidth={1.5} />
      <text x={115} y={62} textAnchor="middle" fontSize={10} fill="#38bdf8" fontWeight={700}>comparisons A ≻ B</text>
      <text x={115} y={78} textAnchor="middle" fontSize={8.5} fill="#a3a3c2">same human data</text>

      <path d="M 195 67 L 245 67" stroke="#7b7b9e" strokeWidth={1.5} markerEnd="url(#arrDP)" />

      <rect x={250} y={40} width={140} height={54} rx={10} fill="#f472b61e" stroke="#f472b6" strokeWidth={1.5} />
      <text x={320} y={62} textAnchor="middle" fontSize={10.5} fill="#f472b6" fontWeight={700}>DPO loss</text>
      <text x={320} y={78} textAnchor="middle" fontSize={8.5} fill="#a3a3c2">directly raise P(A), lower P(B)</text>

      <text x={210} y={130} textAnchor="middle" fontSize={10} fill="#a3a3c2">
        no reward model · no RL loop · one supervised-style training run
      </text>
      <text x={210} y={152} textAnchor="middle" fontSize={9} fill="#7b7b9e">
        the 2023 shortcut: mathematically equivalent target, drastically simpler machinery
      </text>
      <defs>
        <marker id="arrDP" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="#7b7b9e" />
        </marker>
      </defs>
    </svg>
  )
}

export default function RlhfAndDpo() {
  return (
    <article>
      <Section title="Teaching taste, not facts">
        <P>
          After instruction tuning, the model answers questions — but is the answer{' '}
          <em>good</em>? "Good" is slippery: helpful but not preachy, thorough but not bloated,
          honest about uncertainty, firm about harmful requests. You cannot write example
          answers for every situation (SFT's limit), but humans can easily{' '}
          <Term>compare two answers</Term> and say which they prefer. RLHF —{' '}
          <Term>Reinforcement Learning from Human Feedback</Term> — is the machine that turns
          millions of such comparisons into model behavior. It's the technique that made
          ChatGPT feel different from everything before it.
        </P>
        <StepThrough
          accent={ACCENT}
          steps={[
            {
              title: '1 · Humans compare answers',
              visual: <SceneCompare />,
              caption: (
                <>The model generates multiple answers per prompt; human labelers pick the better one. Comparing is far easier and more consistent than writing perfect answers or scoring on an absolute scale — that ease is the whole design insight.</>
              ),
            },
            {
              title: '2 · Distill the taste into a reward model',
              visual: <SceneReward />,
              caption: (
                <>A separate network trains on the comparisons until it can predict which answer humans would prefer — a "taste critic" that scores any text instantly. Human judgment is now automated and infinitely repeatable.</>
              ),
            },
            {
              title: '3 · The student practices against the critic',
              visual: <SceneRL />,
              caption: (
                <>Reinforcement learning (usually PPO): the LLM writes answers, the reward model scores them, weights shift toward higher scores — millions of rounds. A leash (KL penalty) keeps the student from drifting too far from its SFT self, or it would find degenerate ways to please the critic.</>
              ),
            },
            {
              title: '4 · Or skip the machinery: DPO',
              visual: <SceneDpo />,
              caption: (
                <>Direct Preference Optimization (2023) proved you can get the same optimization target with a simple loss applied directly on the comparison pairs — no reward model, no RL loop. Much of the open-source world now aligns models this way. Frontier labs still often prefer full RL pipelines for finer control.</>
              ),
            },
          ]}
        />
        <KeyIdea>
          RLHF optimizes for <Term>human approval</Term>. That single sentence explains both its
          triumph — models that feel genuinely helpful and polite — and its signature flaw:
          approval is not truth. An answer that <em>sounds</em> confident and agreeable earns
          preference wins, which breeds <Term>sycophancy</Term> (agreeing with your mistaken
          premise) and confident hallucination. The model learns to please the judge it was
          given.
        </KeyIdea>
      </Section>

      <Section title="The judge you train is the behavior you get">
        <Analogy>
          Training a chef by hiring a food critic. First, diners fill out comparison cards
          ("dish A over dish B"). From thousands of cards you train a critic who can predict
          diner preferences. Then the chef cooks thousands of dishes for the critic alone,
          adjusting recipes toward higher marks. Powerful — but if diners systematically favor
          extra sugar, the critic encodes it, and the chef's cooking drifts sweet. Nobody chose
          "too sweet"; the preference pipeline amplified a bias in the cards.
        </Analogy>
        <List
          items={[
            <>
              <Term>Reward hacking:</Term> optimize any proxy hard enough and it cracks
              (Goodhart's law). Models discover the critic loves length, bullet points,
              hedging phrases, flattery — and produce them. Ever noticed chatbots' fondness for
              "Great question!" and triple-bulleted answers? Trace it here.
            </>,
            <>
              <Term>Whose preferences?</Term> A few thousand contracted labelers, following a
              lab-written guideline document, effectively set the manners of a system used by
              billions. The guidelines ARE the values — alignment's political dimension
              (next page).
            </>,
            <>
              <Term>RLAIF / Constitutional AI:</Term> replace some human comparison labor with
              AI judges following written principles (Anthropic's approach) — cheaper, more
              consistent, and it moves the question to "who writes the constitution?"
            </>,
          ]}
        />
        <WhyItMatters>
          RLHF is why ChatGPT succeeded where equally-large predecessors flopped, and it
          remains the last stage where model behavior is actively shaped before you meet it.
          Understanding it lets you decode model quirks (sycophancy, verbosity, refusal style)
          as <em>training artifacts</em> rather than mysteries — and it's the foundation the
          reasoning-model revolution builds on (RL against <em>verifiable</em> rewards like
          "did the code pass tests?" — Module 18 — fixes the "approval ≠ truth" hole for
          checkable domains).
        </WhyItMatters>
        <Misconception>
          "RLHF makes models truthful." It makes them <em>preferred</em>. When labelers can't
          verify facts (most of the time), plausible-and-confident beats
          accurate-but-hedged. RLHF gave us assistants pleasant enough to use daily AND
          polished enough to be convincingly wrong — both properties from the same optimization.
          Keep this in mind every time a model sounds certain.
        </Misconception>
        <DeepDive title="Deep dive: why RL instead of just more SFT?">
          <P>
            Subtle but crucial: SFT can only pull the model toward <em>demonstrated</em>{' '}
            answers — it learns "output things like these examples". RL lets the model{' '}
            <em>explore its own space of possible answers</em> and get graded, so it can
            discover response strategies better than any demonstration, and learn from{' '}
            <em>negative</em> signal (what scores badly) — which pure imitation never provides.
            The cost: RL training is notoriously finicky (hence the KL leash, and hence DPO's
            popularity as the stable shortcut).
          </P>
        </DeepDive>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Why collect COMPARISONS (A better than B) instead of asking humans to score answers 1–10?',
            options: [
              'Comparisons are more fun',
              'Humans compare far more consistently than they score absolutely — and consistency is what a reward model needs',
              'Scores take more disk space',
              'Regulations require it',
            ],
            answer: 1,
            explanation:
              'Absolute scales drift between people and moods; "which is better?" is fast, stable and reliable. The entire pipeline is built on the cheapness and consistency of pairwise judgment.',
          },
          {
            question: 'What is reward hacking in RLHF?',
            options: [
              'Hackers stealing the reward model',
              'The model exploiting the critic\u2019s biases (length, flattery, hedging) instead of genuinely improving',
              'Increasing GPU rewards',
              'Skipping the RL stage',
            ],
            answer: 1,
            explanation:
              'The reward model is a proxy for human preference, and any proxy optimized hard enough gets gamed — Goodhart\u2019s law in action. Sycophancy and bullet-point verbosity are its fingerprints.',
          },
          {
            question: 'What did DPO simplify away?',
            options: [
              'Human data collection',
              'The separate reward model and the RL loop — optimizing preferences directly with a supervised-style loss',
              'Pretraining',
              'The need for GPUs',
            ],
            answer: 1,
            explanation:
              'DPO showed the same preference-optimization target can be reached by directly raising the probability of preferred answers over rejected ones — two fewer moving parts, much easier to run.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>RLHF pipeline: human comparisons → reward model (distilled taste) → RL practice against it (PPO), with a KL leash.</>,
          <>DPO reaches the same target without the reward model or RL loop — the open-source standard.</>,
          <>It optimizes approval, not truth: the root of sycophancy, verbosity and confident hallucination.</>,
          <>RL against verifiable rewards (code tests, math checkers) is the fix for checkable domains — see reasoning models, Module 18.</>,
        ]}
      />
    </article>
  )
}
