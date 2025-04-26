import { HttpOptions } from "openid-client";
import { RedisStoreOptions } from "./redis-store-options.type";

export type KeycloakConfigOptions = {
  resource: string;
  serverUrl: string;
  realm: string;
  sslRequired: string;
  port: number;
  isBearerOnly?: boolean;
  queryJwtKey?: string;
  credentials?: KeycloakCredentials;
  httpOptions?: HttpOptions;
  resourceServerId?: string;
  redisStoreOptions: RedisStoreOptions;
};

export type KeycloakCredentials = {
  clientId: string;
  secret: string;
};
