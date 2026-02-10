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
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  useCreateTodosMutation,
  useUpdateTodoMutation,
} from "../../service/todoApi";
import type { ITodo } from "../../types/todo.type";
import { Bounce, toast } from "react-toastify";
import { Close, CloudUpload } from "@mui/icons-material";

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [createTodo, { isLoading: isCreating }] = useCreateTodosMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const isLoading = isCreating || isUpdating;

  // Reset form when dialog opens/closes or todo changes
  useEffect(() => {
    if (open && mode === "update" && todo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(todo.title);
      setCompleted(todo.completed);
      setPreviewUrl(todo.image);
      setSelectedFile(null);
    } else if (open && mode === "create") {
      setTitle("");
      setCompleted(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [open, mode, todo]);
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith("http")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    //Validate file type
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
    setSelectedFile(file);

    //create preview
    const render = new FileReader();
    render.onloadend = () => {
      setPreviewUrl(render.result as string);
    };

    render.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl && !previewUrl.startsWith("http")) {
      URL.revokeObjectURL(previewUrl);
    }
  };

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
        await createTodo({ title, image: selectedFile || undefined }).unwrap();
        toast.success("Todo created successfully! ", {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (mode === "update" && todo) {
        await updateTodo({
          id: todo.id,
          data: { title, completed, image: selectedFile || undefined },
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
    setSelectedFile(null);

    if (previewUrl && !previewUrl.startsWith("http")) {
      URL.revokeObjectURL(previewUrl);
    }
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

            {/* Image Upload Section */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Image (Optional)
              </Typography>

              {previewUrl && (
                <Box
                  sx={{ position: "relative", display: "inline-block", mb: 2 }}
                >
                  <Avatar
                    src={previewUrl}
                    variant="rounded"
                    sx={{ width: 120, height: 120 }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: "background.paper",
                      "&:hover": { bgcolor: "error.light" },
                    }}
                    onClick={handleRemoveImage}
                    disabled={isLoading}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              )}

              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                disabled={isLoading}
                fullWidth
              >
                {previewUrl ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                />
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Supported: JPEG, PNG, GIF, WebP (Max 5MB)
              </Typography>
            </Box>
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
