import type { LogEvent, LogEventListener } from './types';

export class EventEmitter {
  private listeners: LogEventListener[] = [];

  addListener(listener: LogEventListener): void {
    this.listeners.push(listener);
  }

  removeListener(listener: LogEventListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  emit(event: LogEvent): void {
    this.listeners.forEach(listener => listener(event));
  }
}

export const logEvents = new EventEmitter();