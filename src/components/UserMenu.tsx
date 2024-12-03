import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { isAuthEnabled } from "@/lib/client-auth";
import { Avatar, Box, Button, Typography } from "@mui/material";

export function UserMenu() {
  const authEnabled = isAuthEnabled();

  if (!authEnabled) {
    console.log("Auth is not enabled");
    return null;
  }

  const { data: session, status } = useSession();

  if (status === "loading") {
    return null; // or a loading spinner
  }

  if (!session) {
    return (
      <Button
        component={Link}
        href="api/auth/signin"
        variant="outlined"
        color="secondary"
        sx={{
          color: "text.primary",
          "& .MuiTypography-root": {
            color: "white",
          },
        }}
      >
        <Typography variant="body2">Log in</Typography>
      </Button>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
        <Button
          onClick={() => signOut()}
          variant="outlined"
          color="secondary"
          startIcon={
            <Avatar
              src={session?.user?.image}
              alt={session?.user?.name ?? ""}
              sx={{
                width: 24,
                height: 24,
                mr: { xs: -1.25, md: 0 },
              }}
            />
          }
          sx={{
            color: "text.primary",
            "& .MuiTypography-root": {
              color: "white",
            },
            minWidth: { xs: 0, md: 24 },
            px: { xs: 1, md: 1.5 },
          }}
        >
          <Typography
            variant="body2"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            Log out
          </Typography>
        </Button>
      </Box>
    </>
  );
}
