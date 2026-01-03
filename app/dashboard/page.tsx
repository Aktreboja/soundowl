'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

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

  if (profile) {
    return (
      <div className="app-container">
        <div className="main-card-wrapper">
          <h1 className="main-title">Your Spotify Profile</h1>
          <div className="logged-in-section">
            <div className="profile-card action-card">
              {profile.images && profile.images.length > 0 && (
                <Image
                  src={profile.images[0].url}
                  alt={profile.display_name || 'Profile'}
                  width={110}
                  height={110}
                  className="profile-picture"
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
              <h2 className="profile-name">
                {profile.display_name || 'No name'}
              </h2>
              {profile.email && (
                <p className="profile-email">{profile.email}</p>
              )}
              <div
                style={{
                  marginTop: '1.5rem',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                <p style={{ color: '#a0aec0', marginBottom: '0.5rem' }}>
                  <strong>Country:</strong> {profile.country || 'N/A'}
                </p>
                <p style={{ color: '#a0aec0', marginBottom: '0.5rem' }}>
                  <strong>Followers:</strong>{' '}
                  {profile.followers?.total?.toLocaleString() || 0}
                </p>
                <p style={{ color: '#a0aec0', marginBottom: '0.5rem' }}>
                  <strong>Plan:</strong> {profile.product || 'N/A'}
                </p>
                {profile.external_urls?.spotify && (
                  <a
                    href={profile.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#63b3ed',
                      textDecoration: 'none',
                      display: 'inline-block',
                      marginTop: '1rem',
                    }}
                  >
                    View on Spotify →
                  </a>
                )}
              </div>
            </div>
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
