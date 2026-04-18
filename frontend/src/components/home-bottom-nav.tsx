import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Box } from '@/components/ui';
import { NavButton } from '@/components/nav-button';
import { ClipboardList, UsersRound, BookText, Settings } from 'lucide-react';

const SIZE = 36;
const STROKE_WIDTH = '1.25px';

export const HomeBottomNav = () => {
  const navigate = useNavigate();
  const { location } = useRouterState();

  return (
    <Box
      paddingY="2"
      borderTop="2px solid {colors.gray.secondary}"
      display="flex"
      justifyContent="space-around"
    >
      <NavButton
        label="Chores"
        icon={<ClipboardList strokeWidth={STROKE_WIDTH} size={SIZE} />}
        onClick={() =>
          navigate({ to: '/home/chores', search: { tab: 'active' } })
        }
        isActive={location.pathname === '/home/chores'}
      />

      <NavButton
        label="Library"
        icon={<BookText strokeWidth={STROKE_WIDTH} size={SIZE} />}
        onClick={() => navigate({ to: '/home/library' })}
        isActive={location.pathname === '/home/library'}
      />

      <NavButton
        label="Users"
        icon={<UsersRound strokeWidth={STROKE_WIDTH} size={SIZE} />}
        isActive={location.pathname === '/home/users'}
        onClick={() => navigate({ to: '/home/users' })}
      />
      <NavButton
        label="Settings"
        icon={<Settings strokeWidth={STROKE_WIDTH} size={SIZE} />}
        isActive={location.pathname === '/home/settings'}
        onClick={() => navigate({ to: '/home/settings' })}
      />
    </Box>
  );
};
