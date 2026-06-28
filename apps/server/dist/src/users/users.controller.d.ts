import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    updateProfile(req: any, body: any): Promise<{
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
}
