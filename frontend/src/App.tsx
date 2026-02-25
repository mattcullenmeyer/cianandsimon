import { BrushCleaning, HandCoins, Landmark } from 'lucide-react';
import { Box } from './components/ui';
import { NavButton } from './components/nav-button';
import { useState } from 'react';
import { ChoresPage } from './pages/chores';
import { BalancePage } from './pages/balance';
import { DepositPage } from './pages/deposit';

function App() {
  const [page, setPage] = useState<'chores' | 'balance' | 'deposit'>('chores');

  return (
    <Box bg="slate.50" display="flex" flexDirection="column" height="100dvh">
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        alignItems="center"
        p="4"
        overflow="auto"
      >
        {page === 'chores' && <ChoresPage />}
        {page === 'balance' && <BalancePage />}
        {page === 'deposit' && <DepositPage />}
      </Box>

      <Box
        paddingY="4"
        bg="white"
        borderTop="1px solid"
        borderColor="colorPalette.outline.border"
        display="flex"
        justifyContent="space-around"
      >
        <NavButton
          label="Chores"
          icon={<BrushCleaning strokeWidth={1.5} size={32} />}
          onClick={() => setPage('chores')}
        />

        <NavButton
          label="Balance"
          icon={<Landmark strokeWidth={1.5} size={32} />}
          onClick={() => setPage('balance')}
        />

        <NavButton
          label="Deposit"
          icon={<HandCoins strokeWidth={1.5} size={32} />}
          onClick={() => setPage('deposit')}
        />
      </Box>
    </Box>
  );
}

export default App;
