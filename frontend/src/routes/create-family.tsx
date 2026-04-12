import { createFileRoute } from '@tanstack/react-router';
import { CreateFamilyPage } from '@/pages/create-family';

export const Route = createFileRoute('/create-family')({
  component: CreateFamilyPage,
});
