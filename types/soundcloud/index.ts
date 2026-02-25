export interface SoundCloudActivity {
  type: string;
  created_at: string;
  origin: SoundCloudTrack;
  tags?: string[];
}

export interface SoundCloudActivityResponse {
  collection: SoundCloudActivity[];
  total_count: number;
  next_href: string | null;
  [key: string]: unknown;
}

export interface SoundCloudTrack {
  id: number;
  kind: string;
  uri: string;
  permalink: string;
  permalink_url: string;
  created_at: string;
  title: string;
  description: string | null;
  duration: number;
  stream_url: string | null;
  streamable: boolean;
  waveform_url: string;
  bpm: number | null;
  genre: string | null;
  isrc: string | null;
  key_signature: string | null;
  tag_list: string;
  playback_count: number | null;
  favoritings_count: number | null;
  reposts_count: number | null;
  comment_count: number | null;
  download_count: number | null;
  downloadable: boolean;
  download_url: string | null;
  purchase_url: string | null;
  purchase_title: string | null;
  license: string;
  sharing: string;
  available_country_codes: string[] | null;
  user: {
    id: number;
    permalink: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    [key: string]: unknown;
  };
  artwork_url: string | null;
  user_favorite: boolean | null;
  user_playback_count: number | null;
  commentable: boolean;
  release: string | null;
  release_day: number | null;
  release_month: number | null;
  release_year: number | null;
  label_name: string | null;
  secret_uri: string | null;
  is_explicit: boolean | null;
}

export interface SoundCloudProfile {
  id: number;
  permalink: string;
  username: string;
  full_name: string;
  description: string | null;
  city: string | null;
  country: string | null;
  avatar_url: string | null;
  followers_count: number;
  followings_count: number;
  public_favorites_count: number;
  track_count: number;
  playlist_count: number;
  plan: string;
  website: string | null;
  website_title: string | null;
  online: boolean;
  verified: boolean;
  kind: string;
  uri: string;
  permalink_url: string;
  avatar_url_template: string | null;
}
