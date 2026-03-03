import type { Metadata } from 'next';
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import { Provider as ChakraProvider } from '@/components/ui/provider';
import { StoreProvider } from '@/lib/store/StoreProvider';
import './globals.css';
import { Suspense } from 'react';
import { Spinner } from '@chakra-ui/react';
import { CookiesNextProvider } from 'cookies-next';
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <ChakraProvider>
            <Auth0Provider>
              <CookiesNextProvider>
                <Suspense fallback={<Spinner size="lg" />}>
                  <div className="relative min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
                    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.35),transparent_55%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.2),transparent_55%)]" aria-hidden />
                    <div className="relative z-10 flex min-h-screen">{children}</div>
                  </div>
                </Suspense>
              </CookiesNextProvider>
            </Auth0Provider>
          </ChakraProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
