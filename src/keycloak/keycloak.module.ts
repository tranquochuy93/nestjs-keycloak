import { Module } from '@nestjs/common';
import { RealmService } from './services/realm.service';
import { KC_ADMIN_CLIENT } from './providers/keycloak.provider';
import { KC_ADMIN_CLIENT_SYMBOL } from './constants/symbol';

@Module({
    imports: [],
    controllers: [],
    providers: [RealmService, KC_ADMIN_CLIENT],
    exports: [RealmService, KC_ADMIN_CLIENT, KC_ADMIN_CLIENT_SYMBOL]
})
export class KeycloakModule {}
