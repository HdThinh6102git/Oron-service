import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user.entity';

@Entity({ name: 'province', schema: process.env.DB_SCHEMA })
export class Province {
  @PrimaryColumn('varchar', { nullable: false, name: 'id' })
  id: string;

  @Column('varchar', { nullable: false, name: 'name' })
  name: string;

  @Column('varchar', { nullable: false, name: 'level' })
  level: string;

  @Column('varchar', {
    length: 36,
    nullable: true,
    name: 'create_by',
  })
  createBy: string;

  @Column('varchar', {
    length: 36,
    nullable: true,
    name: 'modify_by',
  })
  modifyBy: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    name: 'create_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    name: 'modify_date',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  modifyDate: Date;

  @Column('char', {
    length: 1,
    nullable: true,
    name: 'sys_flag',
  })
  sysFlag: string;

  @OneToMany(() => User, (user) => user.province)
  users: User[];
}
