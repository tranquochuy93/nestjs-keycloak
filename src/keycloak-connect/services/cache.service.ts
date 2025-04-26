import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { hashToken } from '~keycloak-connect/helpers/token-cache';
import { LoginTimeout } from '~keycloak/exceptions/login-timeout.exception';

@Injectable()
export class CacheService {
    private logger = new Logger(CacheService.name);
    static instance: CacheService;

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
        CacheService.instance = this;
    }

    async deleteToken(token: string): Promise<void> {
        const hashedToken = hashToken(token);
        const obj = await this.cacheManager.get<{ isActive: boolean }>(hashedToken);
        if (!obj) {
            this.logger.log(`Cache does not have ${hashedToken}, exit now`);
            return;
        }

        await this.cacheManager.del(hashedToken);
        this.logger.log(`Delete ${hashedToken} from cache`);
    }

    async setToken(tokenKey: string, cacheValue: { isActive: boolean }, ttl: number): Promise<void> {
        if (ttl <= 0) {
            throw new LoginTimeout({ translate: 'error.login_timeout' });
        }
        await this.cacheManager.set(tokenKey, cacheValue, ttl);
    }

    async getToken(tokenKey: string): Promise<boolean | undefined> {
        const objToken = await this.cacheManager.get<{ isActive: boolean }>(tokenKey);
        return objToken ? objToken.isActive : undefined;
    }
}
