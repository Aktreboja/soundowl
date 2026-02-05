'use client';

import {
  Image,
  InputGroup,
  Input,
  Listbox,
  Stack,
  Text,
  createListCollection,
} from '@chakra-ui/react';
import { useGetSoundCloudSearchQuery } from '@/lib/store/soundcloudApi';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { SoundCloudTrack } from '@/types/soundcloud';

export default function UniversalSearch() {
  const [searchValue, setSearchValue] = useState('');

  const debounced = useDebouncedCallback((value: string) => {
    setSearchValue(value);
  }, 1000);

  const { data: searchResults } = useGetSoundCloudSearchQuery(
    { q: searchValue },
    { skip: !searchValue.trim() }
  );

  const tracks = searchResults ?? [];

  console.log('SEARCH RESULTS: ', searchResults);

  return (
    <div className="relative w-full">
      <InputGroup>
        <Input
          onChange={(e) => {
            debounced(e.target.value);
          }}
        />
      </InputGroup>
      {searchValue.length > 0 && (
        <Listbox.Root
          collection={createListCollection({ items: tracks })}
          className="absolute z-50"
        >
          <Listbox.Label>Select Album</Listbox.Label>
          <Listbox.Content>
            {tracks.map((track) => (
              <Listbox.Item
                item={track}
                key={track.id}
                flexDirection="column"
                alignItems="flex-start"
                gap="2"
                position="relative"
              >
                <Image
                  src={track.artwork_url || ''}
                  alt={track.title}
                  bg="bg.subtle"
                  objectFit="cover"
                  aspectRatio="1"
                  borderRadius="l2"
                  flexShrink="0"
                  height="150px"
                  minWidth="150px"
                />
                <Stack gap="0">
                  <Text fontSize="sm" fontWeight="medium" whiteSpace="nowrap">
                    {track.title}
                  </Text>
                  <Text fontSize="xs">{track.user.username}</Text>
                </Stack>
                <Listbox.ItemIndicator
                  position="absolute"
                  top="4"
                  right="4"
                  layerStyle="fill.solid"
                  borderWidth="2px"
                  borderColor="fg.inverted"
                />
              </Listbox.Item>
            ))}
          </Listbox.Content>
        </Listbox.Root>
      )}
    </div>
  );
}
