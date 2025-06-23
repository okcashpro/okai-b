import { z } from 'zod';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  isAvailable: boolean;
}

// Model selection storage
const modelStorageKey = 'super_okai_selected_model';

// Model validation schema
const modelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  isFree: z.boolean(),
  isAvailable: z.boolean()
});

// Available models
export const models: AIModel[] = [
  {
    id: "google/gemini-2.0-flash-lite-preview-02-05:free",
    name: "Gemini Flash Lite 2.0 Preview",
    description: "Google's latest Gemini model optimized for fast, efficient responses",
    isFree: true,
    isAvailable: true
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o-mini",
    description: "OpenAI's compact yet powerful language model",
    isFree: false,
    isAvailable: true
  },
  {
    id: "openai/o3-mini",
    name: "o3 Mini",
    description: "OpenAI's optimized model for efficient processing",
    isFree: false,
    isAvailable: true
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    description: "Anthropic's advanced language model with enhanced capabilities",
    isFree: false,
    isAvailable: true
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    description: "DeepSeek-V3 is the latest model from the DeepSeek team",
    isFree: false,
    isAvailable: true
  },
  {
    id: "cognitivecomputations/dolphin3.0-mistral-24b:free",
    name: "Dolphin3.0 Mistral 24B",
    description: "Dolphin 3.0 is the next generation of the Dolphin series of instruct-tuned models.",
    isFree: true,
    isAvailable: true
  },
  {
    id: "qwen/qwen-vl-plus:free",
    name: "Qwen VL Plus",
    description: "Qwen's vision-language model with extended capabilities",
    isFree: true,
    isAvailable: true
  },
  {
    id: "qwen/qwen-max",
    name: "Qwen-Max",
    description: "Qwen's maximum performance language model",
    isFree: false,
    isAvailable: true
  },
  {
    id: "x-ai/grok-2-1212",
    name: "Grok 2 1212",
    description: "xAI's latest conversational AI model",
    isFree: false,
    isAvailable: true
  }
];

// Get default model (first in the list)
export const DEFAULT_MODEL = models[0].id;

// Model selection management
export function getSelectedModel(): string {
  try {
    const stored = localStorage.getItem(modelStorageKey);
    if (!stored) return DEFAULT_MODEL;

    const modelId = JSON.parse(stored);
    return models.some(m => m.id === modelId) ? modelId : DEFAULT_MODEL;
  } catch {
    return DEFAULT_MODEL;
  }
}

export function setSelectedModel(modelId: string): void {
  if (!models.some(m => m.id === modelId)) {
    throw new Error('Invalid model ID');
  }
  localStorage.setItem(modelStorageKey, JSON.stringify(modelId));
}

export function getModelById(modelId: string): AIModel | undefined {
  return models.find(m => m.id === modelId);
}