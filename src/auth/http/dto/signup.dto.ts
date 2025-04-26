import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { LangEnum } from '~core/constants/lang.enum';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '~auth/constants/password.constant';
import { UserType } from '~users/enums/user-type.enum';

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(MAX_PASSWORD_LENGTH)
    @MinLength(MIN_PASSWORD_LENGTH)
    password: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Email must be valid' })
    @Transform(({ value: email }) => email.toLowerCase())
    email: string;

    @IsEnum(LangEnum, { message: '$property must be a valid enum value' })
    @IsNotEmpty()
    lang: LangEnum;

    @IsEnum(UserType, { message: '$property must be a valid enum value' })
    @IsNotEmpty()
    type: UserType;
}
