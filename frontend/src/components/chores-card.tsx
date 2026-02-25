import { useState } from 'react';
import { ToDoButton } from '@/components/to-do-button';
import { Box, Button, Card, Input } from '@/components/ui';
import { CirclePlus, Pencil, RotateCcw, Save } from 'lucide-react';

interface ChoresCardProps {
  title: string;
  localStorageKey: string;
}

interface ChoreItem {
  label: string;
  checked: boolean;
}

const DEFAULT_CHORES: ChoreItem[] = [
  'Clothes',
  'Breakfast',
  'Water',
  'Teeth',
  'Sunscreen',
  'Shoes',
  'Backpack',
  'Jacket',
].map((label) => ({ label, checked: false }));

const loadChores = (key: string): ChoreItem[] => {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(key, JSON.stringify(DEFAULT_CHORES));
  return DEFAULT_CHORES;
};

export const ChoresCard = ({ title, localStorageKey }: ChoresCardProps) => {
  const [chores, setChores] = useState(() => loadChores(localStorageKey));
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newChore, setNewChore] = useState('');

  const toggle = ({
    key,
    chores,
    setChores,
    index,
  }: {
    key: string;
    chores: ChoreItem[];
    setChores: (chores: ChoreItem[]) => void;
    index: number;
  }) => {
    const updated = isEditing
      ? chores.filter((_, i) => i !== index)
      : chores.map((item, i) =>
          i === index ? { ...item, checked: !item.checked } : item
        );
    setChores(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  return (
    <Card.Root width="full">
      <Card.Header p="4">
        <Card.Title
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {title}
          <Box display="flex" gap="2">
            <Button
              size="xs"
              variant="outline"
              aria-label="Edit"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Save /> : <Pencil />}
            </Button>
            {!isEditing && (
              <Button
                size="xs"
                variant="outline"
                aria-label="Reset"
                onClick={() => {
                  const reset = chores.map((item) => ({
                    ...item,
                    checked: false,
                  }));
                  setChores(reset);
                  localStorage.setItem(localStorageKey, JSON.stringify(reset));
                }}
              >
                <RotateCcw />
              </Button>
            )}
          </Box>
        </Card.Title>
      </Card.Header>
      <Card.Body p="4" pt="0" display="flex" flexDirection="column" gap="2">
        {chores.map((item, i) => (
          <ToDoButton
            key={item.label}
            label={item.label}
            checked={item.checked}
            isEditing={isEditing}
            onToggle={() =>
              toggle({
                key: localStorageKey,
                chores,
                setChores,
                index: i,
              })
            }
          />
        ))}
        {isEditing && (
          <>
            {!isAdding && (
              <Button
                variant="outline"
                fontWeight="medium"
                width="full"
                display="flex"
                justifyContent="flex-start"
                onClick={() => setIsAdding(true)}
              >
                <CirclePlus size={20} />
                Add
              </Button>
            )}

            {isAdding && (
              <Input
                autoFocus
                value={newChore}
                onChange={(e) => setNewChore(e.target.value)}
                onBlur={() => {
                  const updated = [
                    ...chores,
                    { label: newChore, checked: false },
                  ];
                  setChores(updated);
                  localStorage.setItem(
                    localStorageKey,
                    JSON.stringify(updated)
                  );
                  setNewChore('');
                  setIsAdding(false);
                }}
              />
            )}
          </>
        )}
      </Card.Body>
    </Card.Root>
  );
};
