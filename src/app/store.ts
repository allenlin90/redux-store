import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import postsReducer from '~/features/posts/postsSlice';
import usersReducer from '~/features/users/usersSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatchTyped = () => useDispatch<AppDispatch>();
