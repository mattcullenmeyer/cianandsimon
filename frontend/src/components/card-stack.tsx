import { Box } from '@/components/ui';
import type { ReactNode } from 'react';
import type { BoxProps } from 'styled-system/jsx';

const Root = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      borderWidth="2px"
      borderRadius="xl"
    >
      {children}
    </Box>
  );
};

const Item = ({
  children,
  onClick,
  ...props
}: BoxProps & { children: ReactNode; onClick?: () => void }) => {
  return (
    <Box
      as={onClick ? 'button' : 'div'}
      px="3"
      py="2"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      css={{ '&:not(:last-child)': { borderBottomWidth: '2px' } }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Box>
  );
};

export const CardStack = Object.assign(Root, { Root, Item });
