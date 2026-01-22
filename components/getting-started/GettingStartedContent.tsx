'use client';
import GettingStartedForm from './GettingStartedForm';
import ConnectToServices from './ConnectToServices';
import { User } from '@auth0/nextjs-auth0/types';
import { useState, useEffect, useMemo } from 'react';
import { useGetAccountQuery } from '@/lib/store/accountApi';
import { useUser } from '@auth0/nextjs-auth0/client';
import { skipToken } from '@reduxjs/toolkit/query/react';

export default function GettingStartedContent({
  user,
}: {
  user: User | undefined;
}) {
  const { user: auth0User } = useUser();

  const { data: account, isLoading } = useGetAccountQuery(
    auth0User?.email ? { email: auth0User.email } : skipToken
  );

  const [currentStep, setCurrentStep] = useState<number>(0);

  const currentStepHandler = useMemo(() => {
    if (account) {
      return 1;
    } else {
      return 0;
    }
  }, [account, isLoading]);

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return <GettingStartedForm user={user} stepHandler={setCurrentStep} />;
      case 1:
        return <ConnectToServices />;
      case 2:
        return <div>Step 2</div>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      {renderContent()}
    </div>
  );
}
