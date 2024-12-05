import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';

export enum CATEGORY_STATUS {
  IN_ACTIVE = 0,
  ACTIVE = 1,
}

@Entity({ name: 'CATEGORY', schema: process.env.DB_SCHEMA })
export class Category {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column('varchar', {
    nullable: false,
    name: 'NAME',
    unique: true,
  })
  name: string;

  @Column('text', {
    nullable: false,
    name: 'DESCRIPTION',
  })
  description: string;

  @Column('numeric', {
    nullable: false,
    name: 'STATUS',
    default: CATEGORY_STATUS.ACTIVE,
  })
  status: number;

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

  @Column({
    nullable: true,
    name: 'DELETED_AT',
    type: 'timestamptz',
  })
  deletedAt: Date | null;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
