import { Box } from '@chakra-ui/react';
import ProtectedPageLayout from '@/components/Auth/ProtectedPageLayout';

// TODO (AR): WIP, need to add the sidebar to the layout and fix rendering issues
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPageLayout>
      <div className="flex w-full">
        <Box className="w-full max-w-[1080px] flex flex-col gap-4 justify-center items-center grow">
          {children}
        </Box>
      </div>
    </ProtectedPageLayout>
  );
}
