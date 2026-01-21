"use client";
import { User } from "@auth0/nextjs-auth0/types";
import { Button, Field, Input, Stack } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";

export default function GettingStartedForm({ user }: { user: User | undefined}) {


    const handleRegistration = async () => {
        try {
            const response = await fetch('/api/registration', {
                method: 'POST',
                body: JSON.stringify({ email: user?.email, name: user?.name, username: user?.nickname }),
            });
        }
        catch (error) {
            console.error('Registration error:', error);
            toaster.create({
                title: 'Registration Failed',
                description: 'An error occurred while registering',
                type: 'error',
            })
        }
    }
    return (        
    <Stack direction="column" gap={4} className = "w-1/2 mx-auto max-sm:w-full max-sm:px-4">
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input type="text" value={user?.email} disabled/>
        </Field.Root>
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <Input type="text" value={user?.name || ''} />
        </Field.Root>
        <Field.Root>
          <Field.Label>Username</Field.Label>
          <Input type="text" value={user?.nickname || ''} />
        </Field.Root>
        <Button onClick={handleRegistration}>Confirm</Button>
    </Stack>)
}