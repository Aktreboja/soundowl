import type { Metadata } from 'next';
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import { Provider as ChakraProvider } from '@/components/ui/provider';
import { StoreProvider } from '@/lib/store/StoreProvider';
import { AuthenticatedNavbar } from '@/components/Layout/AuthenticatedNavbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'SoundOwl',
  description: 'Next.js app with Auth0 authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
