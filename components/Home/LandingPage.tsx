'use client';

import Link from 'next/link';
import { Box, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { Music2, ArrowRight, ChevronDown } from 'lucide-react';
import { LandingBackground } from './LandingBackground';
import Footer from './Footer';

function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/login?returnTo=/getting-started');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const scrollToHowItWorks = () => {
    document
      .getElementById('how-it-works')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box className="relative w-full min-h-screen flex flex-col">
      <LandingBackground />

      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between w-full px-6 py-4 bg-slate-900/80 border-b border-slate-700/50 backdrop-blur-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-100 font-semibold"
        >
          <Music2 className="h-6 w-6 text-indigo-400" aria-hidden />
          <span>SoundOwl</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            colorPalette="gray"
            size="sm"
            onClick={handleLogin}
            className="text-slate-300 hover:text-slate-100"
          >
            Log in
          </Button>
          <Button
            variant="solid"
            colorPalette="indigo"
            size="sm"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center w-full min-h-[calc(100vh-4rem)] px-6 text-center">
        <p className="text-sm font-medium text-indigo-300/90 uppercase tracking-wider mb-4 animate-fadeIn">
          Your music, one place
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 max-w-2xl mb-4 animate-fadeIn">
          One place for your music
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mb-8 animate-fadeIn">
          Connect your streaming services and see your listening in one simple
          dashboard.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn">
          <Button
            variant="solid"
            colorPalette="indigo"
            size="lg"
            onClick={handleGetStarted}
            className="gap-2"
          >
            Get Started
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <Button
            variant="outline"
            colorPalette="gray"
            size="lg"
            onClick={scrollToHowItWorks}
            className="border-slate-600 text-slate-300 hover:bg-slate-800/80 hover:text-slate-100"
          >
            See how it works
          </Button>
        </div>
        {/* Scroll cue */}
        <button
          type="button"
          onClick={scrollToHowItWorks}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 hover:text-slate-400 transition-colors"
          aria-label="Scroll to how it works"
        >
          <span className="text-xs">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
        </button>
      </section>

      {/* How it works — scroll target */}
      <section
        id="how-it-works"
        className="relative z-10 w-full px-6 py-24 scroll-mt-16"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-100 text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Connect',
                description:
                  'Link your Spotify and SoundCloud accounts in one click.',
              },
              {
                step: '2',
                title: 'See your music',
                description:
                  'Your library and listening history in a single view.',
              },
              {
                step: '3',
                title: 'One dashboard',
                description: 'Manage and explore everything from one place.',
              },
            ].map(({ step, title, description }) => (
              <div
                key={step}
                className="p-6 rounded-xl bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm text-center"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-lg mb-4">
                  {step}
                </span>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </Box>
  );
}

export default LandingPage;
