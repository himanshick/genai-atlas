import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, P, Term, List, Takeaways } from '../../components/learn/Prose'
import { Analogy, KeyIdea, Misconception, WhyItMatters } from '../../components/learn/Callouts'
import { WidgetShell } from '../../components/learn/WidgetShell'
import { StepThrough } from '../../components/learn/StepThrough'
import { QuickCheck } from '../../components/learn/QuickCheck'

const ACCENT = '#a78bfa'

const MIX = [
  { name: 'Web crawl (filtered)', pct: 50, color: '#38bdf8', note: 'CommonCrawl-style scrapes of the open web — the bulk, and the most aggressively filtered' },
  { name: 'Code', pct: 15, color: '#34d399', note: 'GitHub and similar. Surprise: code improves reasoning on non-code tasks' },
  { name: 'Books', pct: 12, color: '#a78bfa', note: 'Long, edited, coherent text — teaches long-range structure and style' },
  { name: 'Academic & reference', pct: 10, color: '#fb923c', note: 'Papers, Wikipedia, encyclopedias — dense factual backbone' },
  { name: 'Conversation & forums', pct: 8, color: '#f472b6', note: 'Reddit-style dialogue — how humans actually talk and argue' },
  { name: 'Multilingual & other', pct: 5, color: '#fbbf24', note: 'Non-English text, math, transcripts — breadth of coverage' },
]

function DataMixture() {
  const [sel, setSel] = useState(0)
  let acc = 0

  return (
    <WidgetShell
      title="What's on the menu (a typical frontier mix)"
      hint="Click a slice to see why it's included"
      accent={ACCENT}
    >
      <div className="flex h-12 w-full overflow-hidden rounded-xl">
        {MIX.map((m, i) => {
          const el = (
            <button
              key={m.name}
              onClick={() => setSel(i)}
              className="relative h-full transition-all"
              style={{
                width: `${m.pct}%`,
                background: m.color,
                opacity: sel === i ? 1 : 0.45,
              }}
              title={m.name}
            >
              {m.pct >= 10 && (
                <span className="font-mono text-[10px] font-bold text-ink-950">{m.pct}%</span>
              )}
            </button>
          )
          acc += m.pct
          return el
        })}
      </div>
      <motion.div
        key={sel}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-lg border p-4"
        style={{ borderColor: `${MIX[sel].color}44`, background: `${MIX[sel].color}0d` }}
      >
        <div className="font-display text-sm font-bold" style={{ color: MIX[sel].color }}>
          {MIX[sel].name} — ~{MIX[sel].pct}%
        </div>
        <p className="mt-1 text-sm leading-relaxed text-ink-300">{MIX[sel].note}</p>
      </motion.div>
      <p className="mt-3 text-xs leading-relaxed text-ink-400">
        Exact recipes are among the industry's most guarded secrets — these proportions are
        representative of published open-model recipes (LLaMA, Falcon, etc.). The mixture is
        re-weighted deliberately: high-quality sources are repeated; junk is sampled sparingly.
      </p>
    </WidgetShell>
  )
}

function PipelineSteps() {
  const stage = (label: string, sub: string, kept: number, color: string) => (
    <svg viewBox="0 0 400 150" className="w-full max-w-md">
      <rect x={30} y={40} width={340 * 1} height={26} rx={7} fill="#2a2a44" />
      <motion.rect
        x={30}
        y={40}
        height={26}
        rx={7}
        fill={color}
        initial={{ width: 340 }}
        animate={{ width: 340 * kept }}
        transition={{ duration: 0.8 }}
      />
      <text x={200} y={30} textAnchor="middle" fontSize={12} fill="#e8e8f4" fontWeight={600}>
        {label}
      </text>
      <text x={200} y={92} textAnchor="middle" fontSize={10} fill="#a3a3c2">
        {sub}
      </text>
      <text x={200} y={115} textAnchor="middle" fontSize={11} fill={color} fontFamily="monospace">
        data surviving: {(kept * 100).toFixed(0)}%
      </text>
    </svg>
  )

  return (
    <StepThrough
      accent={ACCENT}
      steps={[
        {
          title: 'Crawl: petabytes of raw web',
          visual: stage('Raw crawl', 'HTML soup: menus, ads, boilerplate, spam, gems', 1, '#7b7b9e'),
          caption: <>Start with a snapshot of the open web (plus licensed books, code, etc.). Most of it is worthless for training: navigation bars, cookie banners, SEO spam, auto-generated junk.</>,
        },
        {
          title: 'Extract & language-filter',
          visual: stage('Text extraction', 'Strip HTML, keep target languages, drop boilerplate', 0.45, '#38bdf8'),
          caption: <>Extract clean prose from markup, detect language, drop pages that are mostly links or repeated templates. More than half the volume vanishes here.</>,
        },
        {
          title: 'Quality filtering',
          visual: stage('Quality filters', 'Classifiers score "is this good text?" — trained on known-good sources', 0.18, '#a78bfa'),
          caption: <>Small ML classifiers (and heuristics: symbol ratios, sentence lengths) score every document. Only text resembling known-quality writing survives. This single stage shapes the model's "taste" more than almost anything.</>,
        },
        {
          title: 'Deduplication',
          visual: stage('Dedup', 'Remove exact and near-duplicate documents and passages', 0.12, '#fb923c'),
          caption: <>The web repeats itself endlessly. Duplicates waste compute AND cause memorization — text seen thousands of times gets etched into weights verbatim (a copyright and privacy hazard). Fuzzy-matching removes them at scale.</>,
        },
        {
          title: 'Safety & PII scrubbing',
          visual: stage('Scrubbing', 'Remove personal data, CSAM, toxic sources; mix and shuffle', 0.1, '#f472b6'),
          caption: <>Strip personal information and illegal or harmful content, apply source-level blocklists, then weight, shuffle and tokenize the survivors into the final training mix. Roughly 10% of the crawl remains — that's what the model eats.</>,
        },
      ]}
    />
  )
}

