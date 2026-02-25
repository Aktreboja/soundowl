# SoundOwl

**A web app for music enthusiasts and discovery.**

### Mission

SoundOwl improves music discoverability by bringing multiple platforms into one place. Instead of jumping between apps, you can explore and manage music from **SoundCloud** and **Spotify** in a single experience.



## Installation and Setup

### Prerequisites

- **Node.js** 20+
- **Yarn** 4.x (project uses `yarn` as package manager)

### 1. Clone and install

```bash
git clone <repository-url>
cd soundowl
yarn install
```

### 2. Environment variables

Create a `.env.local` in the project root with the following, grouped by service:

**Auth0**

| Variable | Description |
|----------|-------------|
| `AUTH0_BASE_URL` | App URL (e.g. `http://localhost:3000` for local dev) |
| `AUTH0_SECRET` | Auth0 session secret |
| `AUTH0_ISSUER_BASE_URL` | Auth0 tenant URL |
| `AUTH0_CLIENT_ID` | Auth0 application client ID |
| `AUTH0_CLIENT_SECRET` | Auth0 application client secret |

**MongoDB**

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |

**Spotify**

| Variable | Description |
|----------|-------------|
| `SPOTIFY_CLIENT_ID` | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret |
| `SPOTIFY_REDIRECT_URI` | (Optional) Defaults to `{AUTH0_BASE_URL}/api/spotify/callback` |
| `SPOTIFY_API_SCOPES` | Spotify OAuth scopes (include `user-follow-read` for New Releases from followed artists) |

**Note:** Spotify scopes will vary based on the endpoints you will use for your use case. For the dashboard "New Releases" (from followed artists), include `user-follow-read`. List of the spotify scopes below.

<a href="https://developer.spotify.com/documentation/web-api/concepts/scopes" target="_blank" rel="noopener noreferrer">List of Spotify Scopes</a>


**SoundCloud**

| Variable | Description |
|----------|-------------|
| `SOUNDCLOUD_CLIENT_ID` | SoundCloud app client ID |
| `SOUNDCLOUD_CLIENT_SECRET` | SoundCloud app client secret |
| `SOUNDCLOUD_REDIRECT_URI` | (Optional) Defaults to `{AUTH0_BASE_URL}/api/soundcloud/callback` |

Create apps and get credentials from:

- <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer">Spotify Developer Dashboard</a>
- <a href="https://developers.soundcloud.com/" target="_blank" rel="noopener noreferrer">SoundCloud for Developers</a>
- <a href="https://auth0.com/" target="_blank" rel="noopener noreferrer">Auth0</a>
- <a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="noopener noreferrer">MongoDB Atlas</a> (or your MongoDB host)

### 3. Run the app

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Production build |
| `yarn start` | Run production server |
| `yarn lint` | Run ESLint |
| `yarn format` | Format with Prettier |

---

### Tech stack

| Category   | Technologies |
|-----------|--------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI        | Chakra UI, Tailwind CSS |
| Auth      | Auth0 |
| Data      | MongoDB |
| APIs      | Spotify API, SoundCloud API |
