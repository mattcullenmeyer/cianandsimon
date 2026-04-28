import { Box, Text } from '@/components/ui';
import { ChoresCard } from '@/components/chores-card';
// import { RRule } from 'rrule';

// const rule = new RRule({
//   freq: RRule.DAILY,
//   // byweekday: [RRule.TU.nth(2)],
//   byhour: 23,
//   byminute: 10,
// });

// const ruleString = rule.toString();
// console.log(ruleString);

export const ChoresPage = () => {
  return (
    <>
      <Text color="fg.default" textStyle="4xl" fontWeight="normal" pb="10">
        Chores
      </Text>

      <Box display="flex" width="full" gap="3" alignItems="flex-start">
        <ChoresCard title="Cian" localStorageKey="cian-chores" />

        <ChoresCard title="Simon" localStorageKey="simon-chores" />
      </Box>
    </>
  );
};
