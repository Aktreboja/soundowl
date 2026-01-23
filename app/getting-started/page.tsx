'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@chakra-ui/react';
import GettingStartedContent from '@/components/getting-started/GettingStartedContent';

export default function GettingStarted() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
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

  return (
    <div className="mx-auto min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-2xl font-bold text-center">Getting Started</h1>
      <GettingStartedContent user={user} />
    </div>
  );
}
