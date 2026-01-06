import type { Metadata } from 'next';
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import { Provider as ChakraProvider } from '@/components/ui/provider';
import { StoreProvider } from '@/lib/store/StoreProvider';
import { AuthenticatedNavbar } from '@/components/Layout/AuthenticatedNavbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'SoundOwl',
  description: 'Spotify Web Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <ChakraProvider>
            <Auth0Provider>
              <AuthenticatedNavbar />
              {children}
            </Auth0Provider>
          </ChakraProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
