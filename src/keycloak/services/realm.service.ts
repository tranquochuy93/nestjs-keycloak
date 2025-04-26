import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { env } from '~config/env.config';
import { KeycloakAdminClient } from '@mondayorsunday/keycloak-cjs';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { SignInKCUser } from '~keycloak/types/sign-in-kc-user.type';
import { AuthToken } from '~keycloak/types/auth-token.type';
import { CredentialsRealm } from '~keycloak/types/credentials-realm.type';
import axios, { AxiosError } from 'axios';
import { MigrationGroup } from '~keycloak/enums/migration-group.enum';
import GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation';
import { parseToken } from '~keycloak/helpers/parse-token.helper';
import { SignUpKCUser } from '~keycloak/types/sign-up-kc-user.type';
import { KC_ADMIN_CLIENT_SYMBOL } from '~keycloak/constants/symbol';

@Injectable()
export class RealmService {
    private clientId = env.KEYCLOAK.APP_CLIENT_ID;
    private confidentialClientId = env.KEYCLOAK.APP_CONFIDENTIAL_CLIENT_ID;
    private clientSecret = env.KEYCLOAK.APP_CONFIDENTIAL_SECRET_KEY;
    private baseUrl = env.KEYCLOAK.BASE_URL;
    private realmName = env.KEYCLOAK.APP_REALM;
    private redirectUri = env.KEYCLOAK.REDIRECT_URI;
    private readonly logger = new Logger(RealmService.name);

    constructor(@Inject(KC_ADMIN_CLIENT_SYMBOL) private kcAdminClient: KeycloakAdminClient) {
        // this.run();
    }

    // private dynamicKeycloakImport = async (): Promise<any> =>
    //     new Function("return import('@keycloak/keycloak-admin-client')")();

    // private async run(): Promise<void> {
    //     this.kcAdminClient = new (await this.dynamicKeycloakImport()).default();
    //     await this.kcAdminClient.setConfig({
    //         baseUrl: env.KEYCLOAK.BASE_URL,
    //         realmName: env.KEYCLOAK.APP_REALM
    //     });
    //     const credentials = {
    //         grantType: 'client_credentials',
    //         clientId: env.KEYCLOAK.APP_CONFIDENTIAL_CLIENT_ID,
    //         clientSecret: env.KEYCLOAK.APP_CONFIDENTIAL_SECRET_KEY
    //     };

    //     await this.kcAdminClient.auth(credentials as any);
    // }

    async findOneByUsername(username: string): Promise<UserRepresentation> {
        const users = await this.kcAdminClient.users.find({
            realm: this.realmName,
            username
        });
        return users.find((kcUser) => kcUser.username === username);
    }

    async updateUserAttributes(userName: string, attributes: Record<string, any>): Promise<void> {
        try {
            const retrievedUser = await this.findOneByUsername(userName);
            if (!retrievedUser) {
                throw new BadRequestException({
                    translate: 'error.organization_error_message.user.not_found'
                });
            }
            return await this.kcAdminClient.users.update(
                {
                    realm: this.realmName,
                    id: retrievedUser.id as string
                },
                {
                    attributes: {
                        ...retrievedUser.attributes,
                        ...attributes
                    }
                }
            );
        } catch (error) {
            const keycloakException = error as AxiosError;
            this.logger.error('http', 'request', 'end', {
                resource: this.constructor.name,
                functionName: 'updateUserAttributes',
                action: 'print',
                payload: {
                    exception: keycloakException
                }
            });
            throw error;
        }
    }

    async createUser(
        { email, password, firstName, lastName, migrationGroups }: SignUpKCUser,
        attributes: Record<string, any>
    ): Promise<AuthToken> {
        try {
            await this.kcAdminClient.users.create({
                username: email,
                realm: this.realmName,
                firstName,
                lastName,
                email,
                enabled: true,
                emailVerified: true,
                credentials: [
                    {
                        temporary: false,
                        type: 'password',
                        value: password
                    }
                ],
                attributes
            });
            await this.updateUserAttributes(email || '', attributes);
            await this.addGroupUser(email, migrationGroups);
        } catch (err) {
            this.logger.error('http', 'request', 'end', {
                resource: this.constructor.name,
                functionName: 'createUser',
                action: 'end',
                payload: { err }
            });
            throw err;
        }
        return this.signin({ email, password, migrationGroups });
    }

