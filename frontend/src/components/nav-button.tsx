import { Box, Button } from './ui';

interface NavButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export const NavButton = ({
  label,
  icon,
  isActive,
  onClick,
}: NavButtonProps) => (
  <Button
    variant="plain"
    justifyContent="center"
    color={isActive ? 'white' : 'gray.primary'}
    display="flex"
    flexDirection="column"
    gap="1"
    height="auto"
    aria-label={label}
    onClick={onClick}
  >
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={isActive ? 'blue.secondary' : 'transparent'}
      borderWidth="2px"
      borderColor={isActive ? 'blue.primary' : 'transparent'}
      borderRadius="xl"
      p="2"
    >
      {icon}
    </Box>
  </Button>
);
