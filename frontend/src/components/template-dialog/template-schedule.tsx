import { Box, Button, Dialog, Text } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

interface TemplateScheduleProps {
  onClickBack: () => void;
}

export const TemplateSchedule = ({ onClickBack }: TemplateScheduleProps) => {
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
          Schedule
        </Text>
        <Box width="24px" />
      </Dialog.Header>

      <Dialog.Body>
        <Box display="flex" flexDirection="column" gap="4" width="100%">
          something here
        </Box>
      </Dialog.Body>
    </>
  );
};
