import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        access_token: string;
    }>;
    register(body: RegisterDto): Promise<{
        id: string;
        name: string | null;
        email: string;
        googleId: string | null;
        role: string;
        address: string | null;
        state: string | null;
        phone: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    getProfile(req: any): any;
}
