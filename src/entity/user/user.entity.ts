import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { Province } from './address/province.entity';
import { District } from './address/district.entity';
import { Ward } from './address/ward.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment.entity';
import { Review } from '../review.entity';
import { Reaction } from '../reaction.entity';

export enum USER_STATUS {
  IN_ACTIVE = 'IN_ACTIVE',
  ACTIVE = 'ACTIVE',
}
@Entity({ name: 'user', schema: process.env.DB_SCHEMA })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, name: 'username' })
  username: string;

  @Column('varchar', { nullable: false, name: 'password' })
  password: string;

  @Column('varchar', { nullable: false, name: 'name' })
  name: string;

  @Column('text', { nullable: false, name: 'full_address' })
  fullAddress: string;

  @Column('text', { nullable: false, name: 'specific_address' })
  specificAddress: string;

  @Column('varchar', { nullable: false, name: 'phone_number' })
  phoneNumber: string;

  @Column('varchar', { nullable: false, name: 'email' })
  email: string;

  @Column('varchar', { nullable: true, name: 'profile_pic' })
  profilePic: string;

  @Column('varchar', { nullable: true, name: 'background_pic' })
  backgroundPic: string;

  @Column('boolean', {
    nullable: false,
    name: 'is_verify_phone',
    default: false,
  })
  isVerifyPhone: boolean;

  @Column('boolean', {
    nullable: false,
    name: 'is_verify_email',
    default: false,
  })
  isVerifyEmail: boolean;

  @Column('varchar', {
    nullable: false,
    name: 'status',
    default: USER_STATUS.ACTIVE,
  })
  status: string;

  @Column('varchar', { nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @Column('timestamp', {
    nullable: true,
    name: 'last_login',
  })
  lastLogin: Date;

  @Column('varchar', {
    nullable: true,
    name: 'email_verify_code',
  })
  emailVerifyCode: string;

  @Column({ type: 'numeric', nullable: true, name: 'verification_time' })
  verificationTime: number;

  @Column('varchar', { nullable: true, name: 'phone_verify_code' })
  phoneVerifyCode: string;

  @Column('timestamp', {
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column('timestamp', {
    nullable: true,
    name: 'deleted_at',
  })
  deletedAt: Date;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @ManyToOne(() => Province, (province) => province.users)
  @JoinColumn({ name: 'province_id', referencedColumnName: 'id' })
  province: Province;

  @ManyToOne(() => District, (district) => district.users)
  @JoinColumn({ name: 'district_id', referencedColumnName: 'id' })
  district: District;

  @ManyToOne(() => Ward, (ward) => ward.users)
  @JoinColumn({ name: 'ward_id', referencedColumnName: 'id' })
  ward: Ward;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];
}
