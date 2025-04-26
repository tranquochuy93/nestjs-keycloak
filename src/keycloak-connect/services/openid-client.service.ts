import { Inject, Injectable } from '@nestjs/common';
import { BaseClient, IntrospectionResponse } from 'openid-client';
import { KC_ISSUER_CLIENT_SYMBOL } from '~keycloak-connect/constants/symbol';
import { IntrospectToken } from '~keycloak-connect/types/introspect-token.type';

@Injectable()
export class OpenIdClientService {
    // private readonly tokenEndpoint = `${this.keycloakOptions.serverUrl}/realms/${this.keycloakOptions.realm}/protocol/openid-connect/token`;

    constructor(@Inject(KC_ISSUER_CLIENT_SYMBOL) private client: BaseClient) {}

    introspectToken(introspectToken: IntrospectToken): Promise<IntrospectionResponse> {
        const { token, tokenTypeHint, extras } = introspectToken;
        return this.client.introspect(token, tokenTypeHint, extras);
    }
}
