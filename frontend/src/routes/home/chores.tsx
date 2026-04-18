import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { z } from 'zod';
import {
  Box,
  Tabs,
  // Text
} from '@/components/ui';
import { ActiveChoresTab } from '@/pages/chores/active';
import { CompleteChoresTab } from '@/pages/chores/complete';
import { PendingChoresTab } from '@/pages/chores/pending';

const searchSchema = z.object({
  tab: z.enum(['active', 'pending', 'complete']).catch('active'),
});

export const Route = createFileRoute('/home/chores')({
  validateSearch: searchSchema,
  component: ChoresPage,
});

const TABS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'complete', label: 'Complete' },
] as const;

function ChoresPage() {
  const navigate = useNavigate({ from: '/home/chores' });
  const { tab } = useSearch({ from: '/home/chores' });

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
        {/* <Text textStyle="xl" fontWeight="semibold">
          {tab.charAt(0).toUpperCase() + tab.slice(1)} Chores
        </Text> */}

        {tab === 'active' && <ActiveChoresTab />}
        {tab === 'pending' && <PendingChoresTab />}
        {tab === 'complete' && <CompleteChoresTab />}
      </Box>
    </Box>
  );
}
