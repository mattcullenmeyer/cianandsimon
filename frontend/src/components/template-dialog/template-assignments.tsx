import { CardStack } from '@/components/card-stack';
import { Box, Button, Dialog, Switch, Text } from '@/components/ui';
import type { Child } from '@/routes/home/route';
import { ArrowLeft } from 'lucide-react';

interface TemplateAssignmentsProps {
  children: Child[];
  childIds: string[];
  onChangeChildIds: (childIds: string[]) => void;
  onClickBack: () => void;
}

export const TemplateAssignments = ({
  children,
  childIds,
  onChangeChildIds,
  onClickBack,
}: TemplateAssignmentsProps) => {
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
          Assignments
        </Text>
        <Box width="24px" />
      </Dialog.Header>

      <Dialog.Body>
        <Box display="flex" flexDirection="column" gap="4" width="100%">
          <CardStack.Root>
            {children.map((child) => (
              <CardStack.Item key={child.childId}>
                <Text textStyle="sm" fontWeight="medium">
                  {child.name}
                </Text>

                <Switch.Root
                  // Zag.js useId() generates colliding IDs inside a Dialog portal — explicit ids required
                  ids={{
                    root: `switch-${child.childId}`,
                    hiddenInput: `switch-${child.childId}-input`,
                    control: `switch-${child.childId}-control`,
                    label: `switch-${child.childId}-label`,
                    thumb: `switch-${child.childId}-thumb`,
                  }}
                  size="lg"
                  checked={childIds.includes(child.childId)}
                  onCheckedChange={({ checked }) => {
                    if (checked) {
                      onChangeChildIds([...childIds, child.childId]);
                    } else {
                      onChangeChildIds(
                        childIds.filter((id) => id !== child.childId)
                      );
                    }
                  }}
                >
                  <Switch.HiddenInput />
                  <Switch.Control />
                  <Switch.Label />
                </Switch.Root>
              </CardStack.Item>
            ))}
          </CardStack.Root>
        </Box>
      </Dialog.Body>
    </>
  );
};
