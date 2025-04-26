import { AuthToken } from '~keycloak/types/auth-token.type';
import { UserEntity } from '~users/entities/user.entity';

export type SignInResponse = UserEntity & AuthToken;
