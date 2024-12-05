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

@Entity({ name: 'WARD', schema: process.env.DB_SCHEMA })
export class Ward {
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

  @Column('varchar', { nullable: false, name: 'DISTRICT_ID' })
  districtId: string;

  @OneToMany(() => User, (user) => user.ward)
  users: User[];
}
