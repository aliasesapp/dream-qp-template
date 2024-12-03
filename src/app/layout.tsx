import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Metadata } from "next";
import { Viewport } from "next/types";
import { siteConfig } from "@/config/site";
import SiteHeader from "@/components/SiteHeader";
import Box from "@mui/material/Box";
import { Providers } from "@/contexts/Providers";
import { isAuthEnabled } from "@/lib/auth";

const iconUrl = "/favicon.ico";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [{ url: iconUrl, sizes: "32x32" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authEnabled = isAuthEnabled();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="auth-enabled" content={authEnabled ? "true" : "false"} />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <CssBaseline />
          <SiteHeader />
          <Box
            sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4, lg: 8, xl: 12 } }}
          >
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
}
