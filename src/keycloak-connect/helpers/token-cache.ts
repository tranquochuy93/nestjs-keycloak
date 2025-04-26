import md5 from 'md5';

export const hashToken = (token: string): string => md5(token);
