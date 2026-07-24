'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    } else if (isAuthenticated && user) {
      if (!user.onboardingCompleted && !pathname.startsWith('/onboarding')) {
        router.replace('/onboarding');
      } else if (user.onboardingCompleted && pathname.startsWith('/onboarding')) {
        router.replace('/');
      } else if (user.onboardingCompleted && pathname === '/login') {
        router.replace('/');
      }
    }
  }, [isAuthenticated, user, pathname, router, mounted]);

  // Avoid rendering children while checking auth state or redirecting
  if (!mounted) return null;

  if (!isAuthenticated && pathname !== '/login') {
    return null; // Will redirect to login
  }

  if (isAuthenticated && user && !user.onboardingCompleted && !pathname.startsWith('/onboarding')) {
    return null; // Will redirect to onboarding
  }

  return <>{children}</>;
}
