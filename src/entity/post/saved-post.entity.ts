import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from './post.entity';

@Entity({ name: 'saved_post', schema: process.env.DB_SCHEMA })
export class SavedPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    nullable: false,
    default: () => 'DATE(CURRENT_TIMESTAMP)',
    name: 'created_at',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.savedPosts)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.savedPosts)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;
}
