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

@Entity({ name: 'report', schema: process.env.DB_SCHEMA })
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    nullable: false,
    name: 'title',
  })
  title: string;

  @Column('text', {
    nullable: false,
    name: 'description',
  })
  description: string;

  @CreateDateColumn({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    nullable: true,
    name: 'deleted_at',
    type: 'timestamptz',
  })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.reports)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;

  @OneToMany(() => ReportResponse, (reportResponse) => reportResponse.report)
  reportResponses: ReportResponse[];
}
