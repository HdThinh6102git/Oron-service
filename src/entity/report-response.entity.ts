import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { 
  User,
  Report
 } from '@modules/entity';

@Entity({ name: 'report_response', schema: process.env.DB_SCHEMA })
export class ReportResponse {
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

  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({
    nullable: true,
    name: 'deleted_at',
    type: 'timestamptz',
  })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.reportResponses)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Report, (report) => report.reportResponses)
  @JoinColumn({ name: 'report_id', referencedColumnName: 'id' })
  report: Report;
}
