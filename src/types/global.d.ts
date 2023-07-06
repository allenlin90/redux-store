export {};

declare global {
  type Status = 'pending' | 'idle' | 'loading' | 'succeeded' | 'failed';
  interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  }
}
