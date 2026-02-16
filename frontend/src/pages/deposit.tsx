import {
  Box,
  Card,
  Field,
  Input,
  Text,
  RadioGroup,
  Button,
} from '@/components/ui';
import { useState } from 'react';

const chores = [
  'Get ready for school',
  'Empty dishwasher',
  'Dog poop',
  'Cat box',
  'Other',
];

const amounts = {
  'Get ready for school': 0.1,
  'Empty dishwasher': 0.25,
  'Dog poop': 0.25,
  'Cat box': 0.25,
  Other: null,
};

interface Form {
  amount: number | null;
  name: 'Cian' | 'Simon';
  reason: string;
  other?: string;
}

const initialForm: Form = {
  amount: amounts[chores[0] as keyof typeof amounts],
  name: 'Cian',
  reason: chores[0],
};

export const DepositPage = () => {
  const [form, setForm] = useState<Form>(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    fetch('https://api.cianandsimon.xyz/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        amount: form.amount,
        description: form.reason === 'Other' ? form.other : form.reason,
      }),
    }).finally(() => {
      setIsLoading(false);
      setForm(initialForm);
    });
  };

  return (
    <>
      <Text color="fg.default" textStyle="4xl" fontWeight="normal" pb="10">
        Deposit
      </Text>

      <Box display="flex" width="full" paddingX="16">
        <Card.Root width="full">
          <Card.Header p="4">
            <Card.Title>New deposit</Card.Title>
          </Card.Header>
          <Card.Body p="4" pt="0" display="flex" flexDirection="column" gap="4">
            <Field.Root>
              <Field.Label>Name</Field.Label>
              <RadioGroup.Root
                value={form.name}
                onValueChange={(e) =>
                  setForm({
                    ...form,
                    name: e.value as Form['name'],
                  })
                }
              >
                <RadioGroup.Item key="Cian" value="Cian">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemControl />
                  <RadioGroup.ItemText>Cian</RadioGroup.ItemText>
                </RadioGroup.Item>

                <RadioGroup.Item key="Simon" value="Simon">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemControl />
                  <RadioGroup.ItemText>Simon</RadioGroup.ItemText>
                </RadioGroup.Item>
              </RadioGroup.Root>
            </Field.Root>

            <Field.Root>
              <Field.Label>Reason</Field.Label>
              <RadioGroup.Root
                value={form.reason}
                onValueChange={(e) =>
                  setForm({
                    ...form,
                    reason: e.value ?? '',
                    amount: amounts[e.value as keyof typeof amounts],
                  })
                }
              >
                {chores.map((chore) => (
                  <RadioGroup.Item key={chore} value={chore}>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemControl />
                    <RadioGroup.ItemText>{chore}</RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
              {form.reason === 'Other' && (
                <Input
                  value={form.other}
                  onChange={(e) => setForm({ ...form, other: e.target.value })}
                />
              )}
            </Field.Root>

            <Field.Root>
              <Field.Label>Amount</Field.Label>
              <Input
                type="number"
                value={form.amount ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount:
                      e.target.value === '' ? null : Number(e.target.value),
                  })
                }
              />
            </Field.Root>

            <Button loading={isLoading} onClick={handleSubmit}>
              Submit
            </Button>
          </Card.Body>
        </Card.Root>
      </Box>
    </>
  );
};
