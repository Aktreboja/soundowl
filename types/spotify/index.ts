export interface SpotifyProfile {
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

// Common primitives
export type SpotifyID = string;
export type SpotifyURI = string;
export type ISODateString = string;
export type MarketCode = string;

// External URLs
export interface ExternalUrls {
  spotify: string;
}

// Image object
export interface SpotifyImage {
  height: number;
  width: number;
  url: string;
}

// Artist
export interface SpotifyArtist {
  images: SpotifyImage[];
  external_urls: ExternalUrls;
  href: string;
  id: SpotifyID;
  name: string;
  type: 'artist';
  uri: SpotifyURI;
}

// Album
export interface SpotifyAlbum {
  album_type: 'album' | 'single' | 'compilation';
  artists: SpotifyArtist[];
  available_markets: MarketCode[];
  external_urls: ExternalUrls;
  href: string;
  id: SpotifyID;
  images: SpotifyImage[];
  is_playable: boolean;
  name: string;
  release_date: ISODateString;
  release_date_precision: 'year' | 'month' | 'day';
  total_tracks: number;
  type: 'album';
  uri: SpotifyURI;
}

// External IDs
export interface ExternalIds {
  isrc: string;
}

// Track
export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: MarketCode[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: SpotifyID;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: 'track';
  uri: SpotifyURI;
}
