import { Box } from '@chakra-ui/react';
import ProtectedPageLayout from '@/components/Auth/ProtectedPageLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPageLayout>
      <div className="flex w-full min-h-screen">
        <Box className="w-full flex flex-col gap-4 justify-center items-center grow">
          {children}
        </Box>
      </div>
    </ProtectedPageLayout>
  );
}