    async signin({ email, password }: SignInKCUser): Promise<AuthToken> {
        const credential: CredentialsRealm = {
            username: email,
            password,
            grantType: 'password',
            clientId: this.clientId,
            realmName: this.realmName
        };

        const { accessToken, refreshToken } = await this.authenticate(credential);

        if (!accessToken || !refreshToken) {
            throw new BadRequestException({
                translate: 'error.organization_error_message.user.not_found'
            });
        }

        return { accessToken, refreshToken };
    }

    private async findOneGroup(search: string): Promise<GroupRepresentation> {
        const groups = await this.kcAdminClient.groups.find({ realm: this.realmName, search });
        return groups.find((group) => group.name === search);
    }

    async addGroupUser(username: string, migrationGroups: MigrationGroup[]): Promise<void | null> {
        try {
            const retrievedUser = await this.findOneByUsername(username);
            if (!retrievedUser || !retrievedUser.id) {
                return;
            }

            if (!migrationGroups?.length) {
                return;
            }

            const newGroup = await this.findOneGroup(migrationGroups[0]);
            await this.kcAdminClient.users.addToGroup({
                groupId: newGroup.id,
                id: retrievedUser.id,
                realm: this.realmName
            });
        } catch (error) {
            const keycloakException = error as AxiosError;
            this.logger.error('http', 'request', 'end', {
                resource: this.constructor.name,
                functionName: 'updateGroupUser',
                action: 'print',
                payload: {
                    exception: keycloakException
                }
            });
            throw error;
        }
    }

    async invalidateSession(accessToken: string): Promise<void> {
        if (accessToken) {
            await this.logout(parseToken(accessToken).sessionState);
        }
    }

    private async authenticate(credentials: CredentialsRealm): Promise<AuthToken> {
        const kcAdminClient = this.getKcClient();
        await kcAdminClient.auth(credentials);

        return {
            accessToken: kcAdminClient.accessToken,
            refreshToken: kcAdminClient.refreshToken
        };
    }

    private getKcClient(): KeycloakAdminClient {
        return new KeycloakAdminClient({
            baseUrl: this.baseUrl,
            realmName: this.realmName
        });
    }

    async refreshAccessToken(refreshToken: string): Promise<AuthToken> {
        try {
            const kcAdminClient = this.getKcClient();

            await kcAdminClient.auth({
                refreshToken,
                grantType: 'refresh_token',
                clientId: this.clientId
            });

            if (!kcAdminClient.accessToken || !kcAdminClient.refreshToken) {
                throw new UnauthorizedException({ translate: 'error.auth.user.not_found' });
            }

            return {
                accessToken: kcAdminClient.accessToken,
                refreshToken: kcAdminClient.refreshToken
            };
        } catch (error) {
            const keycloakException = error as AxiosError<any>;
            throw new UnauthorizedException({ translate: keycloakException?.response?.data?.error_description });
        }
    }

    async logout(session: string): Promise<void> {
        try {
            await this.kcAdminClient.realms.deleteSession({
                realm: this.realmName,
                session,
                isOffline: false
            });
        } catch (error) {
            const keycloakException = error as AxiosError;

            this.logger.error('http', 'request', 'end', {
                resource: this.constructor.name,
                functionName: 'logout',
                action: 'print',
                payload: {
                    exception: keycloakException
                }
            });
            throw error;
        }
    }

    async exchangeAuthorizationCodeForToken(code: string): Promise<AuthToken> {
        try {
            // Exchange authorization code for tokens
            const tokenResponse = await axios.post(
                `${this.baseUrl}/realms/${this.realmName}/protocol/openid-connect/token`,
                new URLSearchParams({
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    grant_type: 'authorization_code',
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    client_id: this.clientId,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    client_secret: this.clientSecret,
                    code,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    redirect_uri: this.redirectUri
                }),
                {
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            return {
                accessToken: tokenResponse.data.access_token,
                refreshToken: tokenResponse.data.refresh_token,
                idToken: tokenResponse.data.id_token
            };
        } catch (error) {
            console.error('Token exchange failed:', error);
            throw error;
        }
    }
}
