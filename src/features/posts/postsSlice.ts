import { sub } from 'date-fns';
import { type PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit';
import { RootState } from '~/app/store';

export interface Reactions {
  thumbsUp: number;
  wow: number;
  heart: number;
  rocket: number;
  coffee: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  date: string;
  reactions: Reactions;
}

export const initialReactions: Reactions = {
  thumbsUp: 0,
  wow: 0,
  heart: 0,
  rocket: 0,
  coffee: 0,
};

const initialState: Post[] = [
  {
    id: '1',
    title: 'Learning Redux Toolkit',
    content: "I've heard good things.",
    userId: '0',
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: initialReactions,
  },
  {
    id: '2',
    title: 'Slices...',
    content: 'The more I say slice, the more I want pizza',
    userId: '1',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: initialReactions,
  },
];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.push(action.payload);
      },
      prepare: (args: Omit<Post, 'id' | 'date' | 'reactions'>) => ({
        payload: {
          id: nanoid(),
          date: new Date().toISOString(),
          reactions: initialReactions,
          ...args,
        },
      }),
    },
    reactionAdded: (
      state,
      action: PayloadAction<{ postId: string; reaction: keyof Reactions }>
    ) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
});

export const selectAllPosts = (state: RootState) => state.posts;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
