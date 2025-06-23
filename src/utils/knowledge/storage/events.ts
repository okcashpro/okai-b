import type { StorageEventEmitter } from './types';

export class StorageEvents implements StorageEventEmitter {
  emit(): void {
    window.dispatchEvent(new Event('storage'));
  }
}