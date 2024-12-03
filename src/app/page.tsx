"use client";

import { Download, Send } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

// Types
interface Plan {
  name: string;
  paths: { id: string; name: string }[];
  assignments: { email: string }[];
}

interface GeneratedDeal {
  name: string;
  value: number;
  state: "open" | "closed" | "lost";
  user_email: string;
  date: string;
  path_id: string;
}

const BUSINESS_TYPES = [
  "Roasters",
  "Foods",
  "Bakery",
  "Seafood",
  "Farms",
  "Vineyards",
  "Produce",
  "Meats",
  "Grocers",
  "Distributors",
  "Markets",
  "Suppliers",
  "Traders",
  "Imports",
  "Provisions",
];

const DESCRIPTIVE_WORDS = [
  "Artisan",
  "Fresh",
  "Urban",
  "Coastal",
  "Mountain",
  "Sunset",
  "Valley",
  "Heritage",
  "Golden",
  "Premium",
  "Royal",
  "Classic",
  "Modern",
  "Elite",
  "Prime",
];

function generateCompanyName(): string {
  const descriptor =
    DESCRIPTIVE_WORDS[Math.floor(Math.random() * DESCRIPTIVE_WORDS.length)];
  const type =
    BUSINESS_TYPES[Math.floor(Math.random() * BUSINESS_TYPES.length)];
  return `${descriptor} ${type}`;
}

const DEAL_STATES = ["open", "closed", "lost"];

export default function BulkDealGenerator() {
  const [minValue, setMinValue] = useState<number>(5000);
  const [maxValue, setMaxValue] = useState<number>(100000);
  const [numDeals, setNumDeals] = useState<number>(5);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [generatedDeals, setGeneratedDeals] = useState<GeneratedDeal[]>([]);
  const [statusLog, setStatusLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/qp/plan");
      const data = await response.json();
      setPlans(data.results);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const generateDeals = () => {
    const plan = plans.find((p) => p.paths[0].id === selectedPlan);
    if (!plan) return;

    const deals: GeneratedDeal[] = [];
    for (let i = 0; i < numDeals; i++) {
      const value = Math.floor(
        Math.random() * (maxValue - minValue) + minValue
      );
      console.log("Generated value:", value);
      const deal: GeneratedDeal = {
        name: generateCompanyName(),
        value,
        state: DEAL_STATES[Math.floor(Math.random() * DEAL_STATES.length)] as
          | "open"
          | "closed"
          | "lost",
        user_email:
          plan.assignments[Math.floor(Math.random() * plan.assignments.length)]
            .email,
        date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        path_id: selectedPlan,
      };
      deals.push(deal);
    }
    console.log("Generated deals:", deals);
    setGeneratedDeals(deals);
  };

  const downloadCSV = () => {
    const headers = ["name", "value", "state", "user_email", "date", "path_id"];
    const csvContent = [
      headers.join(","),
      ...generatedDeals.map((deal) =>
        [
          deal.name,
          deal.value,
          deal.state,
          deal.user_email,
          deal.date,
          deal.path_id,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated_deals.csv";
    a.click();
  };

  const createDeals = async () => {
    setLoading(true);
    setStatusLog(["Starting bulk deal creation..."]);

    try {
      const response = await fetch("/api/qp/deal/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deals: generatedDeals.map((deal) => ({
            name: deal.name,
            deal_values: [{ value: deal.value, path_id: deal.path_id }],
            state: deal.state,
            user_email: deal.user_email,
            date: deal.date,
          })),
        }),
      });

      const result = await response.json();
      setStatusLog((prev) => [
        ...prev,
        `Successfully created ${result.created_count} deals`,
      ]);
    } catch (error) {
      setStatusLog((prev) => [
        ...prev,
        `Error creating deals: ${error instanceof Error ? error.message : "Unknown error"}`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Company", width: 200 },
    {
      field: "value",
      headerName: "Value",
      width: 130,
      type: "number",
    },
    { field: "state", headerName: "State", width: 130 },
    { field: "user_email", headerName: "User", width: 200 },
    { field: "date", headerName: "Date", width: 130 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom color="text.primary">
        Bulk Deal Generator
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.primary">
                Generator Settings
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Commission Plan</InputLabel>
                <Select
                  value={selectedPlan}
                  label="Commission Plan"
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  {plans.map((plan) => (
                    <MenuItem key={plan.paths[0].id} value={plan.paths[0].id}>
                      {plan.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Minimum Value"
                type="number"
                value={minValue}
                onChange={(e) =>
                  setMinValue(Math.max(0, Number(e.target.value) || 0))
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Maximum Value"
                type="number"
                value={maxValue}
                onChange={(e) =>
                  setMaxValue(Math.max(0, Number(e.target.value) || 0))
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Number of Deals"
                type="number"
                value={numDeals}
                onChange={(e) =>
                  setNumDeals(Math.max(1, Number(e.target.value) || 1))
                }
                sx={{ mb: 2 }}
              />
              {!selectedPlan && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Please select a plan first.
                </Alert>
              )}
              <Button
                fullWidth
                variant="contained"
                onClick={generateDeals}
                disabled={!selectedPlan}
                sx={{ mb: 2 }}
              >
                Generate Preview
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ height: 400, mb: 3 }}>
            <DataGrid
              rows={generatedDeals.map((deal, index) => ({
                ...deal,
                id: index,
              }))}
              columns={columns}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              onRowClick={(params) => console.log("Row data:", params)}
            />
          </Paper>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 3 }}
          >
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Download />}
              onClick={downloadCSV}
              disabled={generatedDeals.length === 0}
            >
              Download CSV
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Send />}
              onClick={createDeals}
              disabled={generatedDeals.length === 0 || loading}
            >
              Submit Deals
            </Button>
          </Box>

          {statusLog.length > 0 && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="text.primary">
                Status Log
              </Typography>
              {statusLog.map((log, index) => (
                <Alert key={index} severity="info" sx={{ mb: 1 }}>
                  {log}
                </Alert>
              ))}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
