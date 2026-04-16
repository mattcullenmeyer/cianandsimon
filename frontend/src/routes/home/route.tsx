import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Box } from '@/components/ui';
import { TopNav } from '@/components/top-nav';

export const Route = createFileRoute('/home')({
  component: HomeLayout,
});

function HomeLayout() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <TopNav />
      <Box px="6" py="8" flex="1">
        <Outlet />
      </Box>
    </Box>
  );
}
