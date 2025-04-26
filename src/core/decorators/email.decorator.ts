import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getParamOptions, ParamOptions } from '~core/helpers/get-params.helper';
import { isEmail } from 'class-validator';

export const Email = createParamDecorator((options: ParamOptions | string, ctx: ExecutionContext) => {
    let paramOptions = getParamOptions(options, 'email');
    const request = ctx.switchToHttp().getRequest();
    let email = request.params[paramOptions.key] || request.query[paramOptions.key] || request[paramOptions.key];
    if (!email && paramOptions.nullable) {
        return email;
    }
    if (!isEmail(email)) {
        throw new BadRequestException('Invalid email');
    }
    return email;
});
