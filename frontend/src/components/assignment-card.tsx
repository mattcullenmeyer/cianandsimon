import { Avatar, Box, Card, Text } from '@/components/ui';

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
  const dueDate = ttl
    ? new Date(ttl * 1000).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  return (
    <Card.Root>
      <Card.Body
        px="4"
        py="2"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" flexDirection="row" alignItems="center" gap="4">
          <Avatar.Root>
            <Avatar.Fallback />
          </Avatar.Root>

          <Box display="flex" flexDirection="column" gap="0">
            <Text fontWeight="medium">{title}</Text>

            <Box>
              <Text textStyle="sm" color="fg.muted">
                {childName}
              </Text>
              {dueDate && (
                <Text textStyle="sm" color="fg.muted">
                  Due {dueDate}
                </Text>
              )}
            </Box>
          </Box>
        </Box>

        <Text fontWeight="medium" color="accent.emphasis">
          ${value.toFixed(2)}
        </Text>
      </Card.Body>
    </Card.Root>
  );
};
