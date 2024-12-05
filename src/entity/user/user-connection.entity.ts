import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum USER_CONNECTION_TYPE {
  FOLLOW = 0,
  BE_FRIEND = 1,
}

@Entity({ name: 'USER_CONNECTION', schema: process.env.DB_SCHEMA })
export class UserConnection {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column('numeric', {
    nullable: false,
    name: 'TYPE',
  })
  type: number;

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

  @ManyToOne(() => User, (user) => user.followerConnections)
  @JoinColumn({ name: 'FOLLOWER_ID', referencedColumnName: 'id' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followedConnections)
  @JoinColumn({ name: 'FOLLOWED_ID', referencedColumnName: 'id' })
  followed: User;
}
