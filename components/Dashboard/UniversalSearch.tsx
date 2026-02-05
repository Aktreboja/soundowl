'use client';

import {
  InputGroup,
  Input,
  Listbox,
  Stack,
  Text,
  createListCollection,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useGetSoundCloudSearchQuery } from '@/lib/store/soundcloudApi';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function UniversalSearch() {
  const [searchValue, setSearchValue] = useState('');
  const [focused, setFocused] = useState<boolean>(false);

  const debounced = useDebouncedCallback((value: string) => {
    setSearchValue(value);
    setFocused(true);
  }, 1000);

  const { data: searchResults } = useGetSoundCloudSearchQuery(
    { q: searchValue },
    { skip: !searchValue.trim() }
  );

  const tracks = searchResults ?? [];

  return (
    <div className="relative w-full">
      <InputGroup>
        <Input
          placeholder="Search for a track"
          onChange={(e) => {
            debounced(e.target.value);
          }}
        />
      </InputGroup>
      {searchValue.length > 0 && focused && (
        <Listbox.Root
          collection={createListCollection({ items: tracks })}
          className="absolute z-50 top-12"
        >
          <Listbox.Content>
            <Listbox.Label>Tracks found: ({tracks.length})</Listbox.Label>
            {tracks.map((track) => (
              <Listbox.Item
                item={track}
                key={track.id}
                className="flex flex-row items-center gap-2"
              >
                <div className="flex flex-row items-center gap-2">
                  <Image
                    src={track.artwork_url || ''}
                    alt={track.title}
                    height={40}
                    width={40}
                    quality={100}
                  />
                  <Stack gap="0">
                    <Text fontSize="sm" fontWeight="medium" whiteSpace="nowrap">
                      {track.title}
                    </Text>
                    <Text fontSize="xs">{track.user.username}</Text>
                  </Stack>
                </div>

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
