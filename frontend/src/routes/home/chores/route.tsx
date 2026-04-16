import {
  Outlet,
  createFileRoute,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { Box, Tabs } from '@/components/ui';

export const Route = createFileRoute('/home/chores')({
  component: ChoresLayout,
});

const TABS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'library', label: 'Library' },
] as const;

function ChoresLayout() {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const activeTab =
    TABS.find((t) => location.pathname.includes(t.value))?.value ?? 'active';

  return (
    <Box display="flex" flexDirection="column" gap="6">
      <Tabs.Root
        variant="enclosed"
        value={activeTab}
        onValueChange={({ value }) =>
          navigate({ to: `/home/chores/${value}` })
        }
      >
        <Tabs.List>
          {TABS.map((tab) => (
            <Tabs.Trigger key={tab.value} value={tab.value}>
              {tab.label}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
      </Tabs.Root>
      <Outlet />
    </Box>
  );
}
