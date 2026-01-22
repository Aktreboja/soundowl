import {
  Button,
  CheckboxCard,
  CheckboxGroup,
  Float,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaSpotify, FaSoundcloud } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useGetProfileQuery } from '@/lib/store/spotifyApi';

export default function ConnectToServices() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const { data: profile } = useGetProfileQuery();
  console.log(profile);

  const handleSpotifyConnect = () => {
    console.log('Spotify connect');
    router.push('/api/spotify/auth');
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
      <Button>Finish</Button>
    </div>
  );
}
