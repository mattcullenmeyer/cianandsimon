import { Button, Card, Skeleton, Text } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { config } from '@/config';

interface BalanceCardProps {
  name: 'Cian' | 'Simon';
  onClickDetails: () => void;
}

export const BalanceCard = ({ name, onClickDetails }: BalanceCardProps) => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${config.apiEndpoint}/balances/${name}`)
      .then((res) => res.json())
      .then((data) => setBalance(data.balance));
  }, [name]);

  return (
    <Card.Root width="full">
      <Card.Header p="4">
        <Card.Title
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {name}

          <Button
            size="xs"
            variant="outline"
            fontWeight="medium"
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            onClick={onClickDetails}
          >
            Details
            <ArrowRight size={20} />
          </Button>
        </Card.Title>
      </Card.Header>
      <Card.Body p="4" pt="0" display="flex" flexDirection="column" gap="2">
        <Text textStyle="5xl" fontWeight="bold">
          {balance !== null ? (
            `$${balance.toFixed(2)}`
          ) : (
            <Skeleton height="60px" width="120px" />
          )}
        </Text>
      </Card.Body>
    </Card.Root>
  );
};
