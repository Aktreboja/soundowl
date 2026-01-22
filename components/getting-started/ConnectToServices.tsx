import {
  Button,
  CheckboxCard,
  CheckboxGroup,
  Float,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaSpotify, FaSoundcloud } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useGetSpotifyProfileQuery } from '@/lib/store/spotifyApi';
import { useUpdateAccountMutation } from '@/lib/store/accountApi';
import { User } from '@/types/User';

export default function ConnectToServices({ account }: { account: User }) {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const { data: profile, isLoading: isLoadingProfile } = useGetSpotifyProfileQuery();
  const [updateAccount] = useUpdateAccountMutation();
  const handleSpotifyConnect = () => {
    router.push('/api/spotify/auth');
  };

  useEffect(() => {
    if (isLoadingProfile) {
      return;
    }
    else if (profile) {
      setSelectedServices((prev) => [...prev, 'Spotify']);
    }
  }, [isLoadingProfile, profile])

  // On Finish, update the account and push to home page
  const handleFinish = async () => {
    const updatedAccount = {
      ...account,
      services: selectedServices,
      hasRegistered: true,
    }
    updateAccount(updatedAccount);

    // Push to home page
    router.push('/')
  }

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
    },
  ];
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
      <Button onClick={handleFinish} disabled={selectedServices.length === 0}>Finish</Button>
    </div>
  );
}
