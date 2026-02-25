import { useEffect, useState } from 'react';
import { config } from '@/config';
import { Button, Card, Table, Text } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

interface Transaction {
  date: string;
  amount: number;
  description: string;
}

interface TransactionsPageProps {
  name: 'Cian' | 'Simon';
  onClickBack: () => void;
}

export const TransactionsPage = ({
  name,
  onClickBack,
}: TransactionsPageProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    fetch(
      `${config.apiEndpoint}/transactions/${name}?start=${start}&end=${end}`
    )
      .then((res) => res.json())
      .then((data) => setTransactions(data.data));
  }, [name]);

  return (
    <>
      <Text color="fg.default" textStyle="4xl" fontWeight="normal" pb="10">
        Deposits and Withdrawals
      </Text>

      <Card.Root width="full">
        <Card.Header px="4" pt="4" pb="0">
          <Card.Title
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {`${name} transactions`}

            <Button
              size="xs"
              variant="outline"
              fontWeight="medium"
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              onClick={onClickBack}
            >
              <ArrowLeft size={20} />
              Back
            </Button>
          </Card.Title>
        </Card.Header>
        <Card.Body p="4" overflow="auto">
          <Table.Root>
            <Table.Head>
              <Table.Row>
                <Table.Header>Date</Table.Header>
                <Table.Header>Amount</Table.Header>
                <Table.Header>Description</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {transactions.map((transaction, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{transaction.date}</Table.Cell>
                  <Table.Cell>{transaction.amount.toFixed(2)}</Table.Cell>
                  <Table.Cell>{transaction.description}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Body>
      </Card.Root>
    </>
  );
};
