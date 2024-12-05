import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post/post.entity';
import { User } from './user/user.entity';

export enum REVIEW_STATUS {
  IN_ACTIVE = 0,
  ACTIVE = 1,
}

@Entity({ name: 'REVIEW', schema: process.env.DB_SCHEMA })
export class Review {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column('text', {
    nullable: false,
    name: 'DESCRIPTION',
  })
  description: string;

  @Column('numeric', {
    nullable: false,
    name: 'STATUS',
    default: REVIEW_STATUS.ACTIVE,
  })
  status: number;

  @Column('numeric', {
    nullable: true,
    name: 'NUMBER_STAR',
  })
  numberStar: number;

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

  @ManyToOne(() => Post, (post) => post.reviews)
  @JoinColumn({ name: 'POST_ID', referencedColumnName: 'id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'USER_ID', referencedColumnName: 'id' })
  user: User;
}
