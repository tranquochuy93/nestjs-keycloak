import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { validate } from 'uuid';
import { getParamOptions, ParamOptions } from '~core/helpers/get-params.helper';

export const Id = createParamDecorator((options: ParamOptions | string, ctx: ExecutionContext) => {
    let paramOptions = getParamOptions(options, 'id');
    const request = ctx.switchToHttp().getRequest();
    let id = request.params[paramOptions.key] || request.query[paramOptions.key];
    if (!id && paramOptions.nullable) {
        return id;
    }
    if (!validate(id)) {
        throw new BadRequestException('Invalid id');
    }
    return id;
});

export const Ids = createParamDecorator((options: ParamOptions | string, ctx: ExecutionContext) => {
    let paramOptions = getParamOptions(options, 'ids');
    const request = ctx.switchToHttp().getRequest();
    let ids = request.query[paramOptions.key];
    if (!ids) {
        return [];
    }
    return ids
        .split(',')
        .map((id: string) => {
            if (!id && paramOptions.nullable) {
                return id;
            }
            if (!validate(id)) {
                throw new BadRequestException('Invalid id');
            }
            return id;
        })
        .filter((id: string) => id);
});
