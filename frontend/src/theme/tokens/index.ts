import { defineTokens } from '@pandacss/dev';
import { colors } from './colors';
import { durations } from './durations';
import { radii } from './radii';
import { shadows } from './shadows';
import { zIndex } from './z-index';

export const tokens = defineTokens({
  colors,
  durations,
  shadows,
  radii,
  zIndex,
});
