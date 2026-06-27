'use client';

import { useAuth } from '../../providers/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Box, Center, Spinner, Text } from '@chakra-ui/react';

interface AuthGuardProps {
    children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(`/login?redirect=${pathname}`);
        }
    }, [isAuthenticated, isLoading, router, pathname]);

    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" color="brand.500" />
            </Center>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
