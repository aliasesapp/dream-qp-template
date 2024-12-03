"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CustomThemeProvider } from "@/contexts/ThemeContext";
import FullstoryProvider from "@/contexts/Fullstory";
import { AuthProvider } from "@/contexts/AuthProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <CustomThemeProvider>
        <FullstoryProvider>
          <AuthProvider>{children}</AuthProvider>
        </FullstoryProvider>
      </CustomThemeProvider>
    </AppRouterCacheProvider>
  );
}
