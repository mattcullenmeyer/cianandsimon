import { useEffect, useState } from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { z } from 'zod';
import { AssignmentCard } from '@/components/assignment-card';
import { Box, Spinner, Tabs, Text } from '@/components/ui';
import { config } from '@/config';

const searchSchema = z.object({
  tab: z.enum(['active', 'pending', 'completed']).catch('active'),
});

export const Route = createFileRoute('/home/chores')({
  validateSearch: searchSchema,
  component: ChoresPage,
});

const TABS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
] as const;

interface Child {
  childId: string;
  name: string;
}

interface Assignment {
  assignmentId: string;
  childId: string;
  title: string;
  value: number;
  ttl?: number;
}

function ChoresPage() {
  const navigate = useNavigate({ from: '/home/chores' });
  const { tab } = useSearch({ from: '/home/chores' });
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [childrenById, setChildrenById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const statusMap = { active: 'active', pending: 'pending', completed: 'history' } as const;
    const endpoint = statusMap[tab];

    const fetchData = async () => {
      try {
        const [childrenRes, assignmentsRes] = await Promise.all([
          fetch(`${config.apiEndpoint}/family/children`, { credentials: 'include' }),
          fetch(`${config.apiEndpoint}/chore/assignments/${endpoint}`, { credentials: 'include' }),
        ]);

        if (!childrenRes.ok || !assignmentsRes.ok) {
          setError('Failed to load assignments.');
          return;
        }

        const [childrenData, assignmentsData] = await Promise.all([
          childrenRes.json() as Promise<{ children: Child[] }>,
          assignmentsRes.json() as Promise<{ assignments: Assignment[] }>,
        ]);

        setChildrenById(
          Object.fromEntries(childrenData.children.map((c) => [c.childId, c.name]))
        );
        setAssignments(assignmentsData.assignments);
      } catch {
        setError('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tab]);

  return (
    <Box display="flex" flexDirection="column" gap="6">
      <Tabs.Root
        variant="enclosed"
        value={tab}
        onValueChange={({ value }) =>
          navigate({ search: { tab: value as typeof tab } })
        }
      >
        <Tabs.List>
          {TABS.map((t) => (
            <Tabs.Trigger key={t.value} value={t.value}>
              {t.label}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
      </Tabs.Root>

      {loading && (
        <Box display="flex" justifyContent="center" mt="8">
          <Spinner />
        </Box>
      )}
      {!loading && error && <Text color="fg.error">{error}</Text>}
      {!loading && !error && assignments.length === 0 && (
        <Text color="fg.muted">No {tab} chores.</Text>
      )}
      {!loading && !error && assignments.length > 0 && (
        <Box display="flex" flexDirection="column" gap="2">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.assignmentId}
              title={assignment.title}
              value={assignment.value}
              childName={childrenById[assignment.childId] ?? assignment.childId}
              ttl={assignment.ttl}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
