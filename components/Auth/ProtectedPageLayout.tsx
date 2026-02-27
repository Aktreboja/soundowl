import { auth0 } from '../../lib/auth0';
import { redirect } from 'next/navigation';
import { AuthenticatedNavbar } from '../Layout/AuthenticatedNavbar';

// Layout component for protected pages
export default async function ProtectedPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="flex flex-col w-full">
      <AuthenticatedNavbar />
      {children}
    </div>
  );
}
