import { CardStack } from '@/components/card-stack';
import { Box, Text } from '@/components/ui';
import { ChevronRight } from 'lucide-react';

// TODO: pass childIds and display as overlapping avatars below title
// TODO: should also accept number of subtasks and display that below title as well

interface UnscheduledTemplateCardProps {
  title: string;
  value: number;
}

export const UnscheduledTemplateCard = ({
  title,
  value,
}: UnscheduledTemplateCardProps) => {
  return (
    <CardStack.Item>
      <Box display="flex" flexDirection="row" alignItems="center" gap="4">
        <Box display="flex" flexDirection="column" gap="0.5">
          <Text textStyle="sm" fontWeight="medium">
            {title}
          </Text>

          {/* <Box display="flex" flexDirection="row" gap="2" alignItems="center">
            <Box display="flex" alignItems="center" gap="1" color="fg.muted">
              <User size={12} strokeWidth={1.5} />
              <Text textStyle="xs">{childName}</Text>
            </Box>
          </Box> */}
        </Box>
      </Box>

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
