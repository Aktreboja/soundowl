'use client';
import { User } from '@auth0/nextjs-auth0/types';
import { Button, Field, Input, Stack } from '@chakra-ui/react';
import { toaster, Toaster } from '../ui/toaster';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  name: z.string().min(1, { message: 'Name is required' }),
  username: z.string().min(1, { message: 'Username is required' }),
});

export default function GettingStartedForm({
  user,
}: {
  user: User | undefined;
}) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: user?.email,
      name: user?.name,
      username: user?.nickname,
    },
    resolver: zodResolver(formSchema),
  });

  const handleRegistration = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toaster.create({
          title: 'Registration Successful',
          description: 'You have been registered successfully',
          type: 'success',
        });
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        toaster.create({
          title: 'Registration Failed',
          description: 'An error occurred while registering',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toaster.create({
        title: 'Registration Failed',
        description: 'An error occurred while registering',
        type: 'error',
      });
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) =>
    handleRegistration(data);

  return (
    <Stack
      direction="column"
      gap={4}
      className="w-1/2 mx-auto max-sm:w-full max-sm:px-4"
    >
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <Button type="submit">Confirm</Button>
      </form>
    </Stack>
  );
}
