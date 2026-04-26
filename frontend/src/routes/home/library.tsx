import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { LibraryPage } from '@/pages/library';

const searchSchema = z.object({
  tab: z.enum(['scheduled', 'unscheduled']).catch('unscheduled'),
});

export const Route = createFileRoute('/home/library')({
  validateSearch: searchSchema,
  component: () => <LibraryPage />,
});
