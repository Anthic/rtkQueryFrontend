import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  useCreateTodosMutation,
  useUpdateTodoMutation,
} from "../../service/todoApi";
import type { ITodo } from "../../types/todo.type";
import { Bounce, toast } from "react-toastify";

interface TodoDialogProps {
  open: boolean;
  mode: "create" | "update";
  todo: ITodo | null;
  onClose: () => void;
}

export default function TodoDialog({
  open,
  mode,
  todo,
  onClose,
}: TodoDialogProps) {
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);

  const [createTodo, { isLoading: isCreating }] = useCreateTodosMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();

  const isLoading = isCreating || isUpdating;

  // Reset form when dialog opens/closes or todo changes
  useEffect(() => {
    if (open && mode === "update" && todo) {
      setTitle(todo.title);
      setCompleted(todo.completed);
    } else if (open && mode === "create") {
      setTitle("");
      setCompleted(false);
    }
  }, [open, mode, todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.warn("Please enter a title", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    try {
      if (mode === "create") {
        await createTodo({ title }).unwrap();
        toast.success("Todo created successfully! ", {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (mode === "update" && todo) {
        await updateTodo({
          id: todo.id,
          data: { title, completed },
        }).unwrap();
        toast.success("Todo updated successfully! ", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      handleClose();
    } catch (error) {
      console.error("Failed to save todo:", error);
      toast.warn("Failed to save todo. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleClose = () => {
    setTitle("");
    setCompleted(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === "create" ? "Create New Todo" : "Update Todo"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Todo Title"
              type="text"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              required
            />
            {mode === "update" && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    disabled={isLoading}
                  />
                }
                label="Completed"
                sx={{ mt: 2 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
