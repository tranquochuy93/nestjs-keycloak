import { Controller, Get, Render, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '~auth/services/auth.service';
import { env } from '~config/env.config';

@Controller('auth-code-flow')
export class AuthCodeFlowController {
    constructor(private authService: AuthService) {}

    @Get()
    @Render('home')
    index(@Req() req: Request): any {
        const users = req.cookies?.users;
        if (users?.accessToken) {
            // You can add logic here to fetch user details using the access token
            return { accessToken: users.accessToken };
        }
        return { accessToken: null };
    }

    @Get('login')
    // @UseGuards(AuthGuard('keycloak'))
    login(@Req() req: Request, @Res() res: Response): void {
        const authUrl =
            `${env.KEYCLOAK.BASE_URL}/realms/${env.KEYCLOAK.APP_REALM}/protocol/openid-connect/auth` +
            `?client_id=${env.KEYCLOAK.APP_CLIENT_ID}` +
            `&response_type=code` +
            `&redirect_uri=${encodeURIComponent(env.KEYCLOAK.REDIRECT_URI)}` +
            `&scope=openid`;
        res.redirect(authUrl); // Redirect to Keycloak for login
    }

    @Get('callback')
    // @UseGuards(AuthGuard('keycloak'))
    async handleLoginCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { code, session_state } = req.query;
        if (!code || !session_state) {
            throw new UnauthorizedException('Missing authorization code or state');
        }

        // Exchange the authorization code for tokens
        const tokenResponse = await this.authService.exchangeAuthorizationCodeForToken(code as string);
        if (!tokenResponse) {
            throw new UnauthorizedException('Failed to exchange authorization code for tokens');
        }

        // Store tokens in cookies or session
        res.cookie(
            'users',
            { accessToken: tokenResponse.accessToken, idToken: tokenResponse.idToken, sessionState: session_state },
            { httpOnly: true, secure: true }
        );

        // Redirect to a protected page after successful login
        res.redirect('/auth-code-flow');
    }

    @Get('logout')
    logout(@Req() req: Request, @Res() res: Response): void {
        const users = req.cookies?.users;
        if (!users?.idToken) {
            throw new UnauthorizedException('Missing ID token');
        }
        // Clear cookies or session
        res.clearCookie('users');
        const logoutUrl =
            `${env.KEYCLOAK.BASE_URL}/realms/${env.KEYCLOAK.APP_REALM}/protocol/openid-connect/logout` +
            `?post_logout_redirect_uri=${encodeURIComponent(env.KEYCLOAK.POST_LOGOUT_REDIRECT_URI)}` +
            `&id_token_hint=${users.idToken}`;
        // Redirect to Keycloak for logout
        res.redirect(logoutUrl);
    }

    @Get('profile')
    @Render('profile')
    getProfile(@Req() req: Request): any {
        return;
    }
}
