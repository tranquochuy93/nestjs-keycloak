import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { hashToken } from '~keycloak-connect/helpers/token-cache';
import { OpenIdClientService } from '~keycloak-connect/services/openid-client.service';
import { LoginTimeout } from '~keycloak/exceptions/login-timeout.exception';
import { parseToken } from '~keycloak/helpers/parse-token.helper';
import { CacheService } from '~keycloak-connect/services/cache.service';
import { ConfidentialClientService } from '~keycloak-connect/providers/confidential-client.service';
import { ParsedCamelCaseJwt } from '~keycloak/types/parsed-jwt.type';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        // private jwtService: JwtService,
        private cacheService: CacheService,
        private openIdClientService: OpenIdClientService,
        private confidentialClientService: ConfidentialClientService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request) || request.cookies?.access_token;
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const isValidJwtToken = await this.validateToken(token);
            if (!isValidJwtToken) {
                throw new UnauthorizedException();
            }

            const parsedCamelCaseJwt = parseToken(token);
            await this.validateSession(parsedCamelCaseJwt);

            request.email = parsedCamelCaseJwt.preferredUsername;
            request.sessionState = parsedCamelCaseJwt.sessionState;
            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }

    async validateSession(user: ParsedCamelCaseJwt): Promise<void> {
        const sessions = await this.confidentialClientService.getAllSessionsOfUser(user.sub);

        const isValid = sessions.some((session) => (session.id = user.sid));

        if (!isValid) {
            throw new UnauthorizedException({ translate: 'error.unauthorized' });
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async validateToken(token: string): Promise<boolean> {
        const isExpired = this.getTimeToLive(token).ttlInMilliseconds <= 0;
        if (isExpired) {
            throw new LoginTimeout({ translate: 'error.login_timeout' });
        }
        return await this.cacheToken(token);
    }

    private getTimeToLive(token: string): { ttlInMilliseconds: number; ttlInSeconds: number } {
        const milliseconds = 1000;
        const parsedToken = parseToken(token);
        const expiryTimeInMilliseconds = parsedToken.exp * milliseconds;
        const ttlInMilliseconds = expiryTimeInMilliseconds - Date.now();
        const ttlInSeconds = Math.floor(ttlInMilliseconds / milliseconds);
        return { ttlInMilliseconds, ttlInSeconds };
    }

    private async cacheToken(token: string): Promise<boolean> {
        const md5TokenKey = hashToken(token);
        const isActive = await this.cacheService.getToken(md5TokenKey);
        if (isActive) {
            return isActive;
        }

        const isValidToken = await this.retryIntrospectToken(token);
        const cacheValue = { isActive: isValidToken };
        const { ttlInSeconds: ttl } = this.getTimeToLive(token);
        await this.cacheService.setToken(md5TokenKey, cacheValue, ttl);
        return isValidToken;
    }

    private async retryIntrospectToken(token: string): Promise<boolean> {
        const maxRetryCount = 3;
        let retryError = 0;

        while (retryError < maxRetryCount) {
            try {
                const { active: isValidToken } = await this.openIdClientService.introspectToken({
                    token,
                    tokenTypeHint: 'access_token'
                });
                return isValidToken;
            } catch (err) {
                retryError = retryError + 1;
                // Failed to get token status after 3 retries
                if (retryError === maxRetryCount) {
                    throw err;
                }
            }
        }
    }
}
