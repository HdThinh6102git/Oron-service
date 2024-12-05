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
@Entity({ name: 'POST_REGISTRATION', schema: process.env.DB_SCHEMA })
export class PostRegistration {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column('text', {
    nullable: false,
    name: 'MESSAGE',
  })
  message: string;

  @Column('numeric', {
    nullable: false,
    name: 'STATUS',
    default: POST_REGISTRATION_STATUS.WAITING_CONFIRMATION,
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

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'POST_ID', referencedColumnName: 'id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'USER_ID', referencedColumnName: 'id' })
  user: User;
}
