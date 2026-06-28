'use client';

import { Box, Flex, VStack, Button, Heading, HStack, Badge, Text, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, useDisclosure, IconButton } from '@chakra-ui/react';
import { LayoutDashboard, ShoppingBag, Package, Settings, Users, Menu, TicketCheckIcon } from 'lucide-react';
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
  { icon: TicketCheckIcon, label: 'Subscriptions', path: '/admin/subscriptions' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const SidebarContent = () => (
    <VStack align="stretch" spacing={2} pt={4}>
      {sidebarItems.map((item) => (
        <Button
          key={item.path}
          variant={pathname === item.path ? 'solid' : 'ghost'}
          justifyContent="flex-start"
          leftIcon={<item.icon size={18} />}
          onClick={() => { router.push(item.path); onClose(); }}
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
  );

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <Box minH="100vh" bg="surface.50">
        <Navbar />
        <Flex>
          {/* Desktop Sidebar */}
          <Box
            w={{ base: '0px', md: '220px' }}
            bg="white"
            minW={{ base: '0px', md: '220px' }}
            borderRight="1px solid"
            borderColor="surface.100"
            p={{ base: 0, md: 6 }}
            display={{ base: 'none', md: 'block' }}
            position="sticky"
            top="65px"
            h="calc(100vh - 150px)"
            overflowY="auto"
          >
            <SidebarContent />
          </Box>

          {/* Mobile Sidebar Drawer */}
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerBody pt={12}>
                <SidebarContent />
              </DrawerBody>
            </DrawerContent>
          </Drawer>

          {/* Main Content */}
          <Box flex={1} overflowX={'auto'} minH="calc(100vh - 80px)">
            <Flex align="center" justify="space-between" p={6} borderBottom="1px solid" borderColor="surface.100" bg="white">
              <HStack spacing={4}>
                <IconButton
                  display={{ base: 'flex', md: 'none' }}
                  aria-label="Open menu"
                  icon={<Menu size={20} />}
                  variant="ghost"
                  onClick={onOpen}
                  size="sm"
                />
                <Heading size="md" color="surface.900">Admin Dashboard</Heading>
              </HStack>
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
            <Box p={{ base: 4, md: 8 }}>
              {children}
            </Box>
          </Box>
        </Flex>
      </Box>
    </RoleGuard>
  );
}
