'use client';

import React from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '@/lib/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check authentication on mount for protected routes
    const currentPath = window.location.pathname;
    const isProtected = currentPath.startsWith('/app');

    if (isProtected && !authUtils.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
}
