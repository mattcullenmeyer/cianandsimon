import { timerAnatomy } from '@ark-ui/react/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const timer = defineSlotRecipe({
  className: 'timer',
  slots: timerAnatomy.keys(),
  base: {
    root: {
      color: 'fg.default',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '2',
    },
    area: {
      display: 'flex',
      alignItems: 'center',
      gap: '1',
    },
    control: {},
    item: {
      fontWeight: 'normal',
      minWidth: '2ch',
    },
    actionTrigger: {},
    separator: {
      // color: 'colorPalette.subtle.fg',
      // fontWeight: 'medium',
    },
  },
  variants: {
    size: {
      sm: {
        item: { textStyle: 'md' },
        separator: { textStyle: 'md' },
      },
      md: {
        item: { textStyle: 'xl' },
        separator: { textStyle: 'xl' },
      },
      lg: {
        item: { textStyle: '4xl' },
        separator: { textStyle: '4xl' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
