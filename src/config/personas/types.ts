export type ChatLength = 'short' | 'normal' | 'long';

export interface PersonaStyle {
  emoticons?: string[];
  expressions: string[];
  endPhrases: string[];
  removals: RegExp[];
  formatters: ((content: string) => string)[];
}

export interface AIPersona {
  name: string;
  description: string;
  systemPrompt: string;
  knowledgeBases?: string[];
  customKnowledge?: string[];
  displayOrder?: number;
  model?: string;
  chatLength?: ChatLength;
  style?: PersonaStyle;
}