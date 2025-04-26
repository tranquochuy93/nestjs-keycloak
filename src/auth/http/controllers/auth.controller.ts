import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { AuthService } from '~auth/services/auth.service';
import { AuthToken } from '~keycloak/types/auth-token.type';
import { SigninDto } from '../dto/signin.dto';
import { SignInResponse } from '~auth/types/signin-response.type';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { AuthGuard } from '~keycloak-connect/guards/auth.guard';
import { CurrentSessionStateId } from '~keycloak-connect/decorators/current-session-state-id.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() signupDto: SignupDto): Promise<AuthToken> {
        return this.authService.signup(signupDto);
    }

    @Post('signin')
    signin(@Body() dto: SigninDto): Promise<SignInResponse> {
        return this.authService.signin(dto);
    }

    @Post('refresh-token')
    refreshToken(@Body() data: RefreshTokenDto): Promise<AuthToken> {
        return this.authService.refreshToken(data);
    }

    @Post('logout')
    @UseGuards(AuthGuard)
    logout(@CurrentSessionStateId() sessionStateId: string): Promise<void> {
        return this.authService.logout(sessionStateId);
    }
}
