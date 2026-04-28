import { useState } from 'react';
import { Portal } from '@ark-ui/react/portal';
import { Box, Button, Dialog, Field, Input, Text } from '@/components/ui';
import { X } from 'lucide-react';

export const CreateTemplateDialog = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size="full"
      motionPreset="slide-in-right"
    >
      <Dialog.Trigger asChild>
        <Button
          width="full"
          justifyContent="center"
          css={{ '--btn-bg': '{colors.green.primary}' }}
        >
          CREATE CHORE
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Button
                variant="plain"
                height="auto"
                color="gray.primary"
                aria-label="Close"
                p={0}
                width="24px"
                minWidth="unset"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
              <Text
                color="gray.primary"
                textStyle="md"
                fontWeight="medium"
                letterSpacing="{letterSpacings.wider}"
              >
                New Chore
              </Text>
              <Box width="24px" />
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Box display="flex" flexDirection="column" gap="4">
                  <Field.Root>
                    <Field.Label>Title</Field.Label>
                    <Input
                      type="text"
                      // value={title}
                      // onChange={(e) => setTitle(e.target.value)}
                      // required
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Value</Field.Label>
                    <Input
                      type="text"
                      // value={title}
                      // onChange={(e) => setTitle(e.target.value)}
                      // required
                    />
                  </Field.Root>

                  <Button
                    type="submit"
                    width="full"
                    justifyContent="center"
                    css={{ '--btn-bg': '{colors.blue.primary}' }}
                  >
                    SAVE CHORE
                  </Button>
                </Box>
              </form>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
