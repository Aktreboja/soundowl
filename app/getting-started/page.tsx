import ProtectedPageLayout from '../../components/Auth/ProtectedPageLayout';
import { auth0 } from '../../lib/auth0';
import GettingStartedContent from '@/components/getting-started/GettingStartedContent';

export default async function GettingStarted() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <ProtectedPageLayout>
      <div className=" mx-auto min-h-screen flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold text-center">Getting Started</h1>
        <GettingStartedContent user={user} />
      </div>
    </ProtectedPageLayout>
  );
}
