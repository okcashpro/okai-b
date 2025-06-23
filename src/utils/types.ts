export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}