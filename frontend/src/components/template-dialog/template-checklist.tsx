import { useState } from 'react';
import { CardStack } from '@/components/card-stack';
import { Box, Button, Dialog, Input, Text } from '@/components/ui';
import { ArrowLeft, Minus, Plus } from 'lucide-react';

interface ChecklistItemProps {
  label: string;
  index: number;
  autoFocus?: boolean;
  onUpdate: ({ index, label }: { index: number; label: string }) => void;
  onRemove: (index: number) => void;
}

const ChecklistItem = ({
  label,
  index,
  autoFocus,
  onUpdate,
  onRemove,
}: ChecklistItemProps) => {
  const [value, setValue] = useState(label);
  return (
    <CardStack.Item>
      <Input
        autoFocus={autoFocus}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => onUpdate({ index, label: value })}
        border="none"
        outline="none"
        p={0}
        css={{ '--input-height': 'unset' }}
        textStyle="sm"
        fontWeight="medium"
        borderRadius={0}
      />
      <Button
        type="button"
        size="2xs"
        variant="outline"
        color="red.500"
        px={1}
        borderRadius="lg"
        onClick={() => onRemove(index)}
      >
        <Minus />
      </Button>
    </CardStack.Item>
  );
};

interface TemplateChecklistProps {
  subtasks: string[];
  onAddSubtask: (label: string) => void;
  onRemoveSubtask: (index: number) => void;
  onUpdateSubtask: ({ index, label }: { index: number; label: string }) => void;
  onClickBack: () => void;
}

export const TemplateChecklist = ({
  subtasks,
  onAddSubtask,
  onRemoveSubtask,
  onUpdateSubtask,
  onClickBack,
}: TemplateChecklistProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  return (
    <>
      <Dialog.Header>
        <Button
          variant="plain"
          height="auto"
          color="gray.primary"
          aria-label="Close"
          p={0}
          width="24px"
          minWidth="unset"
          onClick={onClickBack}
        >
          <ArrowLeft />
        </Button>
        <Text
          color="gray.primary"
          textStyle="md"
          fontWeight="medium"
          // letterSpacing="{letterSpacings.wider}"
        >
          Checklist
        </Text>
        <Box width="24px" />
      </Dialog.Header>

      <Dialog.Body>
        <Box display="flex" flexDirection="column" gap="4" width="100%">
          {subtasks.length > 0 && (
            <CardStack.Root>
              {subtasks.map((label, index) => (
                <ChecklistItem
                  key={index}
                  label={label}
                  index={index}
                  autoFocus={focusedIndex === index}
                  onUpdate={onUpdateSubtask}
                  onRemove={onRemoveSubtask}
                />
              ))}
            </CardStack.Root>
          )}

          <Button
            type="button"
            width="full"
            justifyContent="center"
            variant="outline"
            color="unset"
            onClick={() => {
              onAddSubtask('');
              setFocusedIndex(subtasks.length);
            }}
          >
            <Plus size={18} />
            <Text textStyle="sm" fontWeight="medium">
              ADD ITEM
            </Text>
          </Button>
        </Box>
      </Dialog.Body>
    </>
  );
};
