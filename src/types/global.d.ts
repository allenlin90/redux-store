export {};

declare global {
  type Status = 'pending' | 'idle' | 'loading' | 'succeeded' | 'failed';
}
