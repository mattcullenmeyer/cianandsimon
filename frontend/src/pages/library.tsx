// import { useEffect, useState } from 'react';
// import { AssignmentCard } from '@/components/assignment-card';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Box, Button, Text, Tabs } from '@/components/ui';

const TABS = [
  { value: 'unscheduled', label: 'Unscheduled' },
  { value: 'scheduled', label: 'Scheduled' },
] as const;

export function LibraryPage() {
  const navigate = useNavigate({ from: '/home/library' });
  const { tab } = useSearch({ from: '/home/library' });

  return (
    <Box display="flex" flexDirection="column" flex="1" overflow="hidden">
      <Tabs.Root
        variant="line"
        size="md"
        fitted
        value={tab}
        onValueChange={({ value }) =>
          navigate({ search: { tab: value as typeof tab } })
        }
      >
        <Tabs.List py="1">
          {TABS.map((t) => (
            <Tabs.Trigger key={t.value} value={t.value}>
              {t.label.toUpperCase()}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
      </Tabs.Root>
      <Box
        display="flex"
        flexDirection="column"
        gap="6"
        p="4"
        flex="1"
        overflow="hidden"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Text textStyle="xl" fontWeight="semibold">
            Chore Library
          </Text>

          <Button size="xs" variant="outline">
            FILTER
          </Button>
        </Box>

        <Box display="flex" flexDirection="column" flex="1" overflow="hidden">
          <Box flex="1">Content</Box>
          {/* <Box flex="1" overflowY="auto">
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
        </Box> */}

          <Box pt="4" p="1">
            <Button
              width="full"
              justifyContent="center"
              css={{ '--btn-bg': '{colors.green.primary}' }}
            >
              CREATE CHORE
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
