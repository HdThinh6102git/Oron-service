import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '@modules/entity';

export enum CATEGORY_STATUS {
  IN_ACTIVE = 0,
  ACTIVE = 1,
}

@Entity({ name: 'category', schema: process.env.DB_SCHEMA })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    nullable: false,
    name: 'name',
    unique: true,
  })
  name: string;

  @Column('text', {
    nullable: false,
    name: 'description',
  })
  description: string;

  @Column('numeric', {
    nullable: false,
    name: 'status',
    default: CATEGORY_STATUS.ACTIVE,
  })
  status: number;

  @CreateDateColumn({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({
    nullable: true,
    name: 'deleted_at',
    type: 'timestamptz',
  })
  deletedAt: Date | null;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
