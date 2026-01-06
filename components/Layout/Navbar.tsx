'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box, Button, Dialog, Portal, CloseButton } from '@chakra-ui/react';
import type { SpotifyProfile } from '@/types';
import { ColorModeButton } from '../ui/color-mode';

export const Navbar = () => {
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/spotify/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/spotify/logout', { method: 'POST' });
      setProfile(null);
      setIsOpen(false);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <Box
      as="nav"
      bg={{ base: 'white', _dark: 'gray.800' }}
      _dark={{ borderColor: 'gray.700' }}
      className="px-6 py-4 border-b border-gray-200 w-full flex items-center justify-between"
    >
      <p className="text-2xl font-bold tracking-tight">SoundOwl</p>

      <div className="flex items-center gap-4">
        <ColorModeButton />
        {profile && profile.images && profile.images.length > 0 && (
          <Dialog.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
            <Dialog.Trigger asChild>
              <button className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-transparent group-hover:ring-emerald-500 transition-all duration-200">
                  <Image
                    src={profile.images[0].url}
                    alt={profile.display_name || 'Profile'}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
              </button>
            </Dialog.Trigger>

            <Portal>
              <Dialog.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
              <Dialog.Positioner className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Content
                  bg={{ base: 'white', _dark: 'gray.900' }}
                  className="rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                >
                  {/* Header with profile image */}
                  <div className="relative bg-linear-to-br from-emerald-500 to-teal-600 p-6 pb-16">
                    <Dialog.CloseTrigger asChild>
                      <CloseButton
                        size="sm"
                        className="absolute top-3 right-3 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
                      />
                    </Dialog.CloseTrigger>
                  </div>

                  {/* Profile image overlapping header */}
                  <div className="relative -mt-12 flex justify-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-900 shadow-lg">
                      <Image
                        src={profile.images[0].url}
                        alt={profile.display_name || 'Profile'}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Profile info */}
                  <Box className="px-6 pt-4 pb-6 text-center">
                    <Dialog.Title
                      className="text-xl font-bold"
                      color={{ base: 'gray.900', _dark: 'white' }}
                    >
                      {profile.display_name || 'Spotify User'}
                    </Dialog.Title>

                    {profile.email && (
                      <Box
                        as="p"
                        className="text-sm mt-1"
                        color={{ base: 'gray.600', _dark: 'gray.400' }}
                      >
                        {profile.email}
                      </Box>
                    )}

                    {/* Metadata grid */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <Box
                          as="p"
                          className="text-lg font-semibold"
                          color={{ base: 'gray.900', _dark: 'white' }}
                        >
                          {profile.followers?.total?.toLocaleString() || 0}
                        </Box>
                        <Box
                          as="p"
                          className="text-xs uppercase tracking-wide"
                          color={{ base: 'gray.500', _dark: 'gray.400' }}
                        >
                          Followers
                        </Box>
                      </div>
                      <div className="text-center">
                        <Box
                          as="p"
                          className="text-lg font-semibold"
                          color={{ base: 'gray.900', _dark: 'white' }}
                        >
                          {profile.country || 'N/A'}
                        </Box>
                        <Box
                          as="p"
                          className="text-xs uppercase tracking-wide"
                          color={{ base: 'gray.500', _dark: 'gray.400' }}
                        >
                          Country
                        </Box>
                      </div>
                      <div className="text-center">
                        <Box
                          as="p"
                          className="text-lg font-semibold capitalize"
                          color={{ base: 'gray.900', _dark: 'white' }}
                        >
                          {profile.product || 'N/A'}
                        </Box>
                        <Box
                          as="p"
                          className="text-xs uppercase tracking-wide"
                          color={{ base: 'gray.500', _dark: 'gray.400' }}
                        >
                          Plan
                        </Box>
                      </div>
                    </div>

                    {/* Spotify link */}
                    {profile.external_urls?.spotify && (
                      <a
                        href={profile.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-5 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                        View on Spotify
                      </a>
                    )}

                    {/* Logout button */}
                    <Box
                      className="mt-6 pt-6"
                      borderTopWidth="1px"
                      borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
                    >
                      <Button
                        onClick={handleLogout}
                        colorPalette="red"
                        className="w-full"
                      >
                        Log out
                      </Button>
                    </Box>
                  </Box>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        )}
      </div>
    </Box>
  );
};

export default Navbar;
