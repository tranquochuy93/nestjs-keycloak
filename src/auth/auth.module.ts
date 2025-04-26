import { Module } from '@nestjs/common';
import { AuthController } from './http/controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '~users/user.module';
import { KeycloakModule } from '~keycloak/keycloak.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthCodeFlowController } from './http/controllers/auth-code-flow.controller';
import { PassportModule } from '@nestjs/passport';
import { KeycloakStrategy } from './http/strategies/keycloak.strategy';

@Module({
    imports: [UserModule, KeycloakModule, JwtModule.register({}), PassportModule],
    controllers: [AuthController, AuthCodeFlowController],
    providers: [AuthService, KeycloakStrategy],
    exports: []
})
export class AuthModule {}
