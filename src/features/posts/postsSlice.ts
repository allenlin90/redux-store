import { sub } from 'date-fns';
import axios from 'axios';
import {
  type PayloadAction,
  createSlice,
  createAsyncThunk,
  nanoid,
} from '@reduxjs/toolkit';
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
  body: string;
  userId: number;
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

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Learning Redux Toolkit',
    body: "I've heard good things.",
    userId: 0,
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: initialReactions,
  },
  {
    id: '2',
    title: 'Slices...',
    body: 'The more I say slice, the more I want pizza',
    userId: 1,
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: initialReactions,
  },
];

const initialState = {
  posts: [] as Post[],
  status: 'idle' as Status,
  error: null as any,
};

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get<Post[]>(POSTS_URL);
  return [...response.data];
});

export const addNewPost = createAsyncThunk<
  Post,
  Pick<Post, 'title' | 'body'> & { userId: string }
>('posts/addNewPost', async (initialPost) => {
  const response = await axios.post<Post>(POSTS_URL, initialPost);

  return response.data;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.posts.push(action.payload);
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
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Adding date and reactions
        let min = 1;
        const loadedPosts: Post[] = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = { ...initialReactions };
          return post;
        });

        // Add any fetched posts to the array
        state.posts = state.posts.concat(loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = { ...initialReactions };
        state.posts.push(action.payload);
      });
  },
});

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
