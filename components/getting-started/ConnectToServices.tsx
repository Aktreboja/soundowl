'use client';
import {
  Button,
  CheckboxCard,
  CheckboxGroup,
  Float,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { FaSpotify, FaSoundcloud } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetSpotifyProfileQuery } from '@/lib/store/spotifyApi';
import { useUpdateAccountMutation } from '@/lib/store/accountApi';
import { User } from '@/types/User';

export default function ConnectToServices({ account }: { account: User }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  // Profile query may be used in the future for displaying connected status
  useGetSpotifyProfileQuery();
  const [updateAccount] = useUpdateAccountMutation();

  const handleSpotifyConnect = () => {
    router.push('/api/spotify/auth');
  };

  const handleSoundCloudConnect = () => {
    router.push('/api/soundcloud/auth');
  };

  // On Finish, update the account and push to home page
  const handleFinish = async () => {
    const updatedAccount = {
      ...account,
      services: selectedServices,
      hasRegistered: true,
    };
    updateAccount(updatedAccount);

    // Push to home page
    router.push('/');
  };

  const handleLogout = () => {
    router.push('/auth/logout');
  };

  const items = [
    {
      label: 'Spotify',
      icon: <Icon as={FaSpotify} />,
      onClick: handleSpotifyConnect,
    },
    {
      label: 'SoundCloud',
      icon: <Icon as={FaSoundcloud} />,
      onClick: handleSoundCloudConnect,
    },
  ];

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
    <div className="flex flex-col items-center justify-center gap-4">
      <CheckboxGroup
        value={selectedServices}
        onValueChange={(value) => setSelectedServices(value)}
      >
        <SimpleGrid minChildWidth="300px" gap="2" className="h-full">
          {items.map((item) => (
            <CheckboxCard.Root
              defaultChecked={selectedServices.includes(item.label)}
              checked={selectedServices.includes(item.label)}
              disabled={selectedServices.includes(item.label)}
              variant={'subtle'}
              align="center"
              onClick={item.onClick}
              key={item.label}
              className="cursor-pointer"
            >
              <CheckboxCard.HiddenInput />
              <CheckboxCard.Control>
                <CheckboxCard.Content>
                  <Icon fontSize="2xl" mb="2">
                    {item.icon}
                  </Icon>
                  <CheckboxCard.Label>{item.label}</CheckboxCard.Label>
                </CheckboxCard.Content>
                <Float placement="top-end" offset="6">
                  <CheckboxCard.Indicator />
                </Float>
              </CheckboxCard.Control>
            </CheckboxCard.Root>
          ))}
        </SimpleGrid>
      </CheckboxGroup>
      <Button onClick={handleFinish}>Finish</Button>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
