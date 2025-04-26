import KeycloakConnect from "keycloak-connect";
import { KeycloakCredentials } from "./keycloak-config-options.type";

export type KeycloakExtendedConfig = KeycloakConnect.KeycloakConfig & {
  queryJwtKey?: string;
  credentials?: KeycloakCredentials;
  resourceServerId: string;
  serverUrl: string;
};
