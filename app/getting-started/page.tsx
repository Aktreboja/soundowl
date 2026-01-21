import ProtectedPageLayout from '../../components/Auth/ProtectedPageLayout';
import { Button, Field, Input, Stack } from '@chakra-ui/react';
import { auth0 } from '../../lib/auth0';
import { toaster } from '@/components/ui/toaster';
import GettingStartedForm from '@/components/Auth/GettingStartedForm';

export default async function GettingStarted() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <ProtectedPageLayout>
      <div className=" mx-auto min-h-screen flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold text-center">Getting Started</h1>

        <GettingStartedForm user={user} />
      </div>
    </ProtectedPageLayout>
  );
}
