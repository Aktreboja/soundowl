'use client';

import { ReactNode } from 'react';

type OnboardingStepsProps = {
  currentStep: number;
  totalSteps?: number;
  title?: ReactNode;
  description?: ReactNode;
};

export default function OnboardingSteps({
  currentStep,
  totalSteps = 2,
  title,
  description,
}: OnboardingStepsProps) {
  const safeCurrentStep =
    currentStep < 1 ? 1 : currentStep > totalSteps ? totalSteps : currentStep;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            Onboarding
          </p>
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl">
              {title ?? 'Getting started with SoundOwl'}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Step {safeCurrentStep} of {totalSteps}
          </p>
        </div>
      </div>
      {description && (
        <p className="text-sm text-slate-300 max-w-3xl">{description}</p>
      )}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === safeCurrentStep;
          return (
            <span
              key={stepNumber}
              className={`h-2.5 rounded-full transition-all ${
                isActive
                  ? 'w-8 bg-indigo-400 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]'
                  : 'w-2.5 bg-slate-700'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

