import { Repository } from 'typeorm';
import { CustomRepository } from '~typeorm-ex/decorators/custom-repository.decorator';
import { UserEntity } from '~users/entities/user.entity';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
