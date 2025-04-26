import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// require('dotenv').config({ path: '.env' });
console.log(process.cwd());

const isTest = process.env.NODE_ENV === 'test';
export const env = {
    DATABASE: {
        CONNECT: process.env.DATABASE_CONNECT as any,
        HOST: process.env.DATABASE_HOST,
        PORT: Number(process.env.DATABASE_PORT),
        USER: process.env.DATABASE_USER,
        PASSWORD: process.env.DATABASE_PASSWORD,
        NAME: process.env.DATABASE_NAME
    },
    ROOT_PATH: process.cwd() + (isTest ? '/src' : ''),
    JWT: {
        SECRET: process.env.JWT_SECRET,
        EXPIRE: process.env.JWT_EXPIRE || '7d'
    },
    APP_PORT: process.env.APP_PORT,
    REDIS: {
        HOST: process.env.REDIS_HOST,
        PORT: Number(process.env.REDIS_PORT || 6379)
    },
    KAFKA: {
        TOPIC_PREFIX: process.env.KAFKA_PREFIX,
        CLIENT_ID: process.env.KAFKA_CLIENT_ID,
        URL: process.env.KAFKA_URL
    },
    GRAPHQL: {
        PLAYGROUND: process.env.GRAPHQL_PLAYGROUND || 1
    },
    KEYCLOAK: {
        BASE_URL: process.env.KEYCLOAK_BASE_URL as string,
        APP_REALM: process.env.KEYCLOAK_APP_REALM as string,
        APP_CLIENT_ID: process.env.KEYCLOAK_APP_CLIENT_ID as string,
        APP_CONFIDENTIAL_PORT: parseInt(process.env.KEYCLOAK_APP_CONFIDENTIAL_PORT || '0'),
        APP_SSL_REQUIRED: process.env.KEYCLOAK_APP_SSL_REQUIRED as string,
        APP_CONFIDENTIAL_CLIENT_ID: process.env.KEYCLOAK_APP_CONFIDENTIAL_CLIENT_ID as string,
        APP_CONFIDENTIAL_SECRET_KEY: process.env.KEYCLOAK_APP_CONFIDENTIAL_SECRET_KEY as string,
        IDENTITY_PROVIDER: process.env.KEYCLOAK_IDENTITY_PROVIDER,
        REDIRECT_URI: process.env.KEYCLOAK_REDIRECT_URI,
        POST_LOGOUT_REDIRECT_URI: process.env.KEYCLOAK_POST_LOGOUT_REDIRECT_URI
    }
};
