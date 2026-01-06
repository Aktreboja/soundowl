import type { Metadata } from 'next';
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import { Provider as ChakraProvider } from '@/components/ui/provider';
import { Navbar } from '@/components/Layout/Navbar';
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
        <ChakraProvider>
          <Auth0Provider>
            <Navbar />
            {children}
          </Auth0Provider>
        </ChakraProvider>
      </body>
    </html>
  );
}
