import LoginTemplate from '@/src/templates/login/LoginTemplate';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - melo.tv',
  description: 'Sign in to melo.tv to connect with strangers who share your passions.',
};

export default function LoginPage() {
  return <LoginTemplate />;
}

