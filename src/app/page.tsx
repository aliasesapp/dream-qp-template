"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

// TypeScript Interfaces
interface Deal {
  id: string;
  name: string;
  description?: string; // Optional if not used
  status?: string; // Optional if not used
  createdAt: string;
  user_email: string;
  deal_values: any[]; // Adjust based on actual structure
  admin_locked?: boolean;
  date?: string;
  integration_id?: string | null;
  state?: "closed" | "open" | "lost";
  metadata?: Record<string, any> | null;
  // Add other fields as needed based on API response
}

interface ApiResponse<T> {
  count?: number;
  next?: string;
  previous?: string;
  results?: T[];
  data?: T;
  error?: string;
}

// Main Component
export default function HomePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentDeal, setCurrentDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    user_email: string;
    deal_values: any[]; // Adjust based on actual structure
    admin_locked?: boolean;
    date?: string;
    integration_id?: string | null;
    state?: "closed" | "open" | "lost";
    metadata?: Record<string, any> | null;
  }>({
    name: "",
    user_email: "",
    deal_values: [{}], // Initialize with at least one object
  });
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  // Fetch Deals
  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/qp/deal", {
        method: "GET",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch deals.");
      }
      const result: ApiResponse<Deal> = await response.json();
      setDeals(result.results || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch deals.");
      setSnackbar({
        message: err.message || "Failed to fetch deals.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentDeal ? "PUT" : "POST";
      const endpoint = currentDeal
        ? `/api/qp/deal/${currentDeal.id}/update`
        : "/api/qp/deal/create";

      // Prepare payload based on QuotaPath API requirements
      const payload: any = {
        name: formData.name,
        user_email: formData.user_email,
        deal_values: formData.deal_values,
      };

      // Include optional fields if provided
      if (formData.admin_locked !== undefined)
        payload.admin_locked = formData.admin_locked;
      if (formData.date) payload.date = formData.date;
      if (formData.integration_id !== undefined)
        payload.integration_id = formData.integration_id;
      if (formData.state) payload.state = formData.state;
      if (formData.metadata !== undefined) payload.metadata = formData.metadata;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form.");
      }

      const result: ApiResponse<Deal> = await response.json();

      if (currentDeal) {
        setDeals((prev) =>
          prev.map((deal) => (deal.id === currentDeal.id ? result.data : deal))
        );
        setSnackbar({
          message: "Deal updated successfully.",
          severity: "success",
        });
      } else {
        setDeals((prev) => [...prev, result.data]);
        setSnackbar({
          message: "Deal created successfully.",
          severity: "success",
        });
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || "Failed to submit form.");
      setSnackbar({
        message: err.message || "Failed to submit form.",
        severity: "error",
      });
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/qp/deal/${id}/`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        setDeals((prev) => prev.filter((deal) => deal.id !== id));
        setSnackbar({
          message: "Deal deleted successfully.",
          severity: "success",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete deal.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete deal.");
      setSnackbar({
        message: err.message || "Failed to delete deal.",
        severity: "error",
      });
    }
  };

  // Open Modal for Edit
  const openEditModal = (deal: Deal) => {
    setCurrentDeal(deal);
    setFormData({
      name: deal.name,
      user_email: deal.user_email,
      deal_values: deal.deal_values || [{}],
      admin_locked: deal.admin_locked,
      date: deal.date,
      integration_id: deal.integration_id,
      state: deal.state,
      metadata: deal.metadata,
    });
    setIsModalOpen(true);
  };

  // Open Modal for Create
  const openCreateModal = () => {
    setCurrentDeal(null);
    setFormData({
      name: "",
      user_email: "",
      deal_values: [{}],
    });
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentDeal(null);
    setFormData({
      name: "",
      user_email: "",
      deal_values: [{}],
    });
    setError("");
  };

  // Handle Snackbar Close
  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
          Deals Management
        </h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={openCreateModal}
        >
          Add Deal
        </Button>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <CircularProgress />
        </div>
      ) : error ? (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>User Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Created At</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell>{deal.name}</TableCell>
                  <TableCell>{deal.user_email}</TableCell>
                  <TableCell>{deal.state}</TableCell>
                  <TableCell>
                    {new Date(deal.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => openEditModal(deal)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(deal.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for Create/Edit */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{currentDeal ? "Edit Deal" : "Add New Deal"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <TextField
              label="User Email"
              fullWidth
              margin="normal"
              type="email"
              value={formData.user_email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, user_email: e.target.value }))
              }
              required
            />
            {/* Add other fields as per API requirements */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.state || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    state: e.target.value as any,
                  }))
                }
                label="Status"
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
                <MenuItem value="lost">Lost</MenuItem>
              </Select>
            </FormControl>
            {/* Add fields for deal_values, admin_locked, date, integration_id, metadata as needed */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {currentDeal ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {snackbar && (
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
}
