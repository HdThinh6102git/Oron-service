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
  IN_ACTIVE = 'IN_ACTIVE',
  ACTIVE = 'ACTIVE',
}

@Entity({ name: 'review', schema: process.env.DB_SCHEMA })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
    name: 'description',
  })
  description: string;

  @Column('varchar', {
    nullable: false,
    name: 'status',
    default: REVIEW_STATUS.ACTIVE,
  })
  status: string;

  @Column('numeric', {
    nullable: true,
    name: 'number_star',
  })
  numberStar: number;

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

  @ManyToOne(() => Post, (post) => post.reviews)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}