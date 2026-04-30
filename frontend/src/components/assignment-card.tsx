import { CardStack } from '@/components/card-stack';
import { Box, Text } from '@/components/ui';
import { Calendar, ChevronRight, User } from 'lucide-react';

interface AssignmentCardProps {
  title: string;
  value: number;
  childName: string;
  ttl?: number;
}

export const AssignmentCard = ({
  title,
  value,
  childName,
  ttl,
}: AssignmentCardProps) => {
  // const ttl = 1745193600; // for testing
  const dueDate = ttl
    ? new Date(ttl * 1000).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  return (
    <CardStack.Item>
      {/* <Box display="flex" flexDirection="row" alignItems="center" gap="4"> */}
      <Box display="flex" flexDirection="column" gap="0.5">
        <Text textStyle="sm" fontWeight="medium">
          {title}
        </Text>

        <Box display="flex" flexDirection="row" gap="2" alignItems="center">
          <Box display="flex" alignItems="center" gap="1" color="fg.muted">
            <User size={12} strokeWidth={1.5} />
            <Text textStyle="xs">{childName}</Text>
          </Box>
          {dueDate && (
            <Box display="flex" alignItems="center" gap="1" color="fg.muted">
              <Calendar size={12} strokeWidth={1.5} />
              <Text textStyle="xs">{dueDate}</Text>
            </Box>
          )}
        </Box>
      </Box>
      {/* </Box> */}

      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap="1"
        color="gray.primary"
      >
        <Text textStyle="sm" fontWeight="medium" color="purple.secondary">
          ${value.toFixed(2)}
        </Text>
        <ChevronRight strokeWidth={2.5} size={20} />
      </Box>
    </CardStack.Item>
  );
};
