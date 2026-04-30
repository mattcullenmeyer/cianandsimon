import { CardStack } from '@/components/card-stack';
import { Box, Text } from '@/components/ui';
import { ChevronRight } from 'lucide-react';

interface AdditionalOptionCardProps {
  heading: string;
  description: string;
  highlight?: string;
  onClick: () => void;
}

export const AdditionalOptionCard = ({
  heading,
  description,
  highlight,
  onClick,
}: AdditionalOptionCardProps) => {
  return (
    <CardStack.Item onClick={onClick}>
      <Box
        display="flex"
        flexDirection="column"
        gap="0.5"
        alignItems="flex-start"
      >
        <Text textStyle="sm" fontWeight="medium">
          {heading}
        </Text>
        <Text textStyle="xs" color="fg.muted">
          {description}
        </Text>
        {highlight && (
          <Text textStyle="xs" fontWeight="medium" color="blue.primary">
            {highlight}
          </Text>
        )}
      </Box>

      <Box color="gray.primary">
        <ChevronRight strokeWidth={2.5} size={20} />
      </Box>
    </CardStack.Item>
  );
};
