
import ProtectedPageLayout from '../../components/Auth/ProtectedPageLayout';
import { Button, Field, Input, Stack } from '@chakra-ui/react';
import { auth0 } from '../../lib/auth0';
import { toaster } from '@/components/ui/toaster';
import GettingStartedForm from '@/components/Auth/GettingStartedForm';

export default async function GettingStarted() {
  const session = await auth0.getSession();
  const user = session?.user;


  const handleRegistration = async () => {
    "use server";
    try {
      const response = await fetch('/api/registration', {
        method: 'POST',
        body: JSON.stringify({ email: user?.email, name: user?.name, username: user?.nickname }),
      });
      if (response.ok) {
        toaster.create({
          title: 'Registration Successful',
          description: 'You have been registered successfully',
          type: 'success',
        })
      }
    } catch (error) {
      console.error('Registration error:', error);
      toaster.create({
        title: 'Registration Failed',
        description: 'An error occurred while registering',
        type: 'error',
      })
    }
    // redirect('/');
  }

  return (
    <ProtectedPageLayout>
      <div className = " mx-auto min-h-screen flex items-center justify-center flex-col">
        <h1 className = "text-2xl font-bold text-center">Getting Started</h1>

        <GettingStartedForm user={user} />
      </div>
    </ProtectedPageLayout>
  );
}
