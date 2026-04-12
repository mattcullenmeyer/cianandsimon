import { createFileRoute } from '@tanstack/react-router';
import { Text } from '@/components/ui';

export const Route = createFileRoute('/_home/home')({
  component: () => <Text>Home</Text>,
});
