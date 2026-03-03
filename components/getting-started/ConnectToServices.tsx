'use client';
import { Button } from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { FaSpotify, FaSoundcloud } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetSpotifyProfileQuery } from '@/lib/store/spotifyApi';
import { toaster, Toaster } from '../ui/toaster';
import ResourceCard from './ResourceCard';
import type { PendingAccount } from './GettingStartedContent';

type ConnectToServicesProps = {
  profile: PendingAccount;
  onGoBack?: () => void;
};

export default function ConnectToServices({
  profile,
  onGoBack,
}: ConnectToServicesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Profile query may be used in the future for displaying connected status
  useGetSpotifyProfileQuery();

  const handleSpotifyConnect = () => {
    router.push('/api/spotify/auth');
  };

  const handleSoundCloudConnect = () => {
    router.push('/api/soundcloud/auth');
  };

  const items = [
    {
      label: 'Spotify',
      description:
        'Connect your Spotify account to sync playlists and activity.',
      icon: <FaSpotify className="h-5 w-5 text-[#1DB954]" />,
      onConnect: handleSpotifyConnect,
    },
    {
      label: 'SoundCloud',
      description:
        'Connect your SoundCloud account to sync tracks and likes.',
      icon: <FaSoundcloud className="h-5 w-5 text-[#FF5500]" />,
      onConnect: handleSoundCloudConnect,
    },
  ];

  // On Finish, single DB insert with full payload then redirect
  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          services: selectedServices,
          hasRegistered: true,
        }),
      });
      if (response.ok) {
        router.push('/dashboard');
      } else {
        const error = await response.json();
        toaster.create({
          title: 'Registration failed',
          description: error.error ?? 'Please try again.',
          type: 'error',
        });
      }
    } catch {
      toaster.create({
        title: 'Registration failed',
        description: 'An error occurred. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSoundCloudIfMissing = useCallback(() => {
    setSelectedServices((prev) =>
      prev.includes('SoundCloud') ? prev : [...prev, 'SoundCloud']
    );
  }, []);

  const addSpotifyIfMissing = useCallback(() => {
    setSelectedServices((prev) =>
      prev.includes('Spotify') ? prev : [...prev, 'Spotify']
    );
  }, []);

  // After OAuth redirect: callback sends ?soundcloud=connected (cookie is httpOnly so client can't read it)
  useEffect(() => {
    if (searchParams.get('soundcloud') === 'connected') {
      addSoundCloudIfMissing();
      router.replace('/getting-started', { scroll: false });
    } else if (searchParams.get('spotify') === 'connected') {
      addSpotifyIfMissing();
      router.replace('/getting-started', { scroll: false });
    }
  }, [searchParams, router, addSoundCloudIfMissing, addSpotifyIfMissing]);

  // Initial load / refresh: ask server if SoundCloud is connected (server can read httpOnly cookie)
  useEffect(() => {
    fetch('/api/soundcloud/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) addSoundCloudIfMissing();
      })
      .catch(() => {});

    fetch('/api/spotify/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) addSpotifyIfMissing();
      })
      .catch(() => {});
  }, [addSoundCloudIfMissing, addSpotifyIfMissing]);
  return (
    <div className="flex w-full flex-col gap-6">
      <Toaster />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-50">
          Connect your music services
        </h2>
        <p className="text-sm text-slate-400">
          Link the accounts you use so SoundOwl can pull in playlists, likes,
          and listening stats.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <ResourceCard
            key={item.label}
            label={item.label}
            description={item.description}
            icon={item.icon}
            isConnected={selectedServices.includes(item.label)}
            onConnect={item.onConnect}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {onGoBack && (
            <Button variant="ghost" onClick={onGoBack}>
              Go back
            </Button>
          )}
        </div>
        <Button
          colorScheme="blue"
          onClick={handleFinish}
          disabled={selectedServices.length === 0 || isSubmitting}
          loading={isSubmitting}
        >
          Finish
        </Button>
      </div>
    </div>
  );
}
