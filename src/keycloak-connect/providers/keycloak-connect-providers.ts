import { Provider } from '@nestjs/common';
import KeycloakConnect from 'keycloak-connect';

import { KeycloakConfigOptions } from '~keycloak-connect/types/keycloak-config-options.type';
import { KC_CONNECT_OPTIONS_SYMBOL, KC_CONNECT_PROVIDER_SYMBOL } from '~keycloak-connect/constants/symbol';
import { KeycloakExtendedConfig } from '~keycloak-connect/types/keycloak-extended-config.type';

export function createKeycloakConnectOptionsProvider(keycloakConnectOptions: KeycloakConfigOptions): Provider {
    const kcConnectConfig: KeycloakExtendedConfig = {
        'confidential-port': keycloakConnectOptions.port,
        'auth-server-url': keycloakConnectOptions.serverUrl,
        serverUrl: keycloakConnectOptions.serverUrl,
        resource: keycloakConnectOptions.resource,
        'ssl-required': keycloakConnectOptions.sslRequired,
        'bearer-only': keycloakConnectOptions.isBearerOnly || false,
        realm: keycloakConnectOptions.realm,
        queryJwtKey: keycloakConnectOptions.queryJwtKey,
        credentials: keycloakConnectOptions.credentials,
        resourceServerId: keycloakConnectOptions.resourceServerId || keycloakConnectOptions.resource
    };

    return {
        provide: KC_CONNECT_OPTIONS_SYMBOL,
        useValue: kcConnectConfig
    };
}

export const keycloakConnectProvider: Provider = {
    provide: KC_CONNECT_PROVIDER_SYMBOL,
    useFactory: (options: KeycloakExtendedConfig) => {
        console.log(options);
        return new KeycloakConnect({}, options);
    },
    inject: [KC_CONNECT_OPTIONS_SYMBOL]
};
