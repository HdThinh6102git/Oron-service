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

export enum COMMENT_STATUS {
  IN_ACTIVE = 0,
  ACTIVE = 1,
}

@Entity({ name: 'comment', schema: process.env.DB_SCHEMA })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
    name: 'description',
  })
  description: string;

  @Column('numeric', {
    nullable: false,
    name: 'status',
    default: COMMENT_STATUS.ACTIVE,
  })
  status: number;

  // Add to column in entity used for output values
  
  @Column('uuid', { name: 'user_id' })
  public userId: string;

  @Column('uuid', { name: 'post_id' })
  public postId: string;

  @Column('varchar', {
    nullable: true,
    name: 'parent_id',
  })
  parentId: string;

  @Column('numeric', {
    nullable: true,
    name: 'level',
  })
  level: number;

  @Column('varchar', {
    length: 36,
    nullable: true,
    name: 'create_by',
  })
  createBy: string;

  @Column('varchar', {
    length: 36,
    nullable: true,
    name: 'modify_by',
  })
  modifyBy: string;

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

  @Column('char', {
    length: 1,
    nullable: true,
    name: 'sys_flag',
  })
  sysFlag: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
