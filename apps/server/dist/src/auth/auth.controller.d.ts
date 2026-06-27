import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        access_token: string;
    }>;
    register(body: RegisterDto): Promise<{
        id: number;
        email: string;
        googleId: string | null;
        role: string;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    getProfile(req: any): any;
}
