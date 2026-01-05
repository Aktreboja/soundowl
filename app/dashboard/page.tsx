'use client';
import Navbar from '@/components/Layout/Navbar';
import ProfileCard from '@/components/Dashboard/ProfileCard';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TopTracksContent from '@/components/Dashboard/TopTracksContent';
import TopArtistsContent from '@/components/Dashboard/TopArtistsContent';

interface SpotifyProfile {
  id: string;
  display_name: string;
  email: string;
  country: string;
  followers: {
    total: number;
  };
  images: Array<{
    url: string;
  }>;
  product: string;
  external_urls: {
    spotify: string;
  };
}

export default function Dashboard() {
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for error in URL params
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(`Authentication error: ${errorParam}`);
      setLoading(false);
      return;
    }

    // Check if user is authenticated with Spotify
    fetchProfile();
  }, [searchParams]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/spotify/profile');

      if (response.status === 401) {
        // Not authenticated
        setProfile(null);
        setError(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    window.location.href = '/api/spotify/auth';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/spotify/logout', { method: 'POST' });
      setProfile(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-state">
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="app-container">
        <div className="main-card-wrapper">
          <h1 className="main-title">Welcome</h1>
          <div className="action-card">
            <p className="action-text">{error}</p>
            <button onClick={handleGetStarted} className="button login">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If profile is found, display user information
  if (profile) {
    return (
      <div className="app-container">
        <div className="w-4/5">
          <h1 className="main-title">Welcome back, {profile.display_name}</h1>
          <div className="logged-in-section">
            <ProfileCard {...profile} />
            <TopTracksContent />
            <TopArtistsContent />
            <button onClick={handleLogout} className="button logout">
              Disconnect Spotify
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-card-wrapper">
        <h1 className="main-title">Welcome</h1>
        <div className="action-card">
          <p className="action-text">
            Click on the button below to get started
          </p>
          <button onClick={handleGetStarted} className="button login">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
