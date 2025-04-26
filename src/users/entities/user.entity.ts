import { Exclude } from 'class-transformer';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '~core/entities/base.entity';
import { TimestampTransformer } from '~core/transformers/timestamp.transformer';
import { UserType } from '~users/enums/user-type.enum';

@Entity('User')
export class UserEntity extends BaseEntity {
    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    type: UserType;

    @Index()
    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column({ nullable: true, select: false })
    password?: string;

    @Column({
        type: 'timestamp',
        transformer: new TimestampTransformer()
    })
    lastLoginAt: Date;
}
