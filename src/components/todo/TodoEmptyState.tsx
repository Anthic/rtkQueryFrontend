import { Box, Typography, Button } from "@mui/material";
import { PlaylistAdd as PlaylistAddIcon } from "@mui/icons-material";

interface TodoEmptyStateProps {
  onCreateClick: () => void;
}

export default function TodoEmptyState({ onCreateClick }: TodoEmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        gap: 2,
      }}
    >
      <PlaylistAddIcon sx={{ fontSize: 80, color: "text.secondary" }} />
      <Typography variant="h5" color="text.secondary">
        No Todos Yet
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Get started by creating your first todo
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<PlaylistAddIcon />}
        onClick={onCreateClick}
        sx={{ mt: 2 }}
      >
        Create Todo
      </Button>
    </Box>
  );
}
