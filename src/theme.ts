'use client';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const getTheme = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: {
            main: '#0E4430',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#9CF27D',
          },
          background: {
            default: '#F6F8FA',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#050A1A',
            secondary: '#666666',
          },
        }
      : {
          // Dark mode palette
          primary: {
            main: '#0E4430',
          },
          secondary: {
            main: '#9CF27D',
          },
          background: {
            default: '#091612',
            paper: '#0B2D21',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#7EB4BF',
          },
          divider: 'rgb(25, 68, 92)',
        }),
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: 'info' },
              style: {
                backgroundColor: '#60a5fa',
              },
            },
          ],
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default createTheme(getTheme('light'));