export declare class UsersService {
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        googleId: string | null;
        role: string;
        address: string | null;
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
        address: string | null;
        phone: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    create(email: string, passwordHash?: string, googleId?: string): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        googleId: string | null;
        role: string;
        address: string | null;
        phone: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
}
