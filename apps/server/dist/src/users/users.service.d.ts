export declare class UsersService {
    findByEmail(email: string): Promise<{
        id: number;
        email: string;
        passwordHash: string | null;
        googleId: string | null;
        role: string;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    findById(id: number): Promise<{
        id: number;
        email: string;
        passwordHash: string | null;
        googleId: string | null;
        role: string;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    create(email: string, passwordHash?: string, googleId?: string): Promise<{
        id: number;
        email: string;
        passwordHash: string | null;
        googleId: string | null;
        role: string;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
}
