import { defineRecipe } from '@pandacss/dev';

export const button = defineRecipe({
  className: 'button',
  jsx: ['Button', 'IconButton', 'CloseButton', 'ButtonGroup'],
  base: {
    alignItems: 'center',
    appearance: 'none',
    borderRadius: 'sm',
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: '0',
    fontWeight: 'semibold',
    gap: '2',
    isolation: 'isolate',
    justifyContent: 'space-between', // center
    outline: '0',
    position: 'relative',
    transition: 'colors',
    transitionProperty: 'background-color, border-color, color, box-shadow',
    userSelect: 'none',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    _icon: {
      flexShrink: '0',
    },
    _disabled: {
      layerStyle: 'disabled',
    },
    focusVisibleRing: 'outside',
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
  variants: {
    variant: {
      solid: {
        bg: 'accent',
        color: 'fg.inverted',
        _hover: {
          bg: 'accent.emphasis',
        },
      },
      surface: {
        bg: 'bg.surface',
        borderWidth: '1px',
        borderColor: 'border',
        color: 'fg',
        _hover: {
          borderColor: 'border',
        },
        _active: {
          bg: 'bg.muted',
        },
        _on: {
          bg: 'bg.muted',
        },
      },
      subtle: {
        bg: 'bg.subtle',
        color: 'fg.subtle',
        _hover: {
          bg: 'bg.muted',
        },
        _active: {
          bg: 'bg.muted',
        },
        _on: {
          bg: 'bg.muted',
        },
      },
      outline: {
        borderWidth: '1px',
        borderColor: 'border',
        color: 'fg',
        bg: 'white',
      },
      plain: {
        color: 'fg',
      },
    },
    size: {
      '2xs': {
        h: '6',
        minW: '6',
        textStyle: 'xs',
        px: '2',
        _icon: { boxSize: '3.5' },
      },
      xs: {
        h: '8',
        minW: '8',
        textStyle: 'sm',
        px: '2.5',
        _icon: { boxSize: '4' },
      },
      sm: {
        h: '9',
        minW: '9',
        textStyle: 'sm',
        px: '3',
        _icon: { boxSize: '4' },
      },
      md: {
        h: '10',
        minW: '10',
        textStyle: 'sm',
        px: '3.5',
        // _icon: { boxSize: '5' },
      },
      lg: {
        h: '11',
        minW: '11',
        textStyle: 'md',
        px: '4',
        _icon: { boxSize: '5' },
      },
      xl: {
        h: '12',
        minW: '12',
        textStyle: 'md',
        px: '4.5',
        _icon: { boxSize: '5.5' },
      },
      '2xl': {
        h: '16',
        minW: '16',
        textStyle: 'xl',
        px: '6',
        _icon: { boxSize: '6' },
      },
    },
  },
});
