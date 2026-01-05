import Image from 'next/image';
import type { SpotifyProfile } from '@/types';

// TODO (AR): Refactor
export const ProfileCard = (profile: SpotifyProfile) => {
  return (
    <div className="card bg-gray-700 w-full flex  justify-center">
      <div className="flex flex-col">
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
        <h2 className="profile-name">{profile.display_name || 'No name'}</h2>
        {profile.email && <p className="profile-email">{profile.email}</p>}
      </div>

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
  );
};

export default ProfileCard;
