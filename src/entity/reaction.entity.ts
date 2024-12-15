import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { 
  User,
  Post
 } from '@modules/entity';

export enum REACTION_TYPE {
  LIKE = 0,
  HEART = 1,
  HAHA = 2,
  ANGRY = 3,
}
@Entity({ name: 'reaction', schema: process.env.DB_SCHEMA })
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric', {
    nullable: false,
    name: 'type',
  })
  type: number;

  @CreateDateColumn({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reactions)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.reactions)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;
}
