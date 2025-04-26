import { KeycloakConnectModule } from '~keycloak-connect/keycloak-connect.module';
import { env } from './env.config';

export const keycloakConnectConfig = KeycloakConnectModule.register({
    resource: env.KEYCLOAK.APP_CLIENT_ID,
    serverUrl: env.KEYCLOAK.BASE_URL,
    realm: env.KEYCLOAK.APP_REALM,
    sslRequired: env.KEYCLOAK.APP_SSL_REQUIRED,
    port: env.KEYCLOAK.APP_CONFIDENTIAL_PORT,
    isBearerOnly: false,
    credentials: {
        clientId: env.KEYCLOAK.APP_CONFIDENTIAL_CLIENT_ID,
        secret: env.KEYCLOAK.APP_CONFIDENTIAL_SECRET_KEY
    },
    httpOptions: {
        timeout: 10000
    },
    redisStoreOptions: {
        host: env.REDIS.HOST || 'localhost',
        port: env.REDIS.PORT
    }
} as any);
