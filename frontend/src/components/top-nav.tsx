import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Avatar, Box, Tabs, Text } from '@/components/ui';

const TABS = [
  { value: 'chores', label: 'Chores' },
  { value: 'kids', label: 'Kids' },
  { value: 'settings', label: 'Settings' },
] as const;

export const TopNav = () => {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const activeTab =
    TABS.find((t) => location.pathname.includes(t.value))?.value ?? 'chores';

  return (
    <Box display="flex" flexDirection="column" bg="bg.subtle">
      <Box
        as="nav"
        px="6"
        pt="2"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontWeight="medium">Top nav</Text>
        <Avatar.Root>
          <Avatar.Fallback />
        </Avatar.Root>
      </Box>
      <Tabs.Root
        value={activeTab}
        onValueChange={({ value }) => navigate({ to: `/home/${value}` })}
      >
        <Tabs.List px="2">
          {TABS.map((tab) => (
            <Tabs.Trigger key={tab.value} value={tab.value}>
              {tab.label}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
      </Tabs.Root>
    </Box>
  );
};
