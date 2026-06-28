export declare class UsersService {
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        googleId: string | null;
        role: string;
        name: string | null;
        address: string | null;
        state: string | null;
        phone: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        googleId: string | null;
        role: string;
        name: string | null;
        address: string | null;
        state: string | null;
        phone: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    create(email: string, passwordHash?: string, googleId?: string): Promise<{
        id: string;
        name: string | null;
        email: string;
        passwordHash: string | null;
        googleId: string | null;
        role: string;
        address: string | null;
        state: string | null;
        phone: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    updateProfile(id: string, data: {
        name?: string;
        address?: string;
        state?: string;
        phone?: string;
    }): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        googleId: string | null;
        role: string;
        name: string | null;
        address: string | null;
        state: string | null;
        phone: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        googleId: string | null;
        role: string;
        name: string | null;
        address: string | null;
        state: string | null;
        phone: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[]>;
}
