import { Provider } from '@nestjs/common';
import { KeycloakAdminClient } from '@mondayorsunday/keycloak-cjs';
import { ConfigService } from '@nestjs/config';
import { KC_ADMIN_CLIENT_SYMBOL } from '~keycloak/constants/symbol';

export const KC_ADMIN_CLIENT: Provider = {
    provide: KC_ADMIN_CLIENT_SYMBOL,
    useFactory: async (configService: ConfigService) => {
        const baseUrl = configService.get<string>('KEYCLOAK_BASE_URL', '');
        const appRealmName = configService.get<string>('KEYCLOAK_APP_REALM', '');
        const clientId = configService.get<string>('KEYCLOAK_APP_CONFIDENTIAL_CLIENT_ID', '');
        const clientSecret = configService.get<string>('KEYCLOAK_APP_CONFIDENTIAL_SECRET_KEY', '');

        const client = new KeycloakAdminClient({
            baseUrl,
            realmName: appRealmName
        });

        await client.auth({
            clientId,
            clientSecret,
            grantType: 'client_credentials'
        });

        return client;
    },
    inject: [ConfigService]
};
