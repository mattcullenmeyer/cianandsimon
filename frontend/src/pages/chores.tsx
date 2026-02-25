import { Box, Text } from '@/components/ui';
import { ChoresCard } from '@/components/chores-card';

export const ChoresPage = () => {
  return (
    <>
      <Text color="fg.default" textStyle="4xl" fontWeight="normal" pb="10">
        Get ready for school
      </Text>

      <Box display="flex" width="full" gap="3" alignItems="flex-start">
        <ChoresCard title="Cian" localStorageKey="cian-chores" />

        <ChoresCard title="Simon" localStorageKey="simon-chores" />
      </Box>
    </>
  );
};
