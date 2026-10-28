export type ConceptStatus = 'ready' | 'soon'

export interface Concept {
  id: string
  title: string
  tagline: string
  status: ConceptStatus
}

export interface Module {
  id: string
  number: number
  title: string
  partId: number
  description: string
  concepts: Concept[]
}

export interface Part {
  id: number
  title: string
  subtitle: string
  /** Tailwind color token name, e.g. "part1" */
  color: string
}

export const parts: Part[] = [
  { id: 1, title: 'Foundations', subtitle: 'What learning machines actually are', color: 'part1' },
  { id: 2, title: 'Language Models', subtitle: 'How machines learned to speak', color: 'part2' },
  { id: 3, title: 'Using LLMs', subtitle: 'Prompting, RAG, agents and customization', color: 'part3' },
  { id: 4, title: 'Beyond Text', subtitle: 'Images, audio, video and multimodal AI', color: 'part4' },
  { id: 5, title: 'The Bigger Picture', subtitle: 'Evaluation, safety and the frontier', color: 'part5' },
]

export const modules: Module[] = [
  {
    id: 'what-is-genai',
    number: 1,
    title: 'What is GenAI?',
    partId: 1,
    description:
      'Untangle the buzzwords. What separates AI from ML from deep learning from generative AI — and how we got here.',
    concepts: [
      {
        id: 'ai-ml-dl-genai',
        title: 'AI vs ML vs DL vs GenAI',
        tagline: 'Four nested circles that everyone confuses — untangled with an interactive map.',
        status: 'ready',
      },
      {
        id: 'discriminative-vs-generative',
        title: 'Discriminative vs Generative',
        tagline: 'The difference between recognizing a cat and dreaming one up.',
        status: 'ready',
      },
      {
        id: 'history-of-genai',
        title: 'A Brief History of GenAI',
        tagline: 'From a 1950s thought experiment to ChatGPT — an interactive timeline.',
        status: 'ready',
      },
    ],
  },
  {
    id: 'how-machines-learn',
    number: 2,
    title: 'How Machines Learn',
    partId: 1,
    description:
      'No magic, just math you can feel. Data, weights, loss, and the humble ball rolling downhill that trains every model on Earth.',
    concepts: [
      {
        id: 'data-and-patterns',
        title: 'Data, Patterns & Weights',
        tagline: 'Learning is just turning millions of tiny knobs until the answers come out right.',
        status: 'ready',
      },
      {
        id: 'loss-and-gradient-descent',
        title: 'Loss & Gradient Descent',
        tagline: 'The ball-rolling-downhill trick that trains every neural network — play with it live.',
        status: 'ready',
      },
      {
        id: 'training-vs-inference',
        title: 'Training vs Inference',
        tagline: 'Why learning takes months on thousands of GPUs but answering takes milliseconds.',
        status: 'ready',
      },
      {
        id: 'overfitting-underfitting',
        title: 'Overfitting & Underfitting',
        tagline: 'Memorizing the textbook vs understanding the subject — see it happen with a slider.',
        status: 'ready',
      },
    ],
  },
  {
    id: 'neural-networks',
    number: 3,
    title: 'Neural Networks Intuitively',
    partId: 1,
    description:
      'Neurons, layers and the surprisingly simple machinery inside every modern AI — animated end to end.',
    concepts: [
      {
        id: 'neurons-and-layers',
        title: 'Neurons & Layers',
        tagline: 'A neuron is a tiny voting machine. Stack enough of them and they can learn anything.',
        status: 'ready',
      },
      {
        id: 'activation-functions',
        title: 'Activation Functions',
        tagline: 'The little bend that gives networks their superpowers — explore the curves live.',
        status: 'ready',
      },
      {
        id: 'backpropagation',
        title: 'Backpropagation',
        tagline: 'How blame flows backwards through a network — watch the signal travel.',
        status: 'ready',
      },
      {
        id: 'why-depth-matters',
        title: 'Why Depth Matters',
        tagline: 'Edges become shapes become faces: why deep beats wide.',
        status: 'ready',
      },
    ],
  },
  {
    id: 'text-to-numbers',
    number: 4,
    title: 'From Text to Numbers',
    partId: 2,
    description:
      'Models cannot read. Tokenization and embeddings — how words become numbers that carry meaning.',
    concepts: [
      { id: 'tokenization', title: 'Tokenization', tagline: 'How text gets chopped into the pieces a model can digest — try the interactive tokenizer.', status: 'ready' },
      { id: 'embeddings', title: 'Embeddings', tagline: 'Turning every word into a point in space, where nearby means similar.', status: 'ready' },
      { id: 'vector-arithmetic', title: 'Vector Arithmetic', tagline: 'king − man + woman ≈ queen: meaning you can do math with.', status: 'ready' },
      { id: 'similarity-measures', title: 'Measuring Similarity', tagline: 'Cosine similarity and friends: how machines judge "close in meaning".', status: 'ready' },
    ],
  },
  {
    id: 'road-to-transformers',
    number: 5,
    title: 'The Road to Transformers',
    partId: 2,
    description:
      'Fifty years of trying to model language — and the bottleneck that attention finally broke.',
    concepts: [
      { id: 'n-grams', title: 'N-grams', tagline: 'The original autocomplete: predicting the next word by counting.', status: 'ready' },
      { id: 'rnns', title: 'RNNs', tagline: 'Networks with memory — reading one word at a time, carrying a summary forward.', status: 'ready' },
      { id: 'lstms', title: 'LSTMs & Gates', tagline: 'Teaching memory what to keep and what to forget.', status: 'ready' },
      { id: 'seq2seq-bottleneck', title: 'Seq2Seq & the Bottleneck', tagline: 'Squeezing a whole sentence into one vector — and why it fails on long inputs.', status: 'ready' },
      { id: 'birth-of-attention', title: 'The Birth of Attention', tagline: 'The 2014 insight that let models look back at everything.', status: 'ready' },
    ],
  },
  {
    id: 'transformers',
    number: 6,
    title: 'Transformers, Deeply',
    partId: 2,
    description:
      'The architecture behind everything. Self-attention, multi-head attention, and the full journey of one token.',
    concepts: [
      { id: 'self-attention', title: 'Self-Attention', tagline: 'Every word looks at every other word — visualize the attention weights yourself.', status: 'ready' },
      { id: 'multi-head-attention', title: 'Multi-Head Attention', tagline: 'Many spotlights at once: grammar, meaning, and reference in parallel.', status: 'ready' },
      { id: 'positional-encoding', title: 'Positional Encoding', tagline: 'Attention is order-blind. Here is how models know word #3 comes before word #4.', status: 'ready' },
      { id: 'residuals-layernorm', title: 'Residuals & LayerNorm', tagline: 'The plumbing that lets 100-layer networks actually train.', status: 'ready' },
      { id: 'mlp-blocks', title: 'The MLP Block', tagline: 'Where transformers store most of what they know.', status: 'ready' },
      { id: 'encoder-vs-decoder', title: 'Encoder vs Decoder', tagline: 'BERT reads, GPT writes: the three transformer family shapes.', status: 'ready' },
      { id: 'a-tokens-journey', title: "A Token's Journey", tagline: 'Step through the full data flow, from raw text to next-word prediction.', status: 'ready' },
    ],
  },
  {
    id: 'training-llms',
    number: 7,
    title: 'Training an LLM',
    partId: 2,
    description:
      'From a trillion words of internet to a helpful assistant: pretraining, scaling laws, instruction tuning and RLHF.',
    concepts: [
      { id: 'pretraining', title: 'Pretraining & Next-Token Prediction', tagline: 'One simple game — guess the next word — played a trillion times.', status: 'ready' },
      { id: 'training-data', title: 'Training Data', tagline: 'What is actually in the trillion-word diet of a frontier model.', status: 'ready' },
      { id: 'scaling-laws', title: 'Scaling Laws', tagline: 'Bigger is predictably better — the curves that launched a compute arms race.', status: 'ready' },
      { id: 'emergent-abilities', title: 'Emergent Abilities', tagline: 'Skills nobody trained for that appear when models get big enough.', status: 'ready' },
      { id: 'instruction-tuning', title: 'Instruction Tuning', tagline: 'Turning an autocomplete engine into something that follows orders.', status: 'ready' },
      { id: 'rlhf-and-dpo', title: 'RLHF & DPO', tagline: 'Teaching models what humans prefer, one comparison at a time.', status: 'ready' },
      { id: 'alignment', title: 'Alignment', tagline: 'Making models helpful, honest and harmless — and why it is hard.', status: 'ready' },
    ],
  },
  {
    id: 'generating-text',
    number: 8,
    title: 'Generating Text',
    partId: 2,
    description:
      'What actually happens when a model "thinks": logits, temperature, sampling — and why hallucinations are baked in.',
    concepts: [
      { id: 'logits-to-probabilities', title: 'Logits to Probabilities', tagline: 'The model never picks a word — it scores all of them.', status: 'ready' },
      { id: 'sampling-strategies', title: 'Temperature, Top-k & Top-p', tagline: 'The dials that make output creative or boring — play with a live distribution.', status: 'ready' },
      { id: 'context-windows', title: 'Context Windows', tagline: "The model's working memory, and what happens when you run out.", status: 'ready' },
      { id: 'kv-cache', title: 'The KV Cache', tagline: 'Why generating token #1000 does not require re-reading tokens 1–999.', status: 'ready' },
      { id: 'speculative-decoding', title: 'Speculative Decoding', tagline: 'A small model drafts, a big model checks: free speed.', status: 'ready' },
      { id: 'why-hallucinations', title: 'Why Models Hallucinate', tagline: 'Confident nonsense is not a bug — it is a direct consequence of how LLMs work.', status: 'ready' },
    ],
  },
  {
    id: 'prompting',
    number: 9,
    title: 'Prompting',
    partId: 3,
    description:
      'Programming in plain English: shots, chains of thought, system prompts — and how prompts get hijacked.',
    concepts: [
      { id: 'zero-few-shot', title: 'Zero-shot & Few-shot', tagline: 'Show, don\u2019t tell: why a couple of examples beat a page of instructions.', status: 'soon' },
      { id: 'chain-of-thought', title: 'Chain-of-Thought', tagline: '"Think step by step" — why four words can double accuracy.', status: 'soon' },
      { id: 'system-prompts', title: 'System Prompts & Roles', tagline: 'The hidden instructions that shape every conversation.', status: 'soon' },
      { id: 'structured-output', title: 'Structured Output', tagline: 'Getting reliable JSON out of a creative-writing machine.', status: 'soon' },
      { id: 'prompt-injection', title: 'Prompt Injection & Jailbreaks', tagline: 'When the data becomes the instructions: the SQL injection of the LLM era.', status: 'soon' },
    ],
  },
  {
    id: 'rag',
    number: 10,
    title: 'RAG & Embeddings in Practice',
    partId: 3,
    description:
      'Give the model an open-book exam: retrieval, chunking, vector databases and the full RAG pipeline.',
    concepts: [
      { id: 'why-rag', title: 'Why RAG Exists', tagline: 'Frozen knowledge, private data and hallucinations — the three problems retrieval solves.', status: 'soon' },
      { id: 'chunking', title: 'Chunking', tagline: 'Slicing documents so the right piece can be found — try the interactive chunker.', status: 'soon' },
      { id: 'vector-databases', title: 'Vector Databases', tagline: 'Finding the nearest needle in a billion-vector haystack, fast.', status: 'soon' },
      { id: 'similarity-search', title: 'Similarity Search', tagline: 'How "meaning search" beats keyword search — and where it fails.', status: 'soon' },
      { id: 'hybrid-reranking', title: 'Hybrid Search & Reranking', tagline: 'Combining old-school keywords with vectors, then re-sorting for quality.', status: 'soon' },
      { id: 'rag-pipeline', title: 'The Full RAG Pipeline', tagline: 'Question to answer, end to end — an animated walkthrough.', status: 'soon' },
    ],
  },
  {
    id: 'agents',
    number: 11,
    title: 'Agents & Tool Use',
    partId: 3,
    description:
      'From chatbot to coworker: function calling, the ReAct loop, memory, planning and multi-agent systems.',
    concepts: [
      { id: 'function-calling', title: 'Function Calling', tagline: 'How a text model presses buttons in the real world.', status: 'soon' },
      { id: 'react-loop', title: 'The ReAct Loop', tagline: 'Think, act, observe, repeat — step through a live agent simulation.', status: 'soon' },
      { id: 'planning', title: 'Planning', tagline: 'Breaking "book me a holiday" into forty small steps.', status: 'soon' },
      { id: 'memory', title: 'Agent Memory', tagline: 'Short-term, long-term and everything in between.', status: 'soon' },
      { id: 'multi-agent', title: 'Multi-Agent Systems', tagline: 'Teams of AIs that delegate, review and argue with each other.', status: 'soon' },
      { id: 'mcp', title: 'MCP', tagline: 'The USB port for AI tools: one protocol to connect models to everything.', status: 'soon' },
    ],
  },
  {
    id: 'customizing-models',
    number: 12,
    title: 'Customizing Models',
    partId: 3,
    description:
      'Making a model yours: fine-tuning, LoRA, distillation, quantization and running LLMs on your laptop.',
    concepts: [
      { id: 'finetuning-vs-peft', title: 'Fine-tuning vs PEFT', tagline: 'Retrain everything, or just a sliver? The economics of customization.', status: 'soon' },
      { id: 'lora', title: 'LoRA', tagline: 'The low-rank trick that fine-tunes a 70B model on a gaming GPU.', status: 'soon' },
      { id: 'distillation', title: 'Distillation', tagline: 'A big model teaches a small one — compressing intelligence itself.', status: 'soon' },
      { id: 'quantization', title: 'Quantization', tagline: 'Shrinking models 4x by rounding the numbers — see the precision trade-off live.', status: 'soon' },
      { id: 'running-locally', title: 'Running Models Locally', tagline: 'GGUF, Ollama and llama.cpp: frontier-ish AI on your own machine.', status: 'soon' },
    ],
  },
  {
    id: 'image-generation',
    number: 13,
    title: 'Image Generation',
    partId: 4,
    description:
      'From noise to art: VAEs, GANs, CLIP and the diffusion revolution behind Midjourney and Stable Diffusion.',
    concepts: [
      { id: 'vaes', title: 'VAEs', tagline: 'Compressing images into a smooth space you can explore and sample from.', status: 'soon' },
      { id: 'gans', title: 'GANs', tagline: 'A forger and a detective locked in an arms race — watch the duel.', status: 'soon' },
      { id: 'clip', title: 'CLIP', tagline: 'The model that connected words to images and unlocked text-to-image.', status: 'soon' },
      { id: 'diffusion', title: 'Diffusion Models', tagline: 'Destroying images with noise, then learning to reverse it — slide through denoising.', status: 'soon' },
      { id: 'latent-diffusion', title: 'Latent Diffusion', tagline: 'The compression trick that made Stable Diffusion run on consumer GPUs.', status: 'soon' },
      { id: 'controlnet-styles', title: 'ControlNet & Style LoRAs', tagline: 'Steering image generation with poses, sketches and custom styles.', status: 'soon' },
    ],
  },
  {
    id: 'audio-speech',
    number: 14,
    title: 'Audio & Speech',
    partId: 4,
    description:
      'Machines that listen, speak and compose: speech recognition, text-to-speech, voice cloning and music generation.',
    concepts: [
      { id: 'asr', title: 'Speech Recognition (ASR)', tagline: 'How Whisper turns sound waves into text in 100 languages.', status: 'soon' },
      { id: 'tts', title: 'Text-to-Speech', tagline: 'From robotic voices to speech you cannot tell from human.', status: 'soon' },
      { id: 'voice-cloning', title: 'Voice Cloning', tagline: 'Your voice from three seconds of audio — how, and why it is scary.', status: 'soon' },
      { id: 'music-generation', title: 'Music Generation', tagline: 'Full songs from a text prompt: audio tokens and long-range structure.', status: 'soon' },
    ],
  },
  {
    id: 'video-world-models',
    number: 15,
    title: 'Video & World Models',
    partId: 4,
    description:
      'The hardest generation problem: video that stays consistent over time — and models that simulate reality itself.',
    concepts: [
      { id: 'text-to-video', title: 'Text-to-Video', tagline: 'Why video is diffusion on hard mode.', status: 'soon' },
      { id: 'temporal-consistency', title: 'Temporal Consistency', tagline: 'Keeping the same face, the same shirt, the same physics across frames.', status: 'soon' },
      { id: 'world-models', title: 'World Models', tagline: 'From generating pixels to simulating worlds you can act in.', status: 'soon' },
    ],
  },
  {
    id: 'multimodal',
    number: 16,
    title: 'Multimodal Models',
    partId: 4,
    description:
      'One model, every sense: how images, audio and text end up as tokens in the same brain.',
    concepts: [
      { id: 'vision-language-models', title: 'Vision-Language Models', tagline: 'How GPT-4V "sees": bolting an eye onto a language brain.', status: 'soon' },
      { id: 'images-as-tokens', title: 'Images as Tokens', tagline: 'Slicing a photo into patches the transformer treats like words.', status: 'soon' },
      { id: 'any-to-any', title: 'Any-to-Any Models', tagline: 'Text in, image out; audio in, video out: natively multimodal AI.', status: 'soon' },
    ],
  },
  {
    id: 'evaluation-safety',
    number: 17,
    title: 'Evaluation & Safety',
    partId: 5,
    description:
      'How do we know a model is good — or safe? Benchmarks, judges, bias, guardrails and red-teaming.',
    concepts: [
      { id: 'benchmarks', title: 'Benchmarks', tagline: 'MMLU, HumanEval and friends — and why models keep "beating" saturated tests.', status: 'soon' },
      { id: 'llm-as-judge', title: 'LLM-as-Judge', tagline: 'Using AI to grade AI: powerful, cheap, and subtly biased.', status: 'soon' },
      { id: 'measuring-hallucinations', title: 'Measuring Hallucinations', tagline: 'Catching confident lies at scale.', status: 'soon' },
      { id: 'bias-fairness', title: 'Bias & Fairness', tagline: 'Models inherit the internet\u2019s prejudices — where bias enters and how it is measured.', status: 'soon' },
      { id: 'guardrails', title: 'Guardrails', tagline: 'The safety layers wrapped around models in production.', status: 'soon' },
      { id: 'red-teaming', title: 'Red-Teaming', tagline: 'Professional model-breakers, and what they find.', status: 'soon' },
      { id: 'copyright-ethics', title: 'Copyright & Ethics', tagline: 'Trained on everyone\u2019s work: the open legal questions of GenAI.', status: 'soon' },
    ],
  },
  {
    id: 'frontier',
    number: 18,
    title: 'Frontier & Ecosystem',
    partId: 5,
    description:
      'Where the field is going: mixture of experts, reasoning models, new architectures, and the map of labs and models.',
    concepts: [
      { id: 'mixture-of-experts', title: 'Mixture of Experts', tagline: 'A trillion parameters where only a fraction wake up per token — watch the router.', status: 'soon' },
      { id: 'reasoning-models', title: 'Reasoning & Test-Time Compute', tagline: 'Models that think longer before answering — the o1 paradigm.', status: 'soon' },
      { id: 'long-context', title: 'Long Context', tagline: 'From 2K to millions of tokens: the tricks behind giant context windows.', status: 'soon' },
      { id: 'state-space-models', title: 'State Space Models', tagline: 'Mamba and the challengers to the transformer throne.', status: 'soon' },
      { id: 'open-vs-closed', title: 'Open vs Closed Models', tagline: 'Weights on HuggingFace vs API behind a paywall — what "open" really means.', status: 'soon' },
      { id: 'labs-and-models', title: 'The Labs & Model Families', tagline: 'OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek: who builds what.', status: 'soon' },
      { id: 'whats-next', title: "What's Next", tagline: 'Agents everywhere, world models, and the road to AGI — informed speculation.', status: 'soon' },
    ],
  },
]

