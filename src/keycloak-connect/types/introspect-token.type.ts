import { IntrospectExtras, TokenTypeHint } from 'openid-client';

export type IntrospectToken = {
    token: string;
    tokenTypeHint?: TokenTypeHint;
    extras?: IntrospectExtras;
};
