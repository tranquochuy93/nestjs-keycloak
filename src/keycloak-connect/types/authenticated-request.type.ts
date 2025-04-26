import { Socket } from "socket.io";

export type User = {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  realm_access: { roles: string[] };
  resource_access: { [key: string]: { roles: string[] } };
  scope: string;
  sid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
};

export type CamelCaseUser = {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  sessionState: string;
  acr: string;
  realmAccess: { roles: string[] };
  resourceAccess: { [key: string]: { roles: string[] } };
  scope: string;
  sid: string;
  emailVerified: boolean;
  name: string;
  preferredUsername: string;
  givenName: string;
  familyName: string;
  email: string;
};

export type AuthenticatedRequest = {
  headers: { [key: string]: string | undefined };
  query: { [key: string]: string | undefined };
  user?: CamelCaseUser;
  accessTokenJWT?: string;
};

export type AuthenticatedWebSocket = Socket & {
  user?: CamelCaseUser;
  accessTokenJWT?: string;
};
