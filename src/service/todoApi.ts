import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ApiResponse,
  CreatedTodoDTO,
  ITodo,
  UpdatedTodoDTO,
} from "../types/todo.type";

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  tagTypes: ["Todo"],
  endpoints: (builder) => ({
    //get all todos
    getAllTodos: builder.query<ApiResponse<ITodo[]>, void>({
      query: () => "/",
      providesTags: ["Todo"],
    }),

    //get todos by id
    getTodosById: builder.query<ApiResponse<ITodo>, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Todo", id }],
    }),

    //post todos
    createTodos: builder.mutation<ApiResponse<ITodo>, CreatedTodoDTO>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Todo"],
    }),

    //update todos
    updateTodo: builder.mutation<
      ApiResponse<ITodo>,
      { id: number; data: UpdatedTodoDTO }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Todo"],
    }),
    // delete todos
    deleteTodo: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todo"],
    }),

    //toggle that
    toggleTodo: builder.mutation<ApiResponse<ITodo>, number>({
      query: (id) => ({
        url: `/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Todo"],
    }),
  }),
});

export const {
  useGetAllTodosQuery,
  useCreateTodosMutation,
  useDeleteTodoMutation,
  useGetTodosByIdQuery,
  useUpdateTodoMutation,
  useToggleTodoMutation,
} = todoApi;
