import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user/user.entity';
import { Post } from './post/post.entity';
import { ReportResponse } from './report-response.entity';

@Entity({ name: 'REPORT', schema: process.env.DB_SCHEMA })
export class Report {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column('varchar', {
    nullable: false,
    name: 'TITLE',
  })
  title: string;

  @Column('text', {
    nullable: false,
    name: 'DESCRIPTION',
  })
  description: string;

  @CreateDateColumn({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'CREATED_AT',
  })
  createdAt: Date;

  @Column({
    nullable: true,
    name: 'DELETED_AT',
    type: 'timestamptz',
  })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'USER_ID', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.reports)
  @JoinColumn({ name: 'POST_ID', referencedColumnName: 'id' })
  post: Post;

  @OneToMany(() => ReportResponse, (reportResponse) => reportResponse.report)
  reportResponses: ReportResponse[];
}
