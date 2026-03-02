'use client';
import { useState } from 'react';
import {
  NewReleasesContent,
  TopTracksContent,
  TopArtistsContent,
} from '@/components/Spotify';
import { Box, Button, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

interface SpotifyProfile {
  id: string;
  display_name: string;
  email: string;
  country: string;
  followers: {
    total: number;
  };
  images: Array<{
    url: string;
  }>;
  product: string;
  external_urls: {
    spotify: string;
  };
}

export default function HomeContent() {
  const { user } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const fetchProfile = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch('/api/spotify/profile');

  //     if (response.status === 401) {
  //       // Not authenticated
  //       setProfile(null);
  //       setError(null);
  //       setLoading(false);
  //       return;
  //     }

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Failed to fetch profile');
  //     }

  //     const data = await response.json();
  //     setProfile(data);
  //     setError(null);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'An error occurred');
  //     setProfile(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGetStarted = () => {
    router.push('/auth/login?returnTo=/getting-started');
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleLogout = () => {
    router.push('/auth/logout');
  };

  // Error screen
  if (error && !profile) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Box as="div" className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-center">Welcome</h1>
          <div className="action-card">
            <p className="action-text">{error}</p>
            <Button onClick={handleGetStarted} colorPalette="blue">
              Try Again
            </Button>
          </div>
        </Box>
      </div>
    );
  }

  // If profile is found, display user information (Dashboard)
  return (
    <Box className="app-container" bg={{ base: 'gray.100', _dark: 'gray.900' }}>
      <Box className="w-full max-w-[1080px] flex flex-col gap-4 justify-center items-center grow">
        <NewReleasesContent />
        <TopTracksContent />
        <TopArtistsContent />
      </Box>
    </Box>
  );
}
