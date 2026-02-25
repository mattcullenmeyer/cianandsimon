import { CircleMinus } from 'lucide-react';
import { Box, Button, Checkbox } from './ui';

interface ToDoButtonProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  isEditing?: boolean;
}

export const ToDoButton = ({
  label,
  checked,
  onToggle,
  isEditing,
}: ToDoButtonProps) => {
  return (
    <Button
      variant="outline"
      textDecoration={!isEditing && checked ? 'line-through' : 'none'}
      color={!isEditing && checked ? 'fg.subtle' : 'fg.default'}
      fontWeight="medium"
      width="full"
      onClick={onToggle}
    >
      <Box display="flex" gap="2" alignItems="center">
        {!isEditing && (
          <Checkbox.Root variant="solid" checked={checked}>
            <Checkbox.HiddenInput />
            <Checkbox.Control
              backgroundColor={checked ? 'green.700' : 'transparent'}
              borderColor={checked ? 'green.700' : 'fg.subtle'}
            >
              <Checkbox.Indicator height="20px" width="20px" />
            </Checkbox.Control>
          </Checkbox.Root>
        )}

        {isEditing && <CircleMinus size={20} />}

        {label}
      </Box>
    </Button>
  );
};
