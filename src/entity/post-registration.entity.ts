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
export enum POST_REGISTRATION_STATUS {
  WAITING_CONFIRMATION = 1,
  CANCELED = 0,
  REFUSED = 2,
  WAITING_RECEIPT = 3,
  RECEIVED = 4,
}
@Entity({ name: 'post_registration', schema: process.env.DB_SCHEMA })
export class PostRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
    name: 'message',
  })
  message: string;

  @Column('numeric', {
    nullable: false,
    name: 'status',
    default: POST_REGISTRATION_STATUS.WAITING_CONFIRMATION,
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

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
