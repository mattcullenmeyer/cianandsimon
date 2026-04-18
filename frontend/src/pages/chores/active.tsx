import { useEffect, useState } from 'react';
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

export const ActiveChoresTab = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [childrenById, setChildrenById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    // const statusMap = {
    //   active: 'active',
    //   pending: 'pending',
    //   complete: 'history',
    // } as const;
    // const endpoint = statusMap[tab];

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

        setChildrenById(
          Object.fromEntries(
            childrenData.children.map((c) => [c.childId, c.name])
          )
        );
        setAssignments(assignmentsData.assignments);
      } catch {
        setError('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text textStyle="xl" fontWeight="semibold">
          Active Chores
        </Text>

        <Button size="xs" variant="outline">
          FILTER
        </Button>
      </Box>

      <Box display="flex" flexDirection="column" flex="1" overflow="hidden">
        <Box flex="1" overflowY="auto">
          {loading && (
            <Box display="flex" justifyContent="center" mt="8">
              <Spinner />
            </Box>
          )}
          {!loading && error && <Text color="fg.error">{error}</Text>}
          {!loading && !error && assignments.length === 0 && (
            <Text color="fg.muted">No active chores.</Text>
          )}
          {!loading && !error && assignments.length > 0 && (
            <Box
              display="flex"
              flexDirection="column"
              borderWidth="2px"
              borderRadius="xl"
            >
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.assignmentId}
                  title={assignment.title}
                  value={assignment.value}
                  childName={
                    childrenById[assignment.childId] ?? assignment.childId
                  }
                  ttl={assignment.ttl}
                />
              ))}
            </Box>
          )}
        </Box>

        <Box pt="4" p="1">
          <Button
            width="full"
            justifyContent="center"
            css={{ '--btn-bg': '{colors.green.primary}' }}
          >
            ASSIGN CHORE
          </Button>
        </Box>
      </Box>
    </>
  );
};
