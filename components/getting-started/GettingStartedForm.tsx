'use client';
import { User } from '@auth0/nextjs-auth0/types';
import { Button, Field, Input, Stack } from '@chakra-ui/react';
import { Toaster } from '../ui/toaster';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { Tooltip } from '../ui/tooltip';
import type { PendingAccount } from './GettingStartedContent';

const formSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  name: z.string().min(1, { message: 'Name is required' }),
  username: z.string().min(1, { message: 'Username is required' }),
});

export default function GettingStartedForm({
  user,
  pendingAccount,
  onStep1Complete,
}: {
  user: User | undefined;
  pendingAccount: PendingAccount | null;
  onStep1Complete: (data: PendingAccount) => void;
}) {
  const { register, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: pendingAccount?.email ?? user?.email,
      name: pendingAccount?.name ?? user?.name,
      username: pendingAccount?.username ?? user?.nickname,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!user?.sub) return;
    onStep1Complete({
      email: data.email,
      name: data.name,
      username: data.username,
      userId: user.sub,
    });
  };

  return (
    <Stack direction="column" gap={6} className="w-full max-w-xl mx-auto">
      <Toaster />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-50">
            Create your SoundOwl profile
          </h2>
          <Tooltip content="This is the name that will be displayed on your profile and in the dashboard.">
            <Info className="h-4 w-4" />
          </Tooltip>
        </div>

        <p className="text-sm text-slate-400">
          Confirm your details so we know who to personalise your dashboard for.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input type="text" disabled {...register('email')} />
        </Field.Root>
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <Input type="text" {...register('name')} />
        </Field.Root>
        <Field.Root>
          <Field.Label>Username</Field.Label>
          <Input type="text" {...register('username')} />
        </Field.Root>
        <Button type="submit" colorScheme="blue">
          Continue
        </Button>
      </form>
    </Stack>
  );
}
