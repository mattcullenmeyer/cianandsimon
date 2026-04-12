import { createFileRoute } from '@tanstack/react-router';
import { KioskPage } from '@/pages/kiosk';

export const Route = createFileRoute('/kiosk')({
  component: KioskPage,
});
