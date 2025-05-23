import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import path from 'path';
import { AppModule } from '~app.module';
import { env } from '~config/env.config';
import { ValidateException } from '~core/exceptions/validate.exception';
import cookieParser from 'cookie-parser';
import { session } from 'passport';

export class Bootstrap {
    private app: NestExpressApplication;

    async initApp(): Promise<void> {
        this.app = await NestFactory.create<NestExpressApplication>(AppModule);
    }

    initPipes(): void {
        this.app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                stopAtFirstError: true,
                exceptionFactory: (errors) => new ValidateException(errors)
            })
        );
    }

    initCookies(): void {
        this.app.use(cookieParser());
    }

    initSession(): void {
        this.app.use(session());
    }

    async start(): Promise<void> {
        this.app.set('trust proxy', true);
        await this.app.listen(env.APP_PORT);
    }

    buildSwagger(): OpenAPIObject {
        const swaggerConfig = new DocumentBuilder()
            .setTitle('API with NestJS')
            .setDescription('API developed throughout the API with NestJS course')
            .setVersion('1.0')
            .build();

        const document = SwaggerModule.createDocument(this.app, swaggerConfig);
        SwaggerModule.setup('api', this.app, document);
        return document;
    }

    // async buildRedoc(document: OpenAPIObject): Promise<void> {
    //     await new ReDocBuilder(this.app, document).build(document);
    // }

    // async builSpectaql(): Promise<void> {
    //     await new SpectaqlBuilder().build();
    // }

    initStaticAsset(): void {
        console.log(path.join(env.ROOT_PATH, 'static'));
        this.app.useStaticAssets(path.join(env.ROOT_PATH, 'static'), { prefix: '/static' });
        this.app.setBaseViewsDir(path.join(env.ROOT_PATH, 'core/views'));
        this.app.setViewEngine('hbs');
    }
}
