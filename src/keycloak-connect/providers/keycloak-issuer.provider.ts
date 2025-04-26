/* eslint-disable @typescript-eslint/naming-convention */
import { Provider } from '@nestjs/common';
import { custom, Issuer } from 'openid-client';
import { KC_CONNECT_OPTIONS_SYMBOL, KC_ISSUER_CLIENT_SYMBOL } from '~keycloak-connect/constants/symbol';

import { KeycloakConfigOptions } from '~keycloak-connect/types/keycloak-config-options.type';

export const keycloakIssuerClientProvider: Provider = {
    provide: KC_ISSUER_CLIENT_SYMBOL,
    useFactory: async (options: KeycloakConfigOptions) => {
        if (options.httpOptions) {
            custom.setHttpOptionsDefaults(options.httpOptions);
        }

        const keycloakIssuer = await Issuer.discover(`${options.serverUrl}/realms/${options.realm}`);
        return new keycloakIssuer.Client({
            client_id: options.credentials?.clientId || '',
            client_secret: options.credentials?.secret || '',
            token_endpoint_auth_method: 'client_secret_post'
        });
    },
    inject: [KC_CONNECT_OPTIONS_SYMBOL]
};
