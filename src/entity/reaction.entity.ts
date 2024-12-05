import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user/user.entity';
import { Post } from './post/post.entity';
export enum REACTION_TYPE {
  LIKE = 0,
  HEART = 1,
  HAHA = 2,
  ANGRY = 3,
}
@Entity({ name: 'REACTION', schema: process.env.DB_SCHEMA })
export class Reaction {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column('numeric', {
    nullable: false,
    name: 'TYPE',
  })
  type: number;

  @CreateDateColumn({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'CREATED_AT',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reactions)
  @JoinColumn({ name: 'USER_ID', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.reactions)
  @JoinColumn({ name: 'POST_ID', referencedColumnName: 'id' })
  post: Post;
}