/* ---------- helpers ---------- */

export function getPart(partId: number): Part {
  return parts.find((p) => p.id === partId)!
}

export function getModule(moduleId: string): Module | undefined {
  return modules.find((m) => m.id === moduleId)
}

export function getConcept(moduleId: string, conceptId: string): Concept | undefined {
  return getModule(moduleId)?.concepts.find((c) => c.id === conceptId)
}

/** Flat ordered list of every concept, for prev/next navigation. */
export const allConcepts: { moduleId: string; concept: Concept }[] = modules.flatMap((m) =>
  m.concepts.map((c) => ({ moduleId: m.id, concept: c })),
)

export function getAdjacent(moduleId: string, conceptId: string) {
  const idx = allConcepts.findIndex((e) => e.moduleId === moduleId && e.concept.id === conceptId)
  return {
    prev: idx > 0 ? allConcepts[idx - 1] : null,
    next: idx >= 0 && idx < allConcepts.length - 1 ? allConcepts[idx + 1] : null,
  }
}

export const totalConcepts = allConcepts.length
export const readyConcepts = allConcepts.filter((e) => e.concept.status === 'ready').length

/** Accent hex per part id (for inline styles on SVG etc.) */
export const partHex: Record<number, string> = {
  1: '#38bdf8',
  2: '#a78bfa',
  3: '#34d399',
  4: '#fb923c',
  5: '#f472b6',
}
