import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { VerifyEmailPage } from '@/pages/verify-email';

const searchSchema = z.object({
  email: z.email(),
});

export const Route = createFileRoute('/verify-email')({
  validateSearch: searchSchema,
  beforeLoad: ({ search }) => {
    if (!search.email) throw redirect({ to: '/signup' });
  },
  component: VerifyEmailRoute,
});

function VerifyEmailRoute() {
  const { email } = Route.useSearch();
  return <VerifyEmailPage email={email} />;
}
