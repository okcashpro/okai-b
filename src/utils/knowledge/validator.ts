import { z } from 'zod';
import type { KnowledgeBase } from '../../config/knowledge/types';
import type { KnowledgeCategory, KnowledgePrompt, QandA } from './types';

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  topics: z.array(z.string())
});

const promptSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  category: z.string()
});

const qaSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  lastModified: z.number()
});

const knowledgeBaseSchema = z.object({
  name: z.string(),
  topics: z.record(z.array(z.string())),
  prompts: z.record(z.string()),
  sampleQA: z.record(z.array(z.object({
    question: z.string(),
    answer: z.string()
  }))).optional(),
  knowledgeData: z.string().min(1, 'Knowledge data is required')
});

class SchemaValidator {
  validateKnowledgeBase(data: unknown): KnowledgeBase {
    return knowledgeBaseSchema.parse(data);
  }

  validateCategory(data: unknown): KnowledgeCategory {
    return categorySchema.parse(data);
  }

  validatePrompt(data: unknown): KnowledgePrompt {
    return promptSchema.parse(data);
  }

  validateQA(data: unknown): QandA {
    return qaSchema.parse(data);
  }
}

export const knowledgeValidator = new SchemaValidator();