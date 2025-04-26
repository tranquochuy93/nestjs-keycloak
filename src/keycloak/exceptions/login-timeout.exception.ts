import { HttpException } from '@nestjs/common';

export class LoginTimeout extends HttpException {
    constructor(objectOrError?: string | object | any, description = 'Login Timeout') {
        const httpStatusCode = 440;
        super(HttpException.createBody(objectOrError, description, 440), httpStatusCode);
    }
}
