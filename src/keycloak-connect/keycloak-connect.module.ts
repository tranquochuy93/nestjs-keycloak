import { DynamicModule, Global, Module } from '@nestjs/common';
import { KeycloakConfigOptions } from './types/keycloak-config-options.type';
import { createKeycloakConnectOptionsProvider, keycloakConnectProvider } from './providers/keycloak-connect-providers';
import { RedisStoreOptions } from './types/redis-store-options.type';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { HttpModule } from '@nestjs/axios';
import { keycloakIssuerClientProvider } from './providers/keycloak-issuer.provider';
import { OpenIdClientService } from './services/openid-client.service';
import { CacheService } from './services/cache.service';
import { ConfidentialClientService } from './providers/confidential-client.service';
import { KC_CONNECT_OPTIONS_SYMBOL } from './constants/symbol';

@Global()
@Module({})
export class KeycloakConnectModule {
    public static register(options: KeycloakConfigOptions): DynamicModule {
        const cacheManagerModule = this.createCacheManagerConfig(options.redisStoreOptions);

        return {
            module: KeycloakConnectModule,
            imports: [...cacheManagerModule, HttpModule],
            providers: [
                keycloakConnectProvider,
                createKeycloakConnectOptionsProvider(options),
                keycloakIssuerClientProvider,
                CacheService,
                OpenIdClientService,
                ConfidentialClientService
            ],
            exports: [
                KC_CONNECT_OPTIONS_SYMBOL,
                OpenIdClientService,
                ConfidentialClientService,
                CacheService,
                ...cacheManagerModule
            ]
        };
    }

    private static createCacheManagerConfig(redisStoreOptions: RedisStoreOptions): DynamicModule[] {
        if (!redisStoreOptions) {
            return [];
        }
        const cacheManagerModule = CacheModule.register({
            ...redisStoreOptions,
            isGlobal: true,
            store: redisStore
        });

        return [cacheManagerModule];
    }
}
