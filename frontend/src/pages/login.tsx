import { useNavigate } from '@tanstack/react-router';
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
      navigate({ to: '/' }); // TODO: change to dashboard
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
