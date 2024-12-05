import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from './post.entity';

@Entity({ name: 'SAVED_POST', schema: process.env.DB_SCHEMA })
export class SavedPost {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @CreateDateColumn({
    nullable: false,
    default: () => 'DATE(CURRENT_TIMESTAMP)',
    name: 'CREATED_AT',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.savedPosts)
  @JoinColumn({ name: 'USER_ID', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.savedPosts)
  @JoinColumn({ name: 'POST_ID', referencedColumnName: 'id' })
  post: Post;
}
