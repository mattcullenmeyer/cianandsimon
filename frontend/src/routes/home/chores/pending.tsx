import { createFileRoute } from '@tanstack/react-router';
import { Text } from '@/components/ui';

export const Route = createFileRoute('/home/chores/pending')({
  component: () => <Text>Pending</Text>,
});
