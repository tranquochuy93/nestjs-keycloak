import { Module } from '@nestjs/common';
import { UserController } from './http/controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { TypeOrmExModule } from '~typeorm-ex/typeorm-ex.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), TypeOrmExModule.forCustomRepository([UserRepository])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
