import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentSessionStateId = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ sessionState: string }>();
    return request.sessionState;
});
