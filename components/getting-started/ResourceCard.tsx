'use client';

import { ReactNode } from 'react';
import { Button } from '@chakra-ui/react';
import { CheckCircle2 } from 'lucide-react';

type ResourceCardProps = {
  label: string;
  description: string;
  icon: ReactNode;
  isConnected: boolean;
  onConnect: () => void;
};

export default function ResourceCard({
  label,
  description,
  icon,
  isConnected,
  onConnect,
}: ResourceCardProps) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 shadow-lg shadow-black/40 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-2xl">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-50">{label}</span>
          <span className="text-xs text-slate-400">{description}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        {isConnected ? (
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            <span>Connected</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">
            Connect to unlock SoundOwl features for this service.
          </span>
        )}
        <Button
          size="sm"
          variant={isConnected ? 'outline' : 'solid'}
          colorScheme={isConnected ? 'gray' : 'blue'}
          onClick={onConnect}
          disabled={isConnected}
        >
          {isConnected ? 'Connected' : 'Connect'}
        </Button>
      </div>
    </div>
  );
}

