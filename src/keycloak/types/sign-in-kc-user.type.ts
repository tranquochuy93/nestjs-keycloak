import { MigrationGroup } from '~keycloak/enums/migration-group.enum';

export type SignInKCUser = {
    email: string;
    password: string;
    migrationGroups: MigrationGroup[];
};
