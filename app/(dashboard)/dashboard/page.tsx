import { Box } from '@chakra-ui/react';
import {
  NewReleasesContent,
  TopTracksContent,
  TopArtistsContent,
} from '@/components/Spotify';

export default function Dashboard() {
  return (
    <Box className="app-container">
      <Box className="w-full max-w-[1080px] flex flex-col gap-4 justify-center items-center grow">
        <NewReleasesContent />
        <TopTracksContent />
        <TopArtistsContent />
      </Box>
    </Box>
  );
}
