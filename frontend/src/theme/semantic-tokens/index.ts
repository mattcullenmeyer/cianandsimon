import { defineSemanticTokens } from '@pandacss/dev';

// https://github.com/chakra-ui/panda/blob/main/website/theme/semantic-tokens.ts

export const semanticTokens = defineSemanticTokens({
  colors: {
    green: {
      primary: {
        value: { base: '{colors.green.500}' },
      },
      secondary: {
        value: { base: '{colors.green.400}' },
      },
    },
    blue: {
      primary: {
        value: { base: '{colors.sky.500}' }, // changed from cyan
      },
      secondary: {
        value: { base: '{colors.sky.400}' },
      },
    },
    orange: {
      primary: {
        value: { base: '{colors.orange.400}' },
      },
      secondary: {
        value: { base: '{colors.amber.500}' },
      },
    },
    purple: {
      primary: {
        value: { base: '{colors.purple.600}' },
      },
      secondary: {
        value: { base: '{colors.purple.500}' },
      },
    },
    gray: {
      primary: {
        value: { base: '{colors.neutral.400}' },
      },
      secondary: {
        value: { base: '{colors.neutral.200}' },
      },
    },
    // Background tokens
    bg: {
      DEFAULT: {
        value: { base: '{colors.white}', _dark: '{colors.black}' },
      },
      subtle: {
        value: { base: '{colors.neutral.50}', _dark: '{colors.neutral.900}' },
      },
      muted: {
        value: { base: '{colors.neutral.100}', _dark: '{colors.neutral.800}' },
      },
      surface: {
        value: { base: '{colors.white}', _dark: '{colors.neutral.900}' },
      },
      inverted: {
        value: { base: '{colors.black}', _dark: '{colors.neutral.700}' },
      },
      main: {
        value: { base: '{colors.yellow.300}', _dark: '{colors.neutral.700}' },
      },
      emphasized: {
        value: { base: '{colors.white}', _dark: '{colors.yellow.300}' },
      },
      'emphasized.hover': {
        value: { base: '{colors.neutral.100}', _dark: '{colors.neutral.800}' },
      },
    },

    // Foreground tokens
    fg: {
      DEFAULT: {
        value: { base: '{colors.neutral.900}', _dark: '{colors.neutral.50}' },
      },
      muted: {
        value: { base: '{colors.neutral.600}', _dark: '{colors.neutral.300}' },
      },
      subtle: {
        value: { base: '{colors.neutral.500}', _dark: '{colors.neutral.500}' },
      },
      inverted: {
        value: { base: '{colors.white}', _dark: '{colors.black}' },
      },
      headline: {
        value: { base: '{colors.black}', _dark: '{colors.yellow.300}' },
      },
    },

    // Accent tokens
    accent: {
      DEFAULT: {
        value: { base: '{colors.neutral.900}', _dark: '{colors.neutral.100}' },
      },
      emphasis: {
        value: { base: '{colors.black}', _dark: '{colors.white}' },
      },
      subtle: {
        value: { base: '{colors.neutral.200}', _dark: '{colors.neutral.700}' },
      },
    },

    // Link tokens
    link: {
      DEFAULT: {
        value: { base: '{colors.blue.600}', _dark: '{colors.blue.400}' },
      },
      emphasized: {
        value: { base: '{colors.blue.700}', _dark: '{colors.blue.300}' },
      },
    },

    // Border tokens
    border: {
      DEFAULT: {
        value: { base: '{colors.neutral.200}', _dark: '{colors.neutral.700}' },
      },
      muted: {
        value: { base: '{colors.neutral.100}', _dark: '{colors.neutral.900}' },
      },
    },
  },
});
