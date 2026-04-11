import { useState } from 'react';
import { Box, Button, Card, Field, Input, Text } from '@/components/ui';

interface AuthCardProps {
  title: string;
  description: string;
  submitLabel: string;
  onSubmit: (email: string, password: string) => Promise<void>;
}

export const AuthCard = ({
  title,
  description,
  submitLabel,
  onSubmit,
}: AuthCardProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(email, password);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt="16">
      <Card.Root width="sm">
        <Card.Header>
          <Card.Title textStyle="2xl">{title}</Card.Title>
          <Card.Description>{description}</Card.Description>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap="4">
              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Password</Field.Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field.Root>
              {error && (
                <Text color="fg.error" textStyle="sm">
                  {error}
                </Text>
              )}
              <Button
                type="submit"
                loading={loading}
                justifyContent="center"
                mt="4"
              >
                {submitLabel}
              </Button>
            </Box>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};
