import { sub } from 'date-fns';
import axios from 'axios';
import {
  type PayloadAction,
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
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

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState({
  status: 'idle' as Status,
  error: null as any,
  count: 0,
});

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
    reactionAdded: (
      state,
      action: PayloadAction<{ postId: number; reaction: keyof Reactions }>
    ) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    increaseCount: (state) => {
      state.count += 1;
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
        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = { ...initialReactions };
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Update could not complete');
          console.log(action.payload);
          return;
        }
        action.payload.date = new Date().toISOString();
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (typeof action.payload === 'string' || !action.payload?.id) {
          console.log('Delete could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        postsAdapter.removeOne(state, id);
      });
  },
});

// getSelectors creates these selectors and we rename them with alias
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts);

export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;
export const getCount = (state: RootState) => state.posts.count;

export const selectPostByUser = createSelector(
  [selectAllPosts, (_state: RootState, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

export const { increaseCount, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
