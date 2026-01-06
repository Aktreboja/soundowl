'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TopTracksContent from '@/components/Dashboard/TopTracksContent';
import TopArtistsContent from '@/components/Dashboard/TopArtistsContent';
import { ColorModeButton } from '@/components/ui/color-mode';
import { Box, Card, Button } from '@chakra-ui/react';

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

export default function Dashboard() {
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for error in URL params
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(`Authentication error: ${errorParam}`);
      setLoading(false);
      return;
    }

    // Check if user is authenticated with Spotify
    fetchProfile();
  }, [searchParams]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/spotify/profile');

      if (response.status === 401) {
        // Not authenticated
        setProfile(null);
        setError(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    window.location.href = '/api/spotify/auth';
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-state">
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="app-container">
        <div className="main-card-wrapper">
          <h1 className="main-title">Welcome</h1>
          <div className="action-card">
            <p className="action-text">{error}</p>
            <button onClick={handleGetStarted} className="button login">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If profile is found, display user information
  if (profile) {
    return (
      <Box className="app-container" bg={{ base: 'white', _dark: 'gray.900' }}>
        <div className="w-4/5 max-lg:w-full">
          <h1 className="text-2xl font-bold text-center my-4">
            Welcome back, {profile.display_name}
          </h1>
          <div className="logged-in-section">
            <div className="flex gap-4 max-lg:flex-col">
              <TopTracksContent />
              <TopArtistsContent />
            </div>
          </div>
        </div>
      </Box>
    );
  }

  return (
    <Box className="app-container" bg={{ base: 'white', _dark: 'gray.800' }}>
      <div className="flex-flex-col items-center justify-center ">
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
