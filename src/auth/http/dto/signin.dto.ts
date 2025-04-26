import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '~auth/constants/password.constant';

export class SigninDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(MAX_PASSWORD_LENGTH)
    @MinLength(MIN_PASSWORD_LENGTH)
    password: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Email must be valid' })
    @Transform(({ value: email }) => email.toLowerCase())
    email: string;
}