export default function TrainingData() {
  return (
    <article>
      <Section title="You are what you eat">
        <P>
          If pretraining is one long meal, the menu decides almost everything. A frontier model's
          diet is measured in <Term>trillions of tokens</Term> — on the order of 10–15 trillion
          for recent models. For scale: a human reading 8 hours a day for 80 years manages
          maybe 5 <em>billion</em> tokens. The model reads thousands of human lifetimes of text.
        </P>
        <DataMixture />
        <KeyIdea>
          Model behavior is downstream of data curation. Code in the mix improves logical
          reasoning; books teach long-form coherence; forums teach dialogue. Modern data teams
          don't just collect text — they <Term>engineer a curriculum</Term>, and labs now openly
          say that data quality is a bigger lever than architecture tweaks.
        </KeyIdea>
      </Section>

      <Section title="From sewage to spring water: the pipeline">
        <P>
          The raw web is mostly garbage, so between crawling and training sits an industrial
          cleaning pipeline. Watch how much survives each stage:
        </P>
        <PipelineSteps />
        <Analogy>
          It's a restaurant supply chain. The crawl is everything the market sells — including
          the rotten crates. Extraction unpacks the boxes; quality filtering is the chef
          rejecting bruised produce; deduplication stops you buying the same crate five times;
          scrubbing is food-safety inspection. Diners (users) never see the pipeline — but it,
          more than the recipe, decides how dinner tastes.
        </Analogy>
        <List
          items={[
            <>
              <Term>Synthetic data — the new frontier:</Term> as high-quality human text runs
              out (the "data wall"), labs increasingly train on text <em>generated by other
              models</em>, filtered for correctness — especially for math, code and reasoning,
              where solutions can be verified automatically.
            </>,
            <>
              <Term>Contamination:</Term> if benchmark test questions leak into training data,
              the model "aces" evaluations by memory. Serious labs run decontamination passes;
              skeptical readers of benchmark claims check for them (Module 17).
            </>,
            <>
              <Term>The legal storm:</Term> much of the crawl is copyrighted. Whether training
              on it is fair use is being litigated right now, and licensing deals (news
              organizations, stock photo libraries, forums) are reshaping the supply chain
              (Module 17).
            </>,
          ]}
        />
        <WhyItMatters>
          Data explains model quirks that architecture can't: why models speak fluent Python but
          weak Swahili (mixture proportions), why they have a subtle Reddit-ish register
          (dialogue sources), why they know celebrity gossip but not your company's wiki
          (public vs private data — the gap RAG fills, Module 10), and why two models of
          identical size can differ wildly in quality.
        </WhyItMatters>
        <Misconception>
          "More data is always better." Past a point, quality and diversity beat volume. A
          striking demonstration: Microsoft's small "Phi" models, trained on carefully curated
          "textbook-quality" data, punched far above their weight class. Feeding a model twice
          the sewage doesn't make it twice as wise.
        </Misconception>
      </Section>

      <QuickCheck
        questions={[
          {
            question: 'Why is deduplication so important beyond saving compute?',
            options: [
              'Duplicates confuse the tokenizer',
              'Text seen many times gets memorized verbatim — a privacy, copyright and generalization problem',
              'It makes the dataset alphabetical',
              'GPUs overheat on repeated text',
            ],
            answer: 1,
            explanation:
              'Repetition etches exact sequences into weights. Dedup pushes the model toward learning patterns instead of transcripts.',
          },
          {
            question: 'Why do labs include lots of CODE even for general-purpose chat models?',
            options: [
              'Code is cheap to license',
              'Training on code measurably improves structured, step-by-step reasoning on non-code tasks',
              'Users only ask coding questions',
              'Code compresses better',
            ],
            answer: 1,
            explanation:
              'Code is text where logical structure is explicit and errors are unforgiving. Models trained with substantial code consistently reason better — one of the field\u2019s most useful empirical findings.',
          },
          {
            question: 'What is benchmark contamination?',
            options: [
              'Viruses in the training data',
              'Test questions leaking into training data, inflating scores via memorization',
              'Benchmarks that are too hard',
              'Mixing two benchmarks together',
            ],
            answer: 1,
            explanation:
              'If the model saw the exam during training, its score measures recall, not capability. Decontamination and fresh private test sets are the defenses.',
          },
        ]}
      />

      <Takeaways
        items={[
          <>Frontier models eat ~10T+ tokens: filtered web, code, books, reference, dialogue — a deliberately engineered mixture.</>,
          <>~90% of the raw crawl is discarded by the cleaning pipeline; filtering choices shape model character.</>,
          <>Dedup fights memorization; decontamination keeps benchmarks honest; synthetic data is filling the "data wall".</>,
          <>Data curation, not architecture, is where much of the competitive edge now lives.</>,
        ]}
      />
    </article>
  )
}
