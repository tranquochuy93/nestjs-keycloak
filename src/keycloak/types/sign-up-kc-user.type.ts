import { MigrationGroup } from '~keycloak/enums/migration-group.enum';

export type SignUpKCUser = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    migrationGroups: MigrationGroup[];
};
