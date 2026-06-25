import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        access_token: string;
    }>;
    register(body: any): Promise<{
        id: number;
        email: string;
        googleId: string | null;
        role: string;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    getProfile(req: any): any;
}
