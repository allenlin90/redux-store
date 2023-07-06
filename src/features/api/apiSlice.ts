import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => '/todos',
      transformResponse: (res: Todo[]) => res.sort((a, b) => b.id - a.id),
      providesTags: ['Todos'],
    }),
    addTodo: builder.mutation<Todo, Omit<Todo, 'id'>>({
      query: (todo) => ({
        url: '/todos',
        method: 'POST',
        body: { ...todo },
      }),
      invalidatesTags: ['Todos'],
    }),
    updateTodo: builder.mutation<Todo, Todo>({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: 'PATCH',
        body: todo,
      }),
      invalidatesTags: ['Todos'],
    }),
    deleteTodo: builder.mutation<Todo, Todo['id']>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['Todos'],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = apiSlice;
