import { useEffect, useState } from 'react';
import { CardStack } from '@/components/card-stack';
import { UnscheduledTemplateCard } from '@/components/unscheduled-template-card';
import { Box, Spinner, Text } from '@/components/ui';
import { config } from '@/config';

interface Template {
  templateId: string;
  title: string;
  value: number;
  assignedChildIds: string[];
  subtaskCount: number;
}

export function UnscheduledTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${config.apiEndpoint}/chore/templates?type=unscheduled`,
          { credentials: 'include' }
        );

        if (!res.ok) {
          setError('Failed to load templates.');
          return;
        }

        const data: { templates: Template[] } = await res.json();
        setTemplates(data.templates);
      } catch {
        setError('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt="8">
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return <Text color="fg.error">{error}</Text>;
  }

  if (templates.length === 0) {
    return <Text color="fg.muted">No templates.</Text>;
  }

  return (
    <CardStack.Root>
      {templates.map((template) => (
        <UnscheduledTemplateCard
          key={template.templateId}
          title={template.title}
          value={template.value}
        />
      ))}
    </CardStack.Root>
  );
}
