import { KeycloakAdminClient } from '@mondayorsunday/keycloak-cjs';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Inject, Injectable } from '@nestjs/common';
import UserSessionRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userSessionRepresentation';
import { HttpService } from '@nestjs/axios';
import { KC_CONNECT_OPTIONS_SYMBOL } from '~keycloak-connect/constants/symbol';
import { KeycloakConfigOptions } from '~keycloak-connect/types/keycloak-config-options.type';

@Injectable()
export class ConfidentialClientService {
    readonly keycloakRealm = this.keycloakOptions.realm;

    constructor(
        @Inject(KC_CONNECT_OPTIONS_SYMBOL) private keycloakOptions: KeycloakConfigOptions,
        private httpService: HttpService
    ) {}

    private async createKcAdminClient(): Promise<KeycloakAdminClient> {
        const kcAdminClient = new KeycloakAdminClient({
            baseUrl: this.keycloakOptions.serverUrl,
            realmName: this.keycloakRealm
        });

        await kcAdminClient.auth({
            clientId: this.keycloakOptions.credentials.clientId,
            clientSecret: this.keycloakOptions.credentials.secret,
            grantType: 'client_credentials'
        });

        return kcAdminClient;
    }

    async generateAccessToken(): Promise<{ accessToken: string }> {
        const kcAdminClient = await this.createKcAdminClient();
        return { accessToken: kcAdminClient.accessToken };
    }

    getAdminRealmUrl(): string {
        const { serverUrl, realm } = this.keycloakOptions;
        return `${serverUrl}/admin/realms/${realm}`;
    }

    async findUserByKeycloakId(userId: string): Promise<UserRepresentation | undefined> {
        const kcAdminClient = await this.createKcAdminClient();
        return kcAdminClient.users.findOne({ realm: this.keycloakRealm, id: userId });
    }

    async isSubFound(subInput: { sub: string; email: string }): Promise<{ found: boolean; email: string }> {
        const kcAdminClient = await this.createKcAdminClient();
        const users = await kcAdminClient.users.find({ realm: this.keycloakRealm, username: subInput.sub });
        const user = users.find((user) => user.username === subInput.sub && user.email !== subInput.email);
        if (!user) {
            return { found: false, email: '' };
        }
        return { found: !!user, email: user.email };
    }

    async getAllSessionsOfUser(userId: string): Promise<UserSessionRepresentation[]> {
        const { accessToken } = await this.generateAccessToken();

        const url = `${this.getAdminRealmUrl()}/users/${userId}/sessions`;

        const { data } = await this.httpService.axiosRef.get<UserSessionRepresentation[]>(url, {
            headers: this.getHeader(accessToken)
        });

        return data;
    }

    private getHeader(accessToken: string): Record<string, any> {
        return {
            Authorization: `Bearer ${accessToken}`
        };
    }
}
