export {};

declare global {
  type Status = 'pending' | 'idle' | 'loading' | 'succeeded' | 'failed';

  interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
    date: string;
  }

  interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
      street: string;
      suite: string;
      city: string;
      zipcode: string;
      geo: {
        lat: string;
        lng: string;
      };
    };
    phone: string;
    website: string;
    company: {
      name: string;
      catchPhrase: string;
      bs: string;
    };
  }
}
