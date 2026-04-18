import { defineGlobalStyles } from '@pandacss/dev';

export const globalCss = defineGlobalStyles({
  extend: {
    '*': {
      '--global-color-border': 'colors.gray.secondary',
      '--global-color-placeholder': 'colors.fg.subtle',
      '--global-color-selection': 'colors.accent.subtle',
      '--global-color-focus-ring': 'colors.accent',
    },
    body: {
      background: 'bg',
      color: 'fg',
    },
  },
});
