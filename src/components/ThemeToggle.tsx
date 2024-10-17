"use client";

import * as React from "react";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { useThemeContext } from "@/contexts/ThemeContext";

import { IconButton } from "@mui/material";

export function ThemeToggle() {
  const { mode, toggleTheme } = useThemeContext();
  return (
    <IconButton size="small" onClick={toggleTheme} color="secondary">
      {mode === "light" ? <DarkModeOutlined /> : <LightModeOutlined />}
    </IconButton>
  );
}
