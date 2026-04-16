import { createFileRoute } from '@tanstack/react-router';
import { Text } from '@/components/ui';

export const Route = createFileRoute('/home/kids')({
  component: () => <Text>Kids</Text>,
});
