import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user.entity';

@Entity({ name: 'PROVINCE', schema: process.env.DB_SCHEMA })
export class Province {
  @PrimaryColumn('varchar', { nullable: false, name: 'ID' })
  id: string;

  @Column('varchar', { nullable: false, name: 'NAME' })
  name: string;

  @Column('varchar', { nullable: false, name: 'LEVEL' })
  level: string;

  @CreateDateColumn({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'CREATED_AT',
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
    name: 'UPDATED_AT',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    nullable: true,
    name: 'DELETED_AT',
  })
  deletedAt: Date;

  @OneToMany(() => User, (user) => user.province)
  users: User[];
}
