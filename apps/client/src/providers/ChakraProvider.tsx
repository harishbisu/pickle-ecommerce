'use client';

import { ChakraProvider as Provider, extendTheme } from '@chakra-ui/react';
import { ReactNode } from 'react';

// Google Material 3 inspired theme
const theme = extendTheme({
  fonts: {
    heading: `'Inter', 'Google Sans', sans-serif`,
    body: `'Inter', 'Google Sans', sans-serif`,
  },
  colors: {
    brand: {
      50: '#e8f0fe',
      100: '#d2e3fc',
      200: '#aecbfa',
      300: '#7baaf7',
      400: '#4285f4',
      500: '#1a73e8',
      600: '#1557b0',
      700: '#0d47a1',
      800: '#0a3880',
      900: '#062460',
    },
    google: {
      blue: '#1a73e8',
      red: '#ea4335',
      green: '#34a853',
      yellow: '#fbbc05',
      grey: '#5f6368',
      lightBlue: '#e8f0fe',
      lightGreen: '#e6f4ea',
      lightRed: '#fce8e6',
      lightYellow: '#fef7e0',
    },
    surface: {
      50: '#f8f9fa',
      100: '#f1f3f4',
      200: '#e8eaed',
      300: '#dadce0',
      400: '#bdc1c6',
      500: '#9aa0a6',
      600: '#80868b',
      700: '#5f6368',
      800: '#3c4043',
      900: '#202124',
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '500',
        borderRadius: '24px',
        fontSize: '14px',
        letterSpacing: '0.01em',
        transition: 'all 0.15s ease',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          boxShadow: '0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
          _hover: {
            bg: 'brand.600',
            boxShadow: '0 1px 2px rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)',
            transform: 'translateY(-1px)',
          },
          _active: { transform: 'translateY(0)', boxShadow: 'none' },
        },
        outline: {
          border: '1px solid',
          borderColor: 'surface.300',
          color: 'brand.500',
          bg: 'white',
          _hover: {
            bg: 'brand.50',
            borderColor: 'brand.500',
          },
        },
        ghost: {
          color: 'surface.700',
          borderRadius: '8px',
          _hover: { bg: 'surface.100', color: 'surface.900' },
        },
        'google-text': {
          color: 'brand.500',
          bg: 'transparent',
          borderRadius: '8px',
          fontWeight: '500',
          _hover: { bg: 'brand.50' },
        },
      },
      defaultProps: {
        colorScheme: 'brand',
        variant: 'solid',
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'white',
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'surface.300',
          boxShadow: '0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          _hover: {
            boxShadow: '0 1px 2px rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderRadius: '8px',
            borderColor: 'surface.300',
            bg: 'white',
            fontSize: '14px',
            _hover: { borderColor: 'brand.500' },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 2px rgba(26, 115, 232, 0.2)',
            },
          },
        },
      },
      defaultProps: { variant: 'outline' },
    },
    Badge: {
      baseStyle: {
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        px: 2,
        py: 0.5,
      },
    },
    Heading: {
      baseStyle: {
        letterSpacing: '-0.02em',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'surface.50',
        color: 'surface.900',
      },
    },
  },
  shadows: {
    sm: '0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
    md: '0 1px 2px rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)',
    lg: '0 1px 3px rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
    xl: '0 2px 3px rgba(60,64,67,0.3), 0 6px 10px 4px rgba(60,64,67,0.15)',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },
});

export function ChakraProvider({ children }: { children: ReactNode }) {
  return <Provider theme={theme}>{children}</Provider>;
}
