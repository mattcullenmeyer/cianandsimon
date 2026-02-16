import {
  Backpack,
  Footprints,
  Laugh,
  Shirt,
  Soup,
  SunMedium,
} from 'lucide-react';
import { ToDoButton } from '@/components/to-do-button';
import { Box, Card, Text } from '@/components/ui';

export const MorningChoresPage = () => (
  <>
    <Text color="fg.default" textStyle="4xl" fontWeight="normal" pb="10">
      Get ready for school
    </Text>

    <Box display="flex" width="full" gap="3">
      <Card.Root width="full">
        <Card.Header p="4">
          <Card.Title>Cian</Card.Title>
        </Card.Header>
        <Card.Body p="4" pt="0" display="flex" flexDirection="column" gap="2">
          <ToDoButton label="Clothes" icon={<Shirt size={20} />} storageKey="cian-clothes" />
          <ToDoButton label="Breakfast" icon={<Soup size={20} />} storageKey="cian-breakfast" />
          <ToDoButton label="Teeth" icon={<Laugh size={20} />} storageKey="cian-teeth" />
          <ToDoButton label="Sunscreen" icon={<SunMedium size={20} />} storageKey="cian-sunscreen" />
          <ToDoButton label="Shoes" icon={<Footprints size={20} />} storageKey="cian-shoes" />
          <ToDoButton label="Backpack" icon={<Backpack size={20} />} storageKey="cian-backpack" />
        </Card.Body>
      </Card.Root>

      <Card.Root width="full">
        <Card.Header p="4">
          <Card.Title>Simon</Card.Title>
        </Card.Header>
        <Card.Body p="4" pt="0" display="flex" flexDirection="column" gap="2">
          <ToDoButton label="Clothes" icon={<Shirt size={20} />} storageKey="simon-clothes" />
          <ToDoButton label="Breakfast" icon={<Soup size={20} />} storageKey="simon-breakfast" />
          <ToDoButton label="Teeth" icon={<Laugh size={20} />} storageKey="simon-teeth" />
          <ToDoButton label="Sunscreen" icon={<SunMedium size={20} />} storageKey="simon-sunscreen" />
          <ToDoButton label="Shoes" icon={<Footprints size={20} />} storageKey="simon-shoes" />
          <ToDoButton label="Backpack" icon={<Backpack size={20} />} storageKey="simon-backpack" />
        </Card.Body>
      </Card.Root>
    </Box>
  </>
);
