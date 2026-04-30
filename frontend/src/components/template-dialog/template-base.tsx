import { CardStack } from '@/components/card-stack';
import { Box, Button, Dialog, Field, Input, Text } from '@/components/ui';
import { X } from 'lucide-react';
import type { View } from '../create-template-dialog';
import { AdditionalOptionCard } from './additional-option-card';

interface TemplateBaseProps {
  title: string;
  value: number;
  assignedChildCount: number;
  subtaskCount: number;
  onClose: () => void;
  onSubmit: React.MouseEventHandler<HTMLButtonElement>;
  onChangeView: (view: View) => void;
  onChangeTitle: (title: string) => void;
  onChangeValue: (value: number) => void;
}

export const TemplateBase = ({
  title,
  value,
  assignedChildCount,
  subtaskCount,
  onClose,
  onSubmit,
  onChangeView,
  onChangeTitle,
  onChangeValue,
}: TemplateBaseProps) => {
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
          onClick={onClose}
        >
          <X />
        </Button>
        <Text
          color="gray.primary"
          textStyle="md"
          fontWeight="medium"
          // letterSpacing="{letterSpacings.wider}"
        >
          New Chore
        </Text>
        <Box width="24px" />
      </Dialog.Header>
      {/* <form
        onSubmit={onSubmit}
        style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
      > */}
      <Dialog.Body>
        <Box display="flex" flexDirection="column" gap="4" width="100%">
          <Field.Root>
            <Field.Label>Title</Field.Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => onChangeTitle(e.target.value)}
              required
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Value</Field.Label>
            <Input
              type="number"
              value={value === 0 ? '' : String(value)}
              onChange={(e) => onChangeValue(Number(e.target.value))}
              required
            />
          </Field.Root>

          <Field.Root>
            <Field.Label color="fg.muted">Additional Options</Field.Label>
            <CardStack.Root>
              <AdditionalOptionCard
                heading="Assignments"
                description="Assign this chore to one or more children"
                highlight={
                  assignedChildCount > 0
                    ? `Assigned to ${assignedChildCount} ${assignedChildCount === 1 ? 'child' : 'children'}`
                    : undefined
                }
                onClick={() => onChangeView('assignments')}
              />

              <AdditionalOptionCard
                heading="Checklist"
                description="Break this chore up into smaller steps"
                highlight={
                  subtaskCount > 0
                    ? `Includes ${subtaskCount} ${subtaskCount === 1 ? 'step' : 'steps'}`
                    : undefined
                }
                onClick={() => onChangeView('checklist')}
              />

              <AdditionalOptionCard
                heading="Schedule"
                description="Set this chore to repeat on a regular basis"
                onClick={() => onChangeView('schedule')}
              />
            </CardStack.Root>
          </Field.Root>
        </Box>
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          // type="submit"
          onClick={onSubmit}
          width="full"
          justifyContent="center"
          css={{ '--btn-bg': '{colors.blue.primary}' }}
        >
          SAVE CHORE
        </Button>
      </Dialog.Footer>
      {/* </form> */}
    </>
  );
};
