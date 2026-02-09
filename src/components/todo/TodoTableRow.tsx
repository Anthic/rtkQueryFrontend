import { TableRow, TableCell, Chip, IconButton } from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from "@mui/icons-material";
import type { ITodo } from "../../types/todo.type";


interface TodoTableRowProps {
  todo: ITodo;
  onEdit: (todo: ITodo) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export default function TodoTableRow({
  todo,
  onEdit,
  onDelete,
  onToggle,
}: TodoTableRowProps) {
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>{todo.id}</TableCell>
      <TableCell>{todo.title}</TableCell>
      <TableCell>
        <Chip
          label={todo.completed ? "Completed" : "Pending"}
          color={todo.completed ? "success" : "warning"}
          size="small"
        />
      </TableCell>
      <TableCell>{new Date(todo.createdAt).toLocaleString()}</TableCell>
      <TableCell>{new Date(todo.updatedAt).toLocaleString()}</TableCell>
      <TableCell align="center">
        <IconButton
          color={todo.completed ? "default" : "success"}
          size="small"
          aria-label="toggle"
          onClick={() => onToggle(todo.id)}
          title={todo.completed ? "Mark as pending" : "Mark as completed"}
        >
          {todo.completed ? (
            <CheckCircleIcon />
          ) : (
            <RadioButtonUncheckedIcon />
          )}
        </IconButton>
        <IconButton
          color="primary"
          size="small"
          aria-label="edit"
          onClick={() => onEdit(todo)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          size="small"
          aria-label="delete"
          onClick={() => onDelete(todo.id)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}