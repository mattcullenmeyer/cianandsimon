import { createFileRoute } from '@tanstack/react-router';
import { Text } from '@/components/ui';

export const Route = createFileRoute('/home/users')({
  component: () => <Text>Users</Text>,
});
