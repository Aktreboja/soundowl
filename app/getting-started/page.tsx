'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@chakra-ui/react';
import GettingStartedContent from '@/components/getting-started/GettingStartedContent';
import { useGetAccountQuery } from '@/lib/store/accountApi';
import { skipToken } from '@reduxjs/toolkit/query/react';

export default function GettingStarted() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { data: account, isFetching } = useGetAccountQuery(
    user?.email ? { email: user.email } : skipToken
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading || isFetching) {
    return (
      <div className="mx-auto min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Don't render content if not authenticated (redirect will happen)
  if (!user) {
    return null;
  }

  if (account?.hasRegistered) {
    router.push('/dashboard');
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div className="relative z-10 flex w-full max-w-5xl items-center justify-center">
        <GettingStartedContent user={user} />
      </div>
    </div>
  );
}
