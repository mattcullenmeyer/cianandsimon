import { useNavigate, useSearch } from '@tanstack/react-router';
import { ScheduledTemplates } from '@/pages/library/scheduled';
import { UnscheduledTemplates } from '@/pages/library/unscheduled';
import { Box, Button, Tabs, Text } from '@/components/ui';

const TABS = [
  { value: 'unscheduled', label: 'Unscheduled' },
  { value: 'scheduled', label: 'Scheduled' },
] as const;

export function LibraryPage() {
  const navigate = useNavigate({ from: '/home/library' });
  const { tab } = useSearch({ from: '/home/library' });

  return (
    <Box display="flex" flexDirection="column" flex="1" overflow="hidden">
      <Tabs.Root
        variant="line"
        size="md"
        fitted
        value={tab}
        onValueChange={({ value }) =>
          navigate({ search: { tab: value as typeof tab } })
        }
      >
        <Tabs.List py="1">
          {TABS.map((t) => (
            <Tabs.Trigger key={t.value} value={t.value}>
              {t.label.toUpperCase()}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
      </Tabs.Root>
      <Box
        display="flex"
        flexDirection="column"
        gap="6"
        p="4"
        flex="1"
        overflow="hidden"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Text textStyle="xl" fontWeight="semibold">
            Chore Library
          </Text>

          <Button size="xs" variant="outline">
            FILTER
          </Button>
        </Box>

        <Box display="flex" flexDirection="column" flex="1" overflow="hidden">
          <Box flex="1" overflowY="auto">
            {tab === 'unscheduled' && <UnscheduledTemplates />}
            {tab === 'scheduled' && <ScheduledTemplates />}
          </Box>

          <Box pt="4" p="1">
            <Button
              width="full"
              justifyContent="center"
              css={{ '--btn-bg': '{colors.green.primary}' }}
            >
              CREATE CHORE
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
