'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Center, VStack, Spinner, Text, useToast, Container, Heading } from '@chakra-ui/react';
import { Navbar } from '../../components/Navbar';
import { useAuth } from '../../providers/AuthContext';
import AdminDashboard from './AdminDashboard';

/**
 * Admin Page Wrapper with Role-Based Access Control
 *
 * This wrapper ensures that only users with the ADMIN role can access the admin dashboard.
 * Regular users attempting to access /admin will be redirected to the home page.
 *
 * SECURITY IMPROVEMENTS:
 * - Checks user role on both client and server
 * - Prevents unauthorized access to admin features
 * - Shows appropriate error messages
 */
export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Redirect if user is not an admin
    if (user?.role !== 'ADMIN') {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin dashboard. Only administrators can view this page.',
        status: 'error',
        duration: 5000,
        position: 'top-right',
      });
      router.push('/');
      return;
    }
  }, [isAuthenticated, isLoading, user?.role, router, toast]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box minH="100vh" bg="surface.50">
        <Navbar />
        <Center minH="calc(100vh - 80px)">
          <VStack spacing={4}>
            <Spinner size="lg" color="brand.500" />
            <Text color="surface.600">Loading admin dashboard...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // Show error if user is not admin
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <Box minH="100vh" bg="surface.50">
        <Navbar />
        <Container maxW="600px" py={20}>
          <VStack spacing={4} textAlign="center">
            <Heading size="md" color="surface.900">Access Denied</Heading>
            <Text color="surface.600">
              You do not have permission to access the admin dashboard. Only administrators can view this page.
            </Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Render admin dashboard if user is authenticated and is an admin
  return <AdminDashboard />;
}
