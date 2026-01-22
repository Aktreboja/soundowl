'use client';
import GettingStartedForm from './GettingStartedForm';
import ConnectToServices from './ConnectToServices';
import { User } from '@auth0/nextjs-auth0/types';
import { User as UserType } from '@/types/User';
import { useEffect, useMemo, useState } from 'react';
import { useGetAccountQuery } from '@/lib/store/accountApi';
import { useUser } from '@auth0/nextjs-auth0/client';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { Spinner } from '@chakra-ui/react';

export default function GettingStartedContent({
  user,
}: {
  user: User | undefined;
}) {
  const { user: auth0User } = useUser();

  const { data: account, isFetching } = useGetAccountQuery(
    auth0User?.email ? { email: auth0User.email } : skipToken
  );

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (account) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  }, [account])

  // Render content based on current step
  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return <GettingStartedForm user={user} setCurrentStep={setCurrentStep} />;
      case 1:
        return <ConnectToServices account={account as UserType}/>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full mt-4">
      {
        isFetching ? <div className="flex items-center justify-center w-full">
          <Spinner size="lg" />
        </div> : renderContent()
      }
    </div>
  );
}
