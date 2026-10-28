# GenAI Atlas

A personal, interactive learning platform covering every major Generative AI concept — explained in plain language with animated diagrams, click-through explainers and hands-on mini playgrounds. Built to be understandable by complete beginners while always answering the *why* and the *how*.

## Running it

```bash
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # production build into dist/
```

Requires Node 20+ (Node 22 recommended).

## Stack

- **React 19 + TypeScript + Vite** — app framework and build
- **Tailwind CSS v4** — styling (design tokens in `src/index.css`)
- **Framer Motion** — animated diagrams and transitions
- **React Router (hash routing)** — navigation, works on any static host

## How it's organized

```
src/
  data/curriculum.ts        ← the entire roadmap as data: 5 parts, 18 modules, ~90 concepts
  components/
    Layout.tsx              ← sidebar + header shell
    learn/                  ← reusable learning primitives:
      Callouts.tsx          ←   Analogy / WhyItMatters / Misconception / KeyIdea / DeepDive
      Prose.tsx             ←   Section / P / Term / List / Takeaways
      StepThrough.tsx       ←   click-through animated explainer
      WidgetShell.tsx       ←   frame + slider for interactive playgrounds
      QuickCheck.tsx        ←   multiple-choice self-check quizzes
  pages/                    ← Home (roadmap), Module, Concept pages
  modules/
    registry.ts             ← maps "moduleId/conceptId" → lazy page component
    <module-id>/<Concept>.tsx  ← one file per written concept
  hooks/useProgress.ts      ← localStorage "mark as understood" progress
```

## Adding a new concept

1. Its entry already exists in `src/data/curriculum.ts` (status `soon`). Flip it to `ready`.
2. Create `src/modules/<module-id>/<ConceptName>.tsx` following the pattern of any existing concept: Sections of prose, an interactive widget or `StepThrough`, callouts, a `QuickCheck`, and `Takeaways`.
3. Register it in `src/modules/registry.ts`.

Everything else — navigation, roadmap card, prev/next links, progress tracking — derives automatically from the curriculum data.

## Curriculum

- **Part 1 — Foundations** (live): What is GenAI · How Machines Learn · Neural Networks Intuitively
- **Part 2 — Language Models**: Text to Numbers · Road to Transformers · Transformers Deeply · Training an LLM · Generating Text
- **Part 3 — Using LLMs**: Prompting · RAG · Agents & Tool Use · Customizing Models
- **Part 4 — Beyond Text**: Image Generation · Audio & Speech · Video & World Models · Multimodal
- **Part 5 — The Bigger Picture**: Evaluation & Safety · Frontier & Ecosystem
