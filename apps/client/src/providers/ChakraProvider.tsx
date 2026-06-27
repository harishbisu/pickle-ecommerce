'use client';

import { ChakraProvider as Provider, extendTheme } from '@chakra-ui/react';
import { ReactNode } from 'react';

// Flipkart inspired theme
const theme = extendTheme({
  fonts: {
    heading: `'Roboto', 'Inter', sans-serif`,
    body: `'Roboto', 'Inter', sans-serif`,
  },
  colors: {
    brand: {
      50: '#eef4ff',
      100: '#dce8ff',
      200: '#b9d1ff',
      300: '#96bbff',
      400: '#73a4ff',
      500: '#2874f0', // Flipkart Blue
      600: '#1d5ec9',
      700: '#14469e',
      800: '#0b2f73',
      900: '#041747',
    },
    accent: {
      500: '#fb641b', // Flipkart Orange
      600: '#e05a18',
    },
    surface: {
      50: '#f1f3f6', // Flipkart background gray
      100: '#e0e0e0',
      200: '#cccccc',
      300: '#b3b3b3',
      400: '#999999',
      500: '#808080',
      600: '#666666',
      700: '#4d4d4d',
      800: '#333333',
      900: '#212121', // Dark text
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: '2px', // Flipkart uses very slightly rounded or square buttons
        fontSize: '14px',
        textTransform: 'uppercase',
      },
      variants: {
        solid: {
          bg: 'accent.500',
          color: 'white',
          boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)',
          _hover: {
            bg: 'accent.600',
            boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)',
          },
          _active: { bg: 'accent.600' },
        },
        outline: {
          border: '1px solid',
          borderColor: 'surface.300',
          color: 'surface.800',
          bg: 'white',
          _hover: {
            bg: 'surface.50',
          },
        },
        ghost: {
          color: 'surface.700',
          _hover: { bg: 'surface.100', color: 'surface.900' },
        },
      },
      defaultProps: {
        colorScheme: 'accent',
        variant: 'solid',
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'white',
          borderRadius: '2px',
          border: 'none',
          boxShadow: '0 1px 2px 0 rgba(0,0,0,.15)',
          transition: 'box-shadow 0.2s ease',
          _hover: {
            boxShadow: '0 4px 8px 0 rgba(0,0,0,.15)',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderRadius: '2px',
            borderColor: 'surface.300',
            bg: 'white',
            fontSize: '14px',
            _hover: { borderColor: 'brand.500' },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: 'none',
            },
          },
        },
      },
      defaultProps: { variant: 'outline' },
    },
    Badge: {
      baseStyle: {
        borderRadius: '2px',
        fontSize: '11px',
        fontWeight: '600',
        px: 2,
        py: 0.5,
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
});

export function ChakraProvider({ children }: { children: ReactNode }) {
  return <Provider theme={theme}>{children}</Provider>;
}
