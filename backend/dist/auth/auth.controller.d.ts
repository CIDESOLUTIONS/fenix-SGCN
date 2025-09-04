import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: SignupDto): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    signin(dto: SigninDto): Promise<{
        accessToken: string;
    }>;
}
