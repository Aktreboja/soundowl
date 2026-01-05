import { Navbar } from '@/components/Layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <Navbar />
      {children}
    </div>
  );
}
