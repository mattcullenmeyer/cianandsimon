import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Box } from '@/components/ui';
import { HomeBottomNav } from '@/components/home-bottom-nav';
import { config } from '@/config';

export interface Child {
  childId: string;
  name: string;
}

export const Route = createFileRoute('/home')({
  loader: async () => {
    const res = await fetch(`${config.apiEndpoint}/family/children`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to load children');
    const data: { children: Child[] } = await res.json();
    return { children: data.children };
  },
  staleTime: 60_000,
  component: HomeLayout,
});

function HomeLayout() {
  return (
    <Box display="flex" flexDirection="column" height="100dvh">
      {/* <Box px="6" py="8" flex="1"> */}
      <Box flex="1" display="flex" flexDirection="column" overflow="hidden">
        <Outlet />
      </Box>
      {/* </Box> */}

      <HomeBottomNav />
    </Box>
  );
}
