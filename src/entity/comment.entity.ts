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

@Entity({ name: 'COMMENT', schema: process.env.DB_SCHEMA })
export class Comment {
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
    default: COMMENT_STATUS.ACTIVE,
  })
  status: number;

  // Add to column in entity used for output values
  
  @Column('uuid', { name: 'USER_ID' })
  public userId: string;

  @Column('uuid', { name: 'POST_ID' })
  public postId: string;

  @Column('varchar', {
    nullable: true,
    name: 'PARENT_ID',
  })
  parentId: string;

  @Column('numeric', {
    nullable: true,
    name: 'LEVEL',
  })
  level: number;

  @Column('varchar', {
    length: 36,
    nullable: true,
    name: 'CREATE_BY',
  })
  createBy: string;

  @Column('varchar', {
    length: 36,
    nullable: true,
    name: 'MODIFY_BY',
  })
  modifyBy: string;

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

  @Column('char', {
    length: 1,
    nullable: true,
    name: 'SYS_FLAG',
  })
  sysFlag: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'POST_ID', referencedColumnName: 'id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'USER_ID', referencedColumnName: 'id' })
  user: User;
}
