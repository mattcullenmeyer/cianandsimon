import { useNavigate } from '@tanstack/react-router';
import { AuthCard } from '@/components/auth-card';
import { config } from '@/config';

export const SignupPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string) => {
    const response = await fetch(`${config.apiEndpoint}/parent/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 201) {
      navigate({ to: '/login' });
    } else {
      throw new Error('Signup failed. Please try again.');
    }
  };

  return (
    <AuthCard
      title="Create your account"
      description="Welcome to Cianandsimon"
      submitLabel="Create account"
      onSubmit={handleSubmit}
    />
  );
};
