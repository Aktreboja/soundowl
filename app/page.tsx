import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { getUserAccount } from '@/app/utils';
import HomeContent from '@/components/Home/HomeContent';

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;

  // If user is authenticated, check their account registration status
  if (user?.email) {
    const account = await getUserAccount(user.email);

    // If account exists but hasRegistered is false, redirect to getting-started
    if ((account && !account.hasRegistered) || user) {
      redirect('/getting-started');
    }
  }

  // Render HomeContent (it will handle unauthenticated state, loading, errors, and dashboard)
  return <HomeContent />;
}
