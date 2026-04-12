import { createFileRoute, redirect } from '@tanstack/react-router';
import { SelectFamilyPage } from '@/pages/select-family';

export const Route = createFileRoute('/select-family')({
  beforeLoad: () => {
    const raw = sessionStorage.getItem('selectFamilyOptions');
    if (!raw) throw redirect({ to: '/login' });
  },
  component: SelectFamilyRoute,
});

function SelectFamilyRoute() {
  const families = JSON.parse(sessionStorage.getItem('selectFamilyOptions') ?? '[]');
  return <SelectFamilyPage families={families} />;
}
