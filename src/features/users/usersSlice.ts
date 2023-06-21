import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '~/app/store';

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

interface User {
  id: number;
  name: string;
}

const initialState: User[] = [];

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get<User[]>(USERS_URL);
  return [...response.data];
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (_state, action) => {
      return action.payload;
    });
  },
});

export const selectAllUsers = (state: RootState) => state.users;

export default usersSlice.reducer;
