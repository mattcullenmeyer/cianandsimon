import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { styled } from 'styled-system/jsx';
import { input } from 'styled-system/recipes';
import { Box, Button, Card, Field, Input, Text } from '@/components/ui';
import { config } from '@/config';

const Select = styled('select', input);

const TIMEZONES = Intl.supportedValuesOf('timeZone');
const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const CreateFamilyPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState(USER_TIMEZONE);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${config.apiEndpoint}/family`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, timezone }),
        credentials: 'include',
      });

      if (response.status === 201) {
        navigate({ to: '/home' });
      } else {
        setError('Failed to create family. Please try again.');
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
          <Card.Title textStyle="2xl">Create your family</Card.Title>
          <Card.Description>Set up your family to get started</Card.Description>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap="4">
              <Field.Root>
                <Field.Label>Family name</Field.Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Timezone</Field.Label>
                <Select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </Select>
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
                Create family
              </Button>
            </Box>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};
