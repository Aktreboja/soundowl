'use client';
import GettingStartedForm from './GettingStartedForm';
import ConnectToServices from './ConnectToServices';
import { User } from '@auth0/nextjs-auth0/types';
import { User as UserType } from '@/types/User';
import { useMemo, useState } from 'react';
import { useGetAccountQuery } from '@/lib/store/accountApi';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { Spinner } from '@chakra-ui/react';

export default function GettingStartedContent({
  user,
}: {
  user: User | undefined;
}) {
  // Use the user prop directly instead of calling useUser() again
  const { data: account, isFetching } = useGetAccountQuery(
    user?.email ? { email: user.email } : skipToken
  );

  const [manualStep, setManualStep] = useState<number | null>(null);

  // Derive step from account, but allow manual override
  const currentStep = useMemo(() => {
    return manualStep !== null ? manualStep : account ? 1 : 0;
  }, [account, manualStep]);

  // Render content based on current step
  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <GettingStartedForm user={user} setCurrentStep={setManualStep} />
        );
      case 1:
        return <ConnectToServices account={account as UserType} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full mt-4">
      {isFetching ? (
        <div className="flex items-center justify-center w-full">
          <Spinner size="lg" />
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
}
