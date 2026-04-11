import { Box, Checkbox } from './ui';
import { useState } from 'react';

interface ToDoButtonProps {
  label: string;
  amount: string;
  subtasks?: string[];
  checked: boolean;
  onToggle: () => void;
}

interface ChecklistItem {
  label: string;
  checked: boolean;
}

export const ToDoButton = ({
  label,
  amount,
  subtasks,
  checked,
  onToggle,
}: ToDoButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [checklist, setCheckList] = useState<ChecklistItem[]>(() =>
    subtasks ? subtasks.map((sub) => ({ label: sub, checked: false })) : []
  );
  const hasChecklist = checklist.length > 0;
  const isChecked = hasChecklist
    ? checklist.every((item) => item.checked)
    : checked;

  return (
    <Box
      as="li"
      listStyle="none"
      borderRadius="sm"
      borderWidth="1px"
      borderColor="border"
      paddingX="4"
      paddingY="2"
      fontWeight="medium"
      width="full"
      height="auto"
    >
      <Box display="flex" flexDirection="column" alignItems="start">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="full"
          cursor={hasChecklist ? 'pointer' : 'default'}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Checkbox.Root variant="solid" checked={isChecked}>
            <Checkbox.HiddenInput />
            <Checkbox.Control
              borderRadius="full"
              backgroundColor={isChecked ? 'green.700' : 'transparent'}
              borderColor={isChecked ? 'green.700' : 'fg.subtle'}
              onClick={(e) => {
                e.stopPropagation();
                if (!hasChecklist) onToggle();
              }}
            >
              <Checkbox.Indicator height="20px" width="20px" />
            </Checkbox.Control>
            <Checkbox.Label
              textDecoration={isChecked ? 'line-through' : 'none'}
              color={isChecked ? 'fg.subtle' : 'fg'}
              fontSize="sm"
              cursor={hasChecklist ? 'pointer' : 'default'}
            >
              {label}
            </Checkbox.Label>
          </Checkbox.Root>

          <Box fontWeight="normal" color="fg.muted" fontSize="sm">
            {amount}
          </Box>
        </Box>

        {!isExpanded && hasChecklist && (
          <Box fontSize="xs" color="fg.subtle" marginLeft="8">
            {checklist.filter((item) => item.checked).length} /{' '}
            {checklist.length} complete
          </Box>
        )}

        {isExpanded && hasChecklist && (
          <Box display="flex" flexDirection="column" gap="1" marginTop="2">
            {checklist.map((item) => (
              <Checkbox.Root
                key={item.label}
                variant="surface"
                size="sm"
                checked={item.checked}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control
                  marginLeft="8"
                  onClick={(e) => {
                    e.stopPropagation();
                    const updatedChecklist = checklist.map((checkItem) =>
                      checkItem.label === item.label
                        ? { ...checkItem, checked: !checkItem.checked }
                        : checkItem
                    );
                    setCheckList(updatedChecklist);
                    if (updatedChecklist.every((item) => item.checked)) {
                      onToggle();
                    }
                  }}
                >
                  <Checkbox.Indicator height="20px" width="20px" />
                </Checkbox.Control>
                <Checkbox.Label
                  textDecoration={item.checked ? 'line-through' : 'none'}
                  color={item.checked ? 'fg.subtle' : 'fg'}
                  fontWeight="normal"
                >
                  {item.label}
                </Checkbox.Label>
              </Checkbox.Root>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
