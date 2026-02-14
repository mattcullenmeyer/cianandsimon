import {
  Backpack,
  Footprints,
  Laugh,
  Shirt,
  Soup,
  SunMedium,
} from 'lucide-react';
import { Box, Card, Text } from './components/ui';
import { ToDoButton } from './components/to-do-button';

function App() {
  return (
    <Box
      bg="slate.50"
      display="flex"
      flexDirection="column"
      alignItems="center"
      p="4"
      minHeight="dvh"
    >
      <Text color="fg.default" textStyle="4xl" fontWeight="normal" pb="4">
        Morning
      </Text>

      <Box display="flex" width="full" gap="3">
        <Card.Root width="full">
          <Card.Header p="4">
            <Card.Title>Cian</Card.Title>
          </Card.Header>
          <Card.Body p="4" pt="0" display="flex" flexDirection="column" gap="2">
            <ToDoButton label="Clothes" icon={<Shirt />} />
            <ToDoButton label="Breakfast" icon={<Soup />} />
            <ToDoButton label="Teeth" icon={<Laugh />} />
            <ToDoButton label="Sunscreen" icon={<SunMedium />} />
            <ToDoButton label="Shoes" icon={<Footprints />} />
            <ToDoButton label="Backpack" icon={<Backpack />} />
          </Card.Body>
        </Card.Root>

        <Card.Root width="full">
          <Card.Header p="4">
            <Card.Title>Simon</Card.Title>
          </Card.Header>
          <Card.Body p="4" pt="0" display="flex" flexDirection="column" gap="2">
            <ToDoButton label="Clothes" icon={<Shirt />} />
            <ToDoButton label="Breakfast" icon={<Soup />} />
            <ToDoButton label="Teeth" icon={<Laugh />} />
            <ToDoButton label="Sunscreen" icon={<SunMedium />} />
            <ToDoButton label="Shoes" icon={<Footprints />} />
            <ToDoButton label="Backpack" icon={<Backpack />} />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default App;
