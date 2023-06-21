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
  id: number;
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

export const updatePost = createAsyncThunk<Post, Omit<Post, 'date'>>(
  'posts/updatePost',
  async (initialPost) => {
    const { id } = initialPost;
    const response = await axios.put<Post>(`${POSTS_URL}/${id}`, initialPost);
    return { ...initialPost, ...response.data };
  }
);

export const deletePost = createAsyncThunk<
  Pick<Post, 'id'> | string,
  Pick<Post, 'id'>
>('posts/deletePost', async (initialPost) => {
  const { id } = initialPost;
  const response = await axios.delete<Post>(`${POSTS_URL}/${id}`);
  if (response?.status === 200) return initialPost;
  return `${response?.status}: ${response?.statusText}`;
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
      action: PayloadAction<{ postId: number; reaction: keyof Reactions }>
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
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Update could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = [...posts, action.payload];
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (typeof action.payload === 'string' || !action.payload?.id) {
          console.log('Delete could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = posts;
      });
  },
});

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;

export const selectPostById = (state: RootState, postId: number) =>
  state.posts.posts.find((post) => post.id === postId);

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
