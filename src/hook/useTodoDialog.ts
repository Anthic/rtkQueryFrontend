import { useState } from "react";
import type { ITodo } from "../types/todo.type";

export interface TodoDialogState {
  open: boolean;
  mode: "create" | "update";
  todo: ITodo | null;
}
export const useTodoDialog = () => {
  const [dialogState, setDialogState] = useState<TodoDialogState>({
    open: false,
    mode: "create",
    todo: null,
  });

  const openCreateDialog = () => {
    setDialogState({
      open: true,
      mode: "create",
      todo: null,
    });
  };
  const openUpdateDialog = (todo: ITodo) => {
    setDialogState({
      open: true,
      mode: "update",
      todo,
    });
  };
  const closeDialog = () => {
    setDialogState({
      open: false,
      mode: "create",
      todo: null,
    });
  };

  return {
    dialogState,
    openCreateDialog,
    openUpdateDialog,
    closeDialog,
  };
};
