import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Box, Button, Card, Text } from '@/components/ui';
import { config } from '@/config';

interface Family {
  familyId: string;
  name: string;
}

interface SelectFamilyPageProps {
  families: Family[];
}

export const SelectFamilyPage = ({ families }: SelectFamilyPageProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSelect = async (familyId: string) => {
    setError('');
    setLoading(familyId);
    try {
      const response = await fetch(`${config.apiEndpoint}/parent/select-family`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyId }),
        credentials: 'include',
      });

      if (response.ok) {
        sessionStorage.removeItem('selectFamilyOptions');
        navigate({ to: '/home' });
      } else {
        setError('Failed to select family. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt="16" px="3">
      <Card.Root width="sm">
        <Card.Header>
          <Card.Title textStyle="2xl">Select a family</Card.Title>
          <Card.Description>Choose which family to log in to</Card.Description>
        </Card.Header>
        <Card.Body>
          <Box display="flex" flexDirection="column" gap="3">
            {families.map((family) => (
              <Button
                key={family.familyId}
                variant="outline"
                justifyContent="center"
                loading={loading === family.familyId}
                disabled={loading !== null}
                onClick={() => handleSelect(family.familyId)}
              >
                {family.name}
              </Button>
            ))}
            {error && (
              <Text color="fg.error" textStyle="sm">
                {error}
              </Text>
            )}
          </Box>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};
