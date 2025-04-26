import { Injectable } from '@nestjs/common';
import { FindOneOptions, FindOptions } from 'typeorm';
import { UserEntity } from '~users/entities/user.entity';
import { UserRepository } from '~users/repositories/user.repository';

@Injectable()
export class UserService {
    constructor(private userRepo: UserRepository) {}

    async create(data: Partial<UserEntity>): Promise<UserEntity> {
        return this.userRepo.save(data);
    }

    async findOneOrFail(option: FindOneOptions<UserEntity>): Promise<UserEntity> {
        return this.userRepo.findOneOrFail(option);
    }
}
