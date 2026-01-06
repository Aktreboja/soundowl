'use client';

import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';

// Create a custom system with lower specificity for global/reset styles
// This allows Tailwind utilities to override Chakra's base styles
const system = createSystem(defaultConfig, {
  globalCss: {
    // Use :where() selector to give reset styles 0 specificity
    ':where(html)': {
      colorScheme: 'light dark',
    },
  },
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
