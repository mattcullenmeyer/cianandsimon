import { animationStyles } from '@/theme/animation-styles';
import { textStyles } from '@/theme/text-styles';
import { layerStyles } from '@/theme/layer-styles';
import { keyframes } from '@/theme/keyframes';
import { globalCss } from '@/theme/global-css';
import { conditions } from '@/theme/conditions';
import { slotRecipes, recipes } from '@/theme/recipes';
import { defineConfig } from '@pandacss/dev';
import { tokens } from '@/theme/tokens';
import { semanticTokens } from '@/theme/semantic-tokens';

export default defineConfig({
  preflight: true, // Whether to use css reset
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  theme: {
    extend: {
      animationStyles,
      recipes,
      slotRecipes,
      keyframes,
      layerStyles,
      textStyles,
      tokens,
      semanticTokens,
    },
  },
  outdir: 'styled-system', // The output directory for your css system
  globalCss: globalCss,
  conditions: conditions,
  jsxFramework: 'react',
  // strictTokens: true, // allows only token values and prevents the use of custom or raw CSS values
  // strictPropertyValues: true, // prevents the use of custom or raw CSS values
});
