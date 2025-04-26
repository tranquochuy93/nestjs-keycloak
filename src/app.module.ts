import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from '~app.controller';
import { AppService } from '~app.service';
import { GlobalCacheModule } from '~config/cache.config';
import { databaseConfig } from '~config/database.config';
import { i18nConfig } from '~config/i18n.config';
import { HttpExceptionFilter } from '~core/filters/http-exception.filter';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '~auth/auth.module';
import { UserModule } from '~users/user.module';
import { KeycloakModule } from '~keycloak/keycloak.module';
import { keycloakConnectConfig } from '~config/keycloak.config';

@Module({
    imports: [
        databaseConfig,
        i18nConfig,
        keycloakConnectConfig,
        GlobalCacheModule,
        ConfigModule.forRoot({
            isGlobal: true
        }),
        AuthModule,
        UserModule,
        KeycloakModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        }
    ]
})
export class AppModule {}
