'use client';
import GettingStartedForm from './GettingStartedForm';
import ConnectToServices from './ConnectToServices';
import { User } from '@auth0/nextjs-auth0/types';
import { useMemo, useState, useEffect } from 'react';
import { useGetAccountQuery } from '@/lib/store/accountApi';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@chakra-ui/react';
import OnboardingSteps from './OnboardingSteps';

export type PendingAccount = {
  email: string;
  name: string;
  username: string;
  userId: string;
};

export default function GettingStartedContent({
  user,
}: {
  user: User | undefined;
}) {
  const router = useRouter();
  const { data: account, isFetching } = useGetAccountQuery(
    user?.email ? { email: user.email } : skipToken
  );

  const [manualStep, setManualStep] = useState<number | null>(null);
  const [pendingAccount, setPendingAccount] = useState<PendingAccount | null>(
    null
  );

  // Redirect if user already completed onboarding
  useEffect(() => {
    if (account?.hasRegistered) {
      router.replace('/dashboard');
    }
  }, [account?.hasRegistered, router]);

  // Derive step from pendingAccount and manual override (no DB read for step)
  const currentStep = useMemo(() => {
    return manualStep !== null ? manualStep : pendingAccount ? 1 : 0;
  }, [pendingAccount, manualStep]);

  const displayStep = currentStep + 1; // map 0/1 to 1/2 for the UI

  const handleStep1Complete = (data: PendingAccount) => {
    setPendingAccount(data);
    setManualStep(1);
  };

  // Render content based on current step
  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <GettingStartedForm
            user={user}
            pendingAccount={pendingAccount}
            onStep1Complete={handleStep1Complete}
          />
        );
      case 1:
        return (
          pendingAccount && (
            <ConnectToServices
              profile={pendingAccount}
              onGoBack={() => setManualStep(0)}
            />
          )
        );
    }
  };

  return (
    <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-black/50 backdrop-blur-md sm:p-8">
      <OnboardingSteps
        currentStep={displayStep}
        totalSteps={2}
        title={
          displayStep === 1
            ? 'Tell us a bit about you'
            : 'Connect your music services'
        }
        description={
          displayStep === 1
            ? 'We use this information to personalise your SoundOwl experience.'
            : 'Link Spotify and SoundCloud so SoundOwl can sync your data.'
        }
      />
      <div className="mt-6">
        {isFetching && !pendingAccount ? (
          <div className="flex items-center justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}
