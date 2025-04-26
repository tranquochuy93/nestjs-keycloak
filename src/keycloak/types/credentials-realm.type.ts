import { Credentials } from '@keycloak/keycloak-admin-client/lib/utils/auth';

export type CredentialsRealm = Credentials & { realmName: string };

export type ResetPasswordRealm = Pick<Required<CredentialsRealm>, 'username' | 'password'>;

export type ChangePasswordRealm = {
    username: string;
    currentPassword: string;
    newPassword: string;
};
