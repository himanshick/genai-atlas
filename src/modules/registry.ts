import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

/**
 * Maps "moduleId/conceptId" to its lazily-loaded page component.
 * Concepts not present here render the "coming soon" placeholder.
 */
export const conceptRegistry: Record<string, LazyExoticComponent<ComponentType>> = {
  'what-is-genai/ai-ml-dl-genai': lazy(() => import('./what-is-genai/AiMlDlGenai')),
  'what-is-genai/discriminative-vs-generative': lazy(
    () => import('./what-is-genai/DiscriminativeVsGenerative'),
  ),
  'what-is-genai/history-of-genai': lazy(() => import('./what-is-genai/HistoryOfGenai')),

  'how-machines-learn/data-and-patterns': lazy(
    () => import('./how-machines-learn/DataAndPatterns'),
  ),
  'how-machines-learn/loss-and-gradient-descent': lazy(
    () => import('./how-machines-learn/LossAndGradientDescent'),
  ),
  'how-machines-learn/training-vs-inference': lazy(
    () => import('./how-machines-learn/TrainingVsInference'),
  ),
  'how-machines-learn/overfitting-underfitting': lazy(
    () => import('./how-machines-learn/OverfittingUnderfitting'),
  ),

  'text-to-numbers/tokenization': lazy(() => import('./text-to-numbers/Tokenization')),
  'text-to-numbers/embeddings': lazy(() => import('./text-to-numbers/Embeddings')),
  'text-to-numbers/vector-arithmetic': lazy(() => import('./text-to-numbers/VectorArithmetic')),
  'text-to-numbers/similarity-measures': lazy(
    () => import('./text-to-numbers/SimilarityMeasures'),
  ),

  'road-to-transformers/n-grams': lazy(() => import('./road-to-transformers/NGrams')),
  'road-to-transformers/rnns': lazy(() => import('./road-to-transformers/Rnns')),
  'road-to-transformers/lstms': lazy(() => import('./road-to-transformers/Lstms')),
  'road-to-transformers/seq2seq-bottleneck': lazy(
    () => import('./road-to-transformers/Seq2SeqBottleneck'),
  ),
  'road-to-transformers/birth-of-attention': lazy(
    () => import('./road-to-transformers/BirthOfAttention'),
  ),

  'transformers/self-attention': lazy(() => import('./transformers/SelfAttention')),
  'transformers/multi-head-attention': lazy(() => import('./transformers/MultiHeadAttention')),
  'transformers/positional-encoding': lazy(() => import('./transformers/PositionalEncoding')),
  'transformers/residuals-layernorm': lazy(() => import('./transformers/ResidualsLayernorm')),
  'transformers/mlp-blocks': lazy(() => import('./transformers/MlpBlocks')),
  'transformers/encoder-vs-decoder': lazy(() => import('./transformers/EncoderVsDecoder')),
  'transformers/a-tokens-journey': lazy(() => import('./transformers/TokensJourney')),

  'training-llms/pretraining': lazy(() => import('./training-llms/Pretraining')),
  'training-llms/training-data': lazy(() => import('./training-llms/TrainingData')),
  'training-llms/scaling-laws': lazy(() => import('./training-llms/ScalingLaws')),
  'training-llms/emergent-abilities': lazy(() => import('./training-llms/EmergentAbilities')),
  'training-llms/instruction-tuning': lazy(() => import('./training-llms/InstructionTuning')),
  'training-llms/rlhf-and-dpo': lazy(() => import('./training-llms/RlhfAndDpo')),
  'training-llms/alignment': lazy(() => import('./training-llms/Alignment')),

  'generating-text/logits-to-probabilities': lazy(
    () => import('./generating-text/LogitsToProbabilities'),
  ),
  'generating-text/sampling-strategies': lazy(
    () => import('./generating-text/SamplingStrategies'),
  ),
  'generating-text/context-windows': lazy(() => import('./generating-text/ContextWindows')),
  'generating-text/kv-cache': lazy(() => import('./generating-text/KvCache')),
  'generating-text/speculative-decoding': lazy(
    () => import('./generating-text/SpeculativeDecoding'),
  ),
  'generating-text/why-hallucinations': lazy(
    () => import('./generating-text/WhyHallucinations'),
  ),

  'neural-networks/neurons-and-layers': lazy(() => import('./neural-networks/NeuronsAndLayers')),
  'neural-networks/activation-functions': lazy(
    () => import('./neural-networks/ActivationFunctions'),
  ),
  'neural-networks/backpropagation': lazy(() => import('./neural-networks/Backpropagation')),
  'neural-networks/why-depth-matters': lazy(() => import('./neural-networks/WhyDepthMatters')),
}
