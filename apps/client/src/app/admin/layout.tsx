'use client';

import { Box, Flex, VStack, Button, Heading, HStack, Badge, Text } from '@chakra-ui/react';
import { LayoutDashboard, ShoppingBag, Package, Settings, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { RoleGuard } from '../../components/guards/RoleGuard';
import { Navbar } from '../../components/Navbar';
import { useAuth } from '../../providers/AuthContext';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <Box minH="100vh" bg="surface.50">
        <Navbar />
        <Flex>
          {/* Sidebar */}
          <Box
            w={{ base: '0px', md: '220px' }}
            bg="white"
            borderRight="1px solid"
            borderColor="surface.100"
            p={6}
            display={{ base: 'none', md: 'block' }}
            position="sticky"
            top="80px"
            h="calc(100vh - 80px)"
            overflowY="auto"
          >
            <VStack align="stretch" spacing={2}>
              {sidebarItems.map((item) => (
                <Button
                  key={item.path}
                  variant={pathname === item.path ? 'solid' : 'ghost'}
                  justifyContent="flex-start"
                  leftIcon={<item.icon size={18} />}
                  onClick={() => router.push(item.path)}
                  size="sm"
                  borderRadius="8px"
                  fontSize="14px"
                  bg={pathname === item.path ? 'brand.500' : 'transparent'}
                  color={pathname === item.path ? 'white' : 'surface.700'}
                  _hover={{ bg: pathname === item.path ? 'brand.600' : 'surface.100' }}
                >
                  {item.label}
                </Button>
              ))}
            </VStack>
          </Box>

          {/* Main Content */}
          <Box flex={1} minH="calc(100vh - 80px)">
            <Flex align="center" justify="space-between" p={6} borderBottom="1px solid" borderColor="surface.100" bg="white">
              <Heading size="md" color="surface.900">Admin Dashboard</Heading>
              <HStack spacing={4}>
                <HStack spacing={2}>
                  <Badge
                    bg="brand.50"
                    color="brand.700"
                    borderRadius="full"
                    px={3} py={1}
                    fontSize="11px"
                    fontWeight="600"
                  >
                    Admin
                  </Badge>
                  <Text fontSize="13px" color="surface.600" display={{ base: 'none', md: 'block' }}>
                    {user?.email}
                  </Text>
                </HStack>
              </HStack>
            </Flex>

            {/* Page Content */}
            <Box p={8}>
              {children}
            </Box>
          </Box>
        </Flex>
      </Box>
    </RoleGuard>
  );
}
