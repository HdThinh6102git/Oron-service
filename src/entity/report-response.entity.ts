import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user/user.entity';
import { Report } from './report.entity';

@Entity({ name: 'REPORT_RESPONSE', schema: process.env.DB_SCHEMA })
export class ReportResponse {
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

  @UpdateDateColumn({
    nullable: true,
    name: 'UPDATED_AT',
  })
  updatedAt: Date;

  @Column({
    nullable: true,
    name: 'DELETED_AT',
    type: 'timestamptz',
  })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.reportResponses)
  @JoinColumn({ name: 'USER_ID', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Report, (report) => report.reportResponses)
  @JoinColumn({ name: 'REPORT_ID', referencedColumnName: 'id' })
  report: Report;
}
