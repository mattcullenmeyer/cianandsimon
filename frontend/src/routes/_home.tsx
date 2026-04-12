import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Box } from '@/components/ui';
import { TopNav } from '@/components/top-nav';

export const Route = createFileRoute('/_home')({
  component: HomeLayout,
});

function HomeLayout() {
  return (
    <Box>
      <TopNav />
      <Box px="6" py="8">
        <Outlet />
      </Box>
    </Box>
  );
}
