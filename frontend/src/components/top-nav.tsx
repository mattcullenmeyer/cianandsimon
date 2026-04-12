import { Avatar, Box, Text } from '@/components/ui';

export const TopNav = () => {
  return (
    <Box
      as="nav"
      borderBottomWidth="1px"
      px="6"
      py="4"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Text fontWeight="medium">Top nav</Text>
      <Avatar.Root>
        <Avatar.Fallback />
      </Avatar.Root>
    </Box>
  );
};
