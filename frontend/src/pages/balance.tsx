import { Box, Text } from '@/components/ui';
import { BalanceCard } from '@/components/balance-card';
import { useState } from 'react';
import { TransactionsPage } from './transactions';

export const BalancePage = () => {
  const [name, setName] = useState<'Cian' | 'Simon' | null>(null);

  if (!name) {
    return (
      <>
        <Text color="fg.default" textStyle="4xl" fontWeight="normal" pb="10">
          Balance
        </Text>

        <Box display="flex" width="full" gap="3">
          <BalanceCard name="Cian" onClickDetails={() => setName('Cian')} />

          <BalanceCard name="Simon" onClickDetails={() => setName('Simon')} />
        </Box>
      </>
    );
  }

  return <TransactionsPage name={name} onClickBack={() => setName(null)} />;
};
