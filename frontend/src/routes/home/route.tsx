import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Box } from '@/components/ui';
import { HomeBottomNav } from '@/components/home-bottom-nav';

export const Route = createFileRoute('/home')({
  component: HomeLayout,
});

function HomeLayout() {
  return (
    <Box display="flex" flexDirection="column" height="100dvh">
      <Box px="6" py="8" flex="1">
        <Outlet />
      </Box>

      <HomeBottomNav />
    </Box>
  );
}
