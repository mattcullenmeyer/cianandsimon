import { Button, Text } from './ui';

interface NavButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export const NavButton = ({ label, icon, onClick }: NavButtonProps) => (
  <Button
    variant="plain"
    justifyContent="center"
    color="gray.800"
    display="flex"
    flexDirection="column"
    gap={1}
    height="auto"
    onClick={onClick}
  >
    {icon}
    <Text fontWeight="normal">{label}</Text>
  </Button>
);
