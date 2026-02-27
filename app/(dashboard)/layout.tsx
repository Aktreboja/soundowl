import { Box } from '@chakra-ui/react';
import ProtectedPageLayout from '@/components/Auth/ProtectedPageLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedPageLayout>
      <div className="flex w-full">
        <Box className="w-full flex flex-col gap-4 justify-center items-center grow"
        bg={{ base: 'gray.100', _dark: 'gray.900' }}
        >
          {children}
        </Box>
      </div>
    </ProtectedPageLayout>
  );
}
