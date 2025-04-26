/* eslint-disable @typescript-eslint/naming-convention */
export type ParsedJwt = {
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

export type ParsedCamelCaseJwt = {
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
