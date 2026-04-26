import { Box } from '@/components/ui';
import type { ReactNode } from 'react';

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
}: {
  children: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <Box
      as="button"
      px="3"
      py="2"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      css={{ '&:not(:last-child)': { borderBottomWidth: '2px' } }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

export const CardStack = Object.assign(Root, { Root, Item });
