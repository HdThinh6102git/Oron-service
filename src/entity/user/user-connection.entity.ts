import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@modules/entity';

export enum USER_CONNECTION_TYPE {
  FOLLOW = 0,
  BE_FRIEND = 1,
}

@Entity({ name: 'user_connection', schema: process.env.DB_SCHEMA })
export class UserConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric', {
    nullable: false,
    name: 'type',
  })
  type: number;

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

  @ManyToOne(() => User, (user) => user.followerConnections)
  @JoinColumn({ name: 'follower_id', referencedColumnName: 'id' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followedConnections)
  @JoinColumn({ name: 'followed_id', referencedColumnName: 'id' })
  followed: User;
}
