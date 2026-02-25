import { useEffect, useState } from 'react';
import { Box, Card, Skeleton, Text } from '@/components/ui';
import { config } from '@/config';

export const BalancePage = () => {
  const [cianBalance, setCianBalance] = useState<number | null>(null);
  const [simonBalance, setSimonBalance] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${config.apiEndpoint}/balances/Cian`).then((res) => res.json()),
      fetch(`${config.apiEndpoint}/balances/Simon`).then((res) => res.json()),
    ]).then(([cianData, simonData]) => {
      setCianBalance(cianData.balance);
      setSimonBalance(simonData.balance);
    });
  }, []);

  return (
    <>
      <Text color="fg.default" textStyle="4xl" fontWeight="normal" pb="10">
        Balance
      </Text>

      <Box display="flex" width="full" gap="3">
        <Card.Root width="full">
          <Card.Header p="4">
            <Card.Title>Cian</Card.Title>
          </Card.Header>
          <Card.Body p="4" pt="0" display="flex" flexDirection="column" gap="2">
            <Text textStyle="5xl" fontWeight="bold">
              {cianBalance !== null ? (
                `$${cianBalance.toFixed(2)}`
              ) : (
                <Skeleton height="60px" width="120px" />
              )}
            </Text>
          </Card.Body>
        </Card.Root>

        <Card.Root width="full">
          <Card.Header p="4">
            <Card.Title>Simon</Card.Title>
          </Card.Header>
          <Card.Body p="4" pt="0" display="flex" flexDirection="column" gap="2">
            <Text textStyle="5xl" fontWeight="bold">
              {simonBalance !== null ? (
                `$${simonBalance.toFixed(2)}`
              ) : (
                <Skeleton height="60px" width="120px" />
              )}
            </Text>
          </Card.Body>
        </Card.Root>
      </Box>
    </>
  );
};
