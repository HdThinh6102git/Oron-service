import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum VERIFICATION_TYPE {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}
@Entity({ name: 'VERIFICATION', schema: process.env.DB_SCHEMA })
export class Verification {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column('varchar', {
    nullable: false,
    name: 'VERIFICATION_CODE',
  })
  verificationCode: string;

  @Column('varchar', {
    nullable: false,
    name: 'USER_ID',
  })
  userId: string;

  @Column('varchar', {
    nullable: false,
    name: 'TYPE',
  })
  type: string;

  @Column({ type: 'numeric', nullable: true, name: 'VERIFICATION_TIME' })
  verificationTime: number;

  @CreateDateColumn({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'CREATED_AT',
  })
  createdAt: Date;
}
