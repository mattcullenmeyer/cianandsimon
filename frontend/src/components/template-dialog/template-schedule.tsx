import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Field,
  Input,
  InputGroup,
  SegmentGroup,
  Text,
} from '@/components/ui';
import { ArrowLeft, Clock } from 'lucide-react';

type ScheduleFrequency = 'never' | 'daily' | 'weekly';

const items: { label: string; value: ScheduleFrequency }[] = [
  { label: 'Never', value: 'never' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
];

interface TemplateScheduleProps {
  onClickBack: () => void;
}

export const TemplateSchedule = ({ onClickBack }: TemplateScheduleProps) => {
  const [frequency, setFrequency] = useState<ScheduleFrequency>('never');

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
          {/* <Box
            display="flex"
            flexDirection="column"
            borderWidth="2px"
            borderRadius="xl"
            px="3"
            py="2"
          > */}
          <Field.Root>
            <Field.Label>Repeat</Field.Label>
            <SegmentGroup.Root
              value={frequency}
              onValueChange={({ value }) =>
                setFrequency(value as ScheduleFrequency)
              }
              fitted
              size="xs"
            >
              <SegmentGroup.Indicator />
              {items.map((item) => (
                <SegmentGroup.Item key={item.value} value={item.value}>
                  <SegmentGroup.ItemText
                    color={
                      frequency === item.value ? 'blue.primary' : undefined
                    }
                    transition="color 0.2s"
                  >
                    {item.label}
                  </SegmentGroup.ItemText>
                  <SegmentGroup.ItemHiddenInput />
                </SegmentGroup.Item>
              ))}
            </SegmentGroup.Root>
          </Field.Root>

          {frequency !== 'never' && (
            <Field.Root>
              <Field.Label>Time</Field.Label>
              <InputGroup endElement={<Clock />}>
                <Input
                  type="time"
                  css={{
                    '&::-webkit-calendar-picker-indicator': { display: 'none' },
                  }}
                />
              </InputGroup>
            </Field.Root>
          )}

          {frequency === 'daily' && (
            <Field.Root>
              <Field.Label>Every</Field.Label>
            </Field.Root>
          )}
          {frequency === 'weekly' && <>weekly</>}
          {/* </Box> */}
        </Box>
      </Dialog.Body>
    </>
  );
};
