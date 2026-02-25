import { getUserAccount } from '@/app/utils';
import HomeContent from '@/components/Home/HomeContent';
import { verifyUser } from '@/lib/dal';
import LandingPage from '@/components/Home/LandingPage';

/* When to go to getting-started
- User is authenticated through Auth0 but has no account registered in mongo
- User is authenticated and has an account but has not registered with any streaming services
*/

// TODO (AR): There is currently a flicker showing the landing page before the user is redirected to the getting-started page
export default async function Home() {
  const account = await getUserAccount((await verifyUser())?.email ?? '');
  if (account) {
    return <HomeContent />;
  } else {
    return <LandingPage />;
  }
}
