import { Box } from '@chakra-ui/react';
import {
  NewReleasesContent,
  TopTracksContent,
  TopArtistsContent,
} from '@/components/Spotify';

export default function Dashboard() {
  <Box className="app-container" bg={{ base: 'gray.100', _dark: 'gray.900' }}>
    <Box className="w-full max-w-[1080px] flex flex-col gap-4 justify-center items-center grow">
      <NewReleasesContent />
      <TopTracksContent />
      <TopArtistsContent />
    </Box>
  </Box>;
}
