'use client';
import { useEffect, useState } from 'react';
import { Box, Button, SkeletonCircle } from '@chakra-ui/react';
import type { SpotifyProfile } from '@/types/spotify';
import { useRouter } from 'next/navigation';
import ProfileMenu from './ProfileMenu';

export const Navbar = () => {
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const router = useRouter();

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
      // await fetch('/api/spotify/logout', { method: 'POST' });
      setProfile(null);
      window.location.href = '/auth/logout';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <Box
      as="nav"
      className="px-6 h-16 py-4 w-full flex items-center justify-between bg-slate-900/80 border-b border-slate-700/50 backdrop-blur-sm text-slate-100"
    >
      <p className="text-xl font-bold tracking-tight">SoundOwl</p>

      {/* Navigation Buttons */}
      <div className="max-sm:hidden">
        {/* <Button
          className="font-semibold"
          variant="ghost"
          onClick={() => router.push('/dashboard')}
        >
          Home
        </Button> */}

        {/* TODO : WIP Pages */}
        <Button
          className="font-semibold"
          variant="ghost"
          onClick={() => router.push('/dashboard')}
        >
          Spotify
        </Button>
        <Button
          className="font-semibold"
          variant="ghost"
          onClick={() => router.push('/soundcloud')}
        >
          SoundCloud
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {profile && profile.images && profile.images.length > 0 ? (
          <ProfileMenu
            key={profile.images[0].url}
            profile={profile}
            onLogout={handleLogout}
          />
        ) : (
          <SkeletonCircle size="10" />
        )}
      </div>
    </Box>
  );
};

export default Navbar;
