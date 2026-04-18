import { defineTokens } from '@pandacss/dev';
import { colors } from './colors';
import { durations } from './durations';
import { fontSizes } from './font-sizes';
import { letterSpacings } from './letter-spacings';
import { radii } from './radii';
import { shadows } from './shadows';
import { zIndex } from './z-index';

export const tokens = defineTokens({
  colors,
  durations,
  fontSizes,
  letterSpacings,
  radii,
  shadows,
  zIndex,
});
