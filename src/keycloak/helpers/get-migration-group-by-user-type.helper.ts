import { MigrationGroup } from '~keycloak/enums/migration-group.enum';
import { UserType } from '~users/enums/user-type.enum';

export function getMigrationGroupByUserType(userType: UserType): MigrationGroup {
    switch (userType) {
        case UserType.SYSTEM_ADMIN:
            return MigrationGroup.SYSTEM_ADMIN;
        case UserType.ADMIN:
        case UserType.BASIC:
            return MigrationGroup.INTERNAL_USER;
        default:
            return MigrationGroup.EXTERNAL_USER;
    }
}
