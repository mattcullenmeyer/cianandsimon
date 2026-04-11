// https://github.com/chakra-ui/park-ui/blob/main/packages/preset/src/recipes/checkbox.ts

import { checkboxAnatomy } from '@ark-ui/react/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const checkbox = defineSlotRecipe({
  slots: checkboxAnatomy.keys(),
  className: 'checkbox',
  base: {
    root: {
      display: 'inline-flex',
      gap: '2',
      alignItems: 'center',
      verticalAlign: 'top',
      position: 'relative',
      _disabled: {
        layerStyle: 'disabled',
      },
    },
    control: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      borderWidth: '1px', // 1px
      borderColor: 'transparent',
      borderRadius: 'xs',
      cursor: 'pointer',
      focusVisibleRing: 'outside',

      _icon: {
        boxSize: 'full',
      },
    },
    label: {
      fontWeight: 'medium',
      userSelect: 'none',
    },
  },

  variants: {
    size: {
      sm: {
        root: { gap: '2' },
        label: { textStyle: 'sm' },
        control: { boxSize: '4.5', _icon: { boxSize: '3' } },
      },
      md: {
        root: { gap: '3' },
        label: { textStyle: 'md' },
        control: { boxSize: '5', _icon: { boxSize: '3.5' } },
      },
      lg: {
        root: { gap: '3' },
        label: { textStyle: 'lg' },
        control: { boxSize: '5.5', _icon: { boxSize: '4' } },
      },
    },

    variant: {
      solid: {
        control: {
          control: {
            borderColor: 'border',
            _checked: {
              bg: 'accent',
              borderColor: 'accent',
              color: 'fg.inverted',
            },
            _invalid: {
              background: 'error',
            },
          },
        },
      },
      surface: {
        control: {
          bg: 'bg.surface',
          borderWidth: '1px',
          borderColor: 'border',
          color: 'fg',
        },
      },
      subtle: {
        control: {
          bg: 'bg.subtle',
          color: 'fg.subtle',
        },
      },
      outline: {
        control: {
          borderWidth: '1px',
          borderColor: 'border',
          color: 'fg',
          _checked: {
            borderColor: 'accent',
          },
        },
      },
      plain: {
        control: {
          color: 'fg',
        },
      },
    },
  },

  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});
