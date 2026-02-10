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
      query: (body) => {
        if (body.image) {
          const formData = new FormData();
          formData.append("title", body.title);
          formData.append("image", body.image);
          return {
            url: "/",
            method: "POST",
            body: formData,
          };
        }
        return {
          url: "/",
          method: "POST",
          body: { title: body.title },
        };
      },
      invalidatesTags: ["Todo"],
    }),

    //update todos
    updateTodo: builder.mutation<
      ApiResponse<ITodo>,
      { id: number; data: UpdatedTodoDTO }
    >({
      query: ({ id, data }) => {
        if (data.image) {
          const formData = new FormData();
          if (data.title) formData.append("title", data.title);
          if (data.completed !== undefined) {
            formData.append("completed", String(data.completed));
          }
          formData.append("image", data.image);
          return {
            url: `/${id}`,
            method: "PATCH",
            body: formData,
          };
        }
        return {
          url: `/${id}`,
          method: "PATCH",
          body: data,
        };
      },
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

    //separate endpoint for inline image upload (row - level upload)
    uploadTodoImage: builder.mutation<
      ApiResponse<ITodo>,
      { id: number; file: File }
    >({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("image", file);

        return {
          url: `/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
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
  useUploadTodoImageMutation,
  useToggleTodoMutation,
} = todoApi;
