import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  useGetAllTodosQuery,
  useDeleteTodoMutation,
  useToggleTodoMutation,
} from "../service/todoApi";

import TodoDialog from "../components/todo/TodoDialog";
import TodoEmptyState from "../components/todo/TodoEmptyState";
import TodoTableRow from "../components/todo/TodoTableRow";
import { useTodoDialog } from "../hook/useTodoDialog";
import { Bounce, toast } from "react-toastify";

export default function TodoTable() {
  const { data, isLoading, error } = useGetAllTodosQuery();
  const [deleteTodo] = useDeleteTodoMutation();
  const [toggleTodo] = useToggleTodoMutation();

  const { dialogState, openCreateDialog, openUpdateDialog, closeDialog } =
    useTodoDialog();

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      try {
        await deleteTodo(id).unwrap();
        toast.success("Todo deleted successfully! ", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (err) {
        console.error("Failed to delete todo:", err);
        toast.warn("Failed to delete todo. Please try again.", {
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
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const currentTodo = todos.find((todo) => todo.id === id);

      if (!currentTodo) return;
      await toggleTodo(id).unwrap();
      if (currentTodo.completed) {
        // Was completed, now pending
        toast.info("Task marked as pending! ", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        // Was pending, now completed
        toast.success("Task completed! ", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error("Failed to toggle todo:", err);
      toast.warn("Failed to toggle todo. Please try again.", {
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

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading todos. Please try again later.
      </Alert>
    );
  }

  const todos = data?.data || [];

  // Show empty state when no todos
  if (todos.length === 0) {
    return (
      <>
        <TodoEmptyState onCreateClick={openCreateDialog} />
        <TodoDialog
          open={dialogState.open}
          mode={dialogState.mode}
          todo={dialogState.todo}
          onClose={closeDialog}
        />
      </>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          My Todos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
        >
          Create Todo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="todo table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.map((todo) => (
              <TodoTableRow
                key={todo.id}
                todo={todo}
                onEdit={openUpdateDialog}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TodoDialog
        open={dialogState.open}
        mode={dialogState.mode}
        todo={dialogState.todo}
        onClose={closeDialog}
      />
    </Box>
  );
}
