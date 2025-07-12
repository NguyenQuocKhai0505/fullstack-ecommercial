import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
  title = "Confirm Delete",
  content = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel"
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{content}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="outlined" disabled={loading}>
        {cancelText}
      </Button>
      <Button
        onClick={onConfirm}
        color="error"
        variant="contained"
        disabled={loading}
        autoFocus
      >
        {loading ? "Deleting..." : confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmDialog;