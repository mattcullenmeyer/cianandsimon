import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Box, Button, Card, PinInput, Text } from '@/components/ui';
import { config } from '@/config';

interface VerifyEmailPageProps {
  email: string;
}

export const VerifyEmailPage = ({ email }: VerifyEmailPageProps) => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (value: string) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `${config.apiEndpoint}/parent/verify-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, pin: value }),
        }
      );

      if (response.status === 200) {
        navigate({ to: '/login' });
      } else {
        setError('Invalid or expired code. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt="16" px="3">
      <Card.Root width="sm">
        <Card.Header>
          <Card.Title textStyle="2xl">Verification code</Card.Title>
          <Card.Description>
            Please enter the verification code sent to <strong>{email}</strong>
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Box display="flex" flexDirection="column" gap="6">
            <PinInput.Root
              type="alphanumeric"
              onValueChange={(details) => setPin(details.valueAsString)}
              onValueComplete={(details) => handleSubmit(details.valueAsString)}
              disabled={loading}
              display="flex"
              justifyContent="center"
            >
              <PinInput.Control>
                {Array.from({ length: 6 }).map((_, index) => (
                  <PinInput.Input key={index} index={index} />
                ))}
              </PinInput.Control>
              <PinInput.HiddenInput />
            </PinInput.Root>
            {error && (
              <Text color="fg.error" textStyle="sm">
                {error}
              </Text>
            )}
            <Button
              justifyContent="center"
              loading={loading}
              disabled={pin.length < 6}
              onClick={() => handleSubmit(pin)}
            >
              Verify
            </Button>
          </Box>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};
