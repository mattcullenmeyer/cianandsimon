import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AssignmentCard } from '@/components/assignment-card';
import { Box, Button, Spinner, Text } from '@/components/ui';
import { config } from '@/config';

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

export const Route = createFileRoute('/home/chores/active')({
  component: ActiveChoresPage,
});

function ActiveChoresPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [childrenById, setChildrenById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childrenRes, assignmentsRes] = await Promise.all([
          fetch(`${config.apiEndpoint}/family/children`, {
            credentials: 'include',
          }),
          fetch(`${config.apiEndpoint}/chore/assignments/active`, {
            credentials: 'include',
          }),
        ]);

        if (!childrenRes.ok || !assignmentsRes.ok) {
          setError('Failed to load assignments.');
          return;
        }

        const [childrenData, assignmentsData] = await Promise.all([
          childrenRes.json() as Promise<{ children: Child[] }>,
          assignmentsRes.json() as Promise<{ assignments: Assignment[] }>,
        ]);

        const byId = Object.fromEntries(
          childrenData.children.map((c) => [c.childId, c.name])
        );
        setChildrenById(byId);
        setAssignments(assignmentsData.assignments);
      } catch {
        setError('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt="8">
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return <Text color="fg.error">{error}</Text>;
  }

  if (assignments.length === 0) {
    return <Text color="fg.muted">No active chores.</Text>;
  }

  return (
    <>
      <Box display="flex" flexDirection="column" gap="2" pb="20">
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
      <Box position="fixed" bottom="0" left="0" right="0" p="4" bg="bg.canvas">
        <Button width="full" justifyContent="center">Add chore</Button>
      </Box>
    </>
  );
}
