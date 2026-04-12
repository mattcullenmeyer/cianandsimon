import { useEffect, useState } from 'react';
import { Box, Spinner, Text } from '@/components/ui';
import { config } from '@/config';

interface Child {
  childId: string;
  name: string;
}

interface Subtask {
  label: string;
  completed: boolean;
}

interface Assignment {
  assignmentId: string;
  childId: string;
  templateId: string;
  title: string;
  value: number;
  subtasks: Subtask[];
  isVerificationRequired: boolean;
  status: string;
  assignedAt: string;
  assignedBy: string;
}

export const KioskPage = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childrenRes, assignmentsRes] = await Promise.all([
          fetch(`${config.apiEndpoint}/family/children`, { credentials: 'include' }),
          fetch(`${config.apiEndpoint}/chore/assignments/active`, { credentials: 'include' }),
        ]);

        if (!childrenRes.ok || !assignmentsRes.ok) {
          setError('Failed to load data.');
          return;
        }

        const [childrenData, assignmentsData] = await Promise.all([
          childrenRes.json(),
          assignmentsRes.json(),
        ]);

        setChildren(childrenData.children);
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
      <Box display="flex" justifyContent="center" mt="16">
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt="16">
        <Text color="fg.error">{error}</Text>
      </Box>
    );
  }

  const assignmentsByChild = children.map((child) => ({
    child,
    assignments: assignments.filter((a) => a.childId === child.childId),
  }));

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p="4" minH="100dvh" bg="bg.subtle">
      <Text textStyle="4xl" fontWeight="normal" pb="10">
        Chores
      </Text>
      <Box display="flex" width="full" gap="3" alignItems="flex-start">
        {assignmentsByChild.map(({ child, assignments }) => (
          <Box key={child.childId} flex="1">
            <Text textStyle="xl" fontWeight="medium" pb="4">
              {child.name}
            </Text>
            <Box display="flex" flexDirection="column" gap="2">
              {assignments.length === 0 ? (
                <Text color="fg.muted" textStyle="sm">
                  No active chores
                </Text>
              ) : (
                assignments.map((assignment) => (
                  <Text key={assignment.assignmentId}>{assignment.title}</Text>
                ))
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
