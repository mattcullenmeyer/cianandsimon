import { defineTokens } from '@pandacss/dev';

// https://github.com/chakra-ui/panda/blob/main/packages/preset-panda/src/typography.ts

export const letterSpacings = defineTokens.letterSpacings({
  tighter: { value: '-0.05em' },
  tight: { value: '-0.025em' },
  normal: { value: '0em' },
  wide: { value: '0.025em' },
  wider: { value: '0.05em' },
  widest: { value: '0.1em' },
});
