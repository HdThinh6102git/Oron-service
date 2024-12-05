import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PERMISSION_STATUS {
  IN_ACTIVE = 'IN_ACTIVE',
  ACTIVE = 'ACTIVE',
}

@Entity({ name: 'PERMISSION', schema: process.env.DB_SCHEMA })
export class Permission {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('varchar', { nullable: false, length: 255, name: 'PERMISSION_NAME' })
  name: string;

  @Column('varchar', {
    nullable: false,
    name: 'STATUS',
    default: PERMISSION_STATUS.ACTIVE,
  })
  status: string;

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
}
