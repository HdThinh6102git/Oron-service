import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';

export enum ROLE_STATUS {
  IN_ACTIVE = 'IN_ACTIVE',
  ACTIVE = 'ACTIVE',
}

@Entity({ name: 'ROLE', schema: process.env.DB_SCHEMA })
export class Role {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('varchar', { nullable: false, name: 'ROLE_NAME' })
  name: string;

  @Column('varchar', {
    nullable: false,
    name: 'STATUS',
    default: ROLE_STATUS.ACTIVE,
  })
  status: string;

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

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
