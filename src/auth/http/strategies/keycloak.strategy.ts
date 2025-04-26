// auth/keycloak.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-keycloak-oauth2-oidc';
import { env } from '~config/env.config';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
    constructor() {
        super({
            clientID: env.KEYCLOAK.APP_CLIENT_ID,
            clientSecret: env.KEYCLOAK.APP_CONFIDENTIAL_SECRET_KEY,
            realm: env.KEYCLOAK.APP_REALM,
            authServerURL: env.KEYCLOAK.BASE_URL,
            callbackURL: env.KEYCLOAK.REDIRECT_URI,
            scope: ['openid']
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (err: any, user: any) => void
    ): Promise<any> {
        console.log('Profile:', profile.username);
        return done(null, {
            accessToken,
            refreshToken,
            username: profile.username
        });
    }
}
