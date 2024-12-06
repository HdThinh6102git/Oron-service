import {
  Column,
  CreateDateColumn,
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

  @Column('varchar', {
    length: 36,
    nullable: true,
    name: 'CREATE_BY',
  })
  createBy: string;

  @Column('varchar', {
    length: 36,
    nullable: true,
    name: 'MODIFY_BY',
  })
  modifyBy: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    name: 'CREATE_DATE',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    name: 'MODIFY_DATE',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  modifyDate: Date;

  @Column('char', {
    length: 1,
    nullable: true,
    name: 'SYS_FLAG',
  })
  sysFlag: string;

  @OneToMany(() => User, (user) => user.province)
  users: User[];
}
