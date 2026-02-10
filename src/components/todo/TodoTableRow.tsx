import {
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
  Avatar,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from "@mui/icons-material";
import type { ITodo } from "../../types/todo.type";
import { useRef } from "react";
import { useUploadTodoImageMutation } from "../../service/todoApi";
import { toast } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadImage, { isLoading: isUploading }] =
    useUploadTodoImageMutation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    try {
      await uploadImage({ id: todo.id, file }).unwrap();
      toast.success("Image uploaded successfully!");

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>{todo.id}</TableCell>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {todo.image ? (
            <Avatar
              src={todo.image}
              alt={todo.title}
              variant="rounded"
              sx={{ width: 48, height: 48 }}
            />
          ) : (
            <Avatar
              variant="rounded"
              sx={{ width: 48, height: 48, bgcolor: "grey.200" }}
            >
              <ImageIcon sx={{ color: "grey.500" }} />
            </Avatar>
          )}
          <span>{todo.title}</span>
        </Box>
      </TableCell>
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
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        <Tooltip title={todo.image ? "Change image" : "Upload image"}>
          <IconButton
            color="info"
            size="small"
            aria-label="upload"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip
          title={todo.completed ? "Mark as pending" : "Mark as completed"}
        >
          <IconButton
            color={todo.completed ? "default" : "success"}
            size="small"
            aria-label="toggle"
            onClick={() => onToggle(todo.id)}
          >
            {todo.completed ? (
              <CheckCircleIcon />
            ) : (
              <RadioButtonUncheckedIcon />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title="Edit">
          <IconButton
            color="primary"
            size="small"
            aria-label="edit"
            onClick={() => onEdit(todo)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton
            color="error"
            size="small"
            aria-label="delete"
            onClick={() => onDelete(todo.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
