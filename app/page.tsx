import { getUserAccount } from '@/app/utils';
import { verifyUser } from '@/lib/dal';
import LandingPage from '@/components/Home/LandingPage';
import { redirect } from 'next/navigation';

/* When to go to getting-started
- User is authenticated through Auth0 but has no account registered in mongo
- User is authenticated and has an account but has not registered with any streaming services
*/

export default async function Home() {
  const account = await getUserAccount((await verifyUser())?.email ?? '');
  if (account) {
    redirect('/dashboard');
  } else {
    return <LandingPage />;
  }
}
