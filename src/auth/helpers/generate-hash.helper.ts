import { genSaltSync, hashSync } from 'bcrypt';

export const generateHash = (plainPassword: string): string => {
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    return hashSync(plainPassword, salt);
};
