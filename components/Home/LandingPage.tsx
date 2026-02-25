"use client"
import { Box, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

function LandingPage() {
  const router = useRouter();
  const handleGetStarted = () => {
    router.push('/auth/login?returnTo=/getting-started');
  };
  return (
    <Box>
      <div className="flex flex-col items-center justify-center w-full min-h-screen ">
        <h1 className="text-2xl font-bold text-center">Welcome to SoundOwl</h1>
        <div className="flex flex-col items-center justify-center gap-4">
          <p>Click on the button below to get started</p>
          <Button variant="solid" colorScheme="blue" onClick={handleGetStarted}>
            Get Started
          </Button>
        </div>
      </div>
    </Box>
  );
}

export default LandingPage;
