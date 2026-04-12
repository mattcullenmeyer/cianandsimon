import { createFileRoute } from '@tanstack/react-router';
import { Text } from '@/components/ui';

export const Route = createFileRoute('/_home/chores')({
  component: () => <Text>Chores</Text>,
});
