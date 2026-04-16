import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/home/chores/')({
  beforeLoad: () => {
    throw redirect({ to: '/home/chores/active' });
  },
  component: () => null,
});
