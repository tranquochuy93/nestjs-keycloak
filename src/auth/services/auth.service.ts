import { BadRequestException, Injectable } from '@nestjs/common';
import { generateHash } from '~auth/helpers/generate-hash.helper';
import { RefreshTokenDto } from '~auth/http/dto/refresh-token.dto';
import { SigninDto } from '~auth/http/dto/signin.dto';
import { SignupDto } from '~auth/http/dto/signup.dto';
import { SignInResponse } from '~auth/types/signin-response.type';
import { getMigrationGroupByUserType } from '~keycloak/helpers/get-migration-group-by-user-type.helper';
import { RealmService } from '~keycloak/services/realm.service';
import { AuthToken } from '~keycloak/types/auth-token.type';
import { UserService } from '~users/services/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private realmService: RealmService
    ) {}

    async signup(signupDto: SignupDto): Promise<SignInResponse> {
        const user = await this.userService.create({
            ...signupDto,
            password: generateHash(signupDto.password)
        });

        await this.realmService.createUser(
            {
                email: signupDto.email,
                password: signupDto.password,
                firstName: signupDto.firstName,
                lastName: signupDto.lastName,
                migrationGroups: [getMigrationGroupByUserType(user.type)]
            },
            {}
        );
        return this.signin({ email: signupDto.email, password: signupDto.password });
    }

    async signin({ email, password }: SigninDto): Promise<SignInResponse> {
        const user = await this.userService.findOneOrFail({ where: { email } });
        const response = await this.realmService.signin({
            email,
            password,
            migrationGroups: [getMigrationGroupByUserType(user.type)]
        });

        if (!response?.accessToken || !response?.refreshToken) {
            throw new BadRequestException({
                translate: 'error.auth_error_message.user.invalid_username_or_password'
            });
        }

        return {
            ...user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
        } as SignInResponse;
    }

    refreshToken(dto: RefreshTokenDto): Promise<AuthToken> {
        return this.realmService.refreshAccessToken(dto.refreshToken);
    }

    async logout(session: string): Promise<void> {
        await this.realmService.logout(session);
    }

    exchangeAuthorizationCodeForToken(code: string): Promise<AuthToken> {
        return this.realmService.exchangeAuthorizationCodeForToken(code);
    }
}
