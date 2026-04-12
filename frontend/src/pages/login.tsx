import { useNavigate } from '@tanstack/react-router';

type LoginResponse =
  | Record<string, never>
  | { familyId: string }
  | { families: Array<{ familyId: string; name: string }> };
import { AuthCard } from '@/components/auth-card';
import { config } from '@/config';

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string) => {
    const response = await fetch(`${config.apiEndpoint}/parent/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (response.status === 200) {
      const body: LoginResponse = await response.json();

      if ('families' in body) {
        // Multiple families
        sessionStorage.setItem(
          'selectFamilyOptions',
          JSON.stringify(body.families)
        );
        navigate({ to: '/select-family' });
      } else if ('familyId' in body) {
        // Single family
        navigate({ to: '/home' });
      } else {
        // No families yet
        navigate({ to: '/create-family' });
      }
    } else {
      throw new Error('Login failed. Please try again.');
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to your account"
      submitLabel="Log in"
      onSubmit={handleSubmit}
    />
  );
};
