import { useState } from 'react';
import { Box, Button, Checkbox } from './ui';

interface ToDoButtonProps {
  label: string;
  icon: React.ReactNode;
  storageKey: string;
}

export const ToDoButton = ({ label, icon, storageKey }: ToDoButtonProps) => {
  const [isChecked, setIsChecked] = useState(
    () => localStorage.getItem(storageKey) === 'true'
  );

  return (
    <Button
      variant="outline"
      textDecoration={isChecked ? 'line-through' : 'none'}
      color={isChecked ? 'fg.subtle' : 'fg.default'}
      width="full"
      onClick={() =>
        setIsChecked((prev) => {
          localStorage.setItem(storageKey, String(!prev));
          return !prev;
        })
      }
    >
      <Box display="flex" gap="2" alignItems="center">
        <Box borderRadius="full" bg="teal.100" p="1">
          {icon}
        </Box>
        {label}
      </Box>
      <Checkbox.Root variant="solid" checked={isChecked}>
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator height="20px" width="20px" />
        </Checkbox.Control>
      </Checkbox.Root>
    </Button>
  );
};
