import { configureStore } from "@reduxjs/toolkit";
import { todoApi } from "../service/todoApi";
import { authApi } from "../service/authApi";

export const store = configureStore({
  reducer: {
    [todoApi.reducerPath]: todoApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(todoApi.middleware)
      .concat(authApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;