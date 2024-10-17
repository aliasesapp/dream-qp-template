"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { siteConfig } from "@/config/site";
import { LinkedIn, X } from "@mui/icons-material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import * as React from "react";
import { LogoIcon } from "./Icons";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  backdropFilter: "blur(24px)",
  borderRadius: "0px",
  borderColor: theme.palette.divider,
  boxShadow: "none",
  px: 2,
}));

export default function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        boxShadow: 0,
        backgroundImage: "none",
      }}
    >
      <StyledToolbar variant="dense" disableGutters>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            py: 1.75,
            px: 3,
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexGrow: 1,
            }}
          >
            <Box sx={{ width: 154 }}>
              <LogoIcon />
            </Box>
            <Typography
              variant="body2"
              sx={{ marginBottom: 0.75 }}
              // hide on mobile
              display={{ xs: "none", md: "block" }}
            >
              solution by Dream
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <IconButton
              color="secondary"
              size="small"
              component={NextLink}
              href={siteConfig.links.linkedin}
            >
              <LinkedIn />
            </IconButton>
            <IconButton
              color="secondary"
              size="small"
              component={NextLink}
              href={siteConfig.links.twitter}
            >
              <X />
            </IconButton>
            <ThemeToggle />
          </Box>
          <Box sx={{ display: "none" }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ my: 3 }} />
                <MenuItem>Features</MenuItem>
                <MenuItem>Testimonials</MenuItem>
                <MenuItem>Highlights</MenuItem>
                <MenuItem>Pricing</MenuItem>
                <MenuItem>FAQ</MenuItem>
                <MenuItem>Blog</MenuItem>
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </Box>
      </StyledToolbar>
    </AppBar>
  );
}
