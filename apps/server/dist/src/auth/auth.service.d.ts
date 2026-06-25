import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    register(email: string, pass: string): Promise<{
        id: number;
        email: string;
        googleId: string | null;
        role: string;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
}
