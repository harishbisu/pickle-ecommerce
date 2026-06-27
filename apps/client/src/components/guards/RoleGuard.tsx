'use client';

import { useAuth } from '../../providers/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Center, Spinner, useToast } from '@chakra-ui/react';

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: ('USER' | 'ADMIN')[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (!allowedRoles.includes(user?.role as any)) {
                toast({
                    title: 'Access Denied',
                    description: 'You do not have permission to view this page.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                router.push('/');
            }
        }
    }, [isAuthenticated, isLoading, user, allowedRoles, router, toast]);

    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" color="brand.500" />
            </Center>
        );
    }

    if (!isAuthenticated || !allowedRoles.includes(user?.role as any)) {
        return null;
    }

    return <>{children}</>;
}
