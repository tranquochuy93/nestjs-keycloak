import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Put,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { SignInResponse } from '~auth/types/signin-response.type';
import { Email } from '~core/decorators/email.decorator';
import { AuthGuard } from '~keycloak-connect/guards/auth.guard';
import { UserEntity } from '~users/entities/user.entity';
import { UserService } from '~users/services/user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    @UseGuards(AuthGuard)
    getUserDetail(@Email() email: string): Promise<UserEntity> {
        return this.userService.findOneOrFail({ where: { email } });
    }
}
