import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Province } from './address/province.entity';
import { District } from './address/district.entity';
import { Ward } from './address/ward.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment.entity';
import { Review } from '../review.entity';
import { Reaction } from '../reaction.entity';
import { PostRegistration } from '../post-registration.entity';
import { UserConnection } from './user-connection.entity';
import { SavedPost } from '../post/saved-post.entity';
import { Report } from '../report.entity';
import { ReportResponse } from '../report-response.entity';

export enum USER_STATUS {
  IN_ACTIVE = '0',
  ACTIVE = '1',
}
@Entity({ name: 'USER', schema: process.env.DB_SCHEMA })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid',{ name: 'ID' })
  id: string;

  @Column('varchar', { nullable: false, name: 'USERNAME' })
  username: string;

  @Column('varchar', { nullable: false, name: 'PASSWORD' })
  password: string;

  @Column('varchar', { nullable: true, name: 'NAME' })
  name: string;

  @Column('text', { nullable: true, name: 'FULL_ADDRESS' })
  fullAddress: string;

  @Column('text', { nullable: true, name: 'SPECIFIC_ADDRESS' })
  specificAddress: string;

  @Column('varchar', { nullable: true, name: 'PHONE_NUMBER' })
  phoneNumber: string;

  @Column('varchar', { nullable: true, name: 'EMAIL' })
  email: string;

  @Column('varchar', { nullable: true, name: 'PROFILE_PIC' })
  profilePic: string;

  @Column('varchar', { nullable: true, name: 'BACKGROUND_PIC' })
  backgroundPic: string;

  @Column('boolean', {
    nullable: false,
    name: 'IS_VERIFY_PHONE',
    default: false,
  })
  isVerifyPhone: boolean;

  @Column('boolean', {
    nullable: false,
    name: 'IS_VERIFY_EMAIL',
    default: false,
  })
  isVerifyEmail: boolean;

  @Column('varchar', {
    nullable: false,
    name: 'STATUS',
    default: USER_STATUS.ACTIVE,
  })
  status: string;

  @Column('varchar', { nullable: true, name: 'REFRESH_TOKEN' })
  refreshToken: string;

  @Column('timestamp', {
    nullable: true,
    name: 'LAST_LOGIN',
  })
  lastLogin: Date;

  @Column('varchar', {
    nullable: true,
    name: 'EMAIL_VERIFY_CODE',
  })
  emailVerifyCode: string;

  @Column({ type: 'numeric', nullable: true, name: 'VERIFICATION_TIME' })
  verificationTime: number;

  @Column('varchar', { nullable: true, name: 'PHONE_VERIFY_CODE' })
  phoneVerifyCode: string;

  @Column({
    type: 'date',
    nullable: true,
    name: 'BIRTH_DATE',
  })
  birthDate: Date;

  @Column('char',{
    nullable: true,
    name: 'GENDER_CD',
  })
  genderCD: string;

  @Column('text', {
    nullable: true,
    name: 'RELATED_URL',
  })
  relatedUrl: string;

  @Column('varchar', { length: 36, nullable: true, name: 'CREATE_BY' })
  createBy: string;

  @Column('varchar', { length: 36, nullable: true, name: 'MODIFY_BY' })
  modifyBy: string;

  @Column('char', {
    length: 1,
    default: '1',
    name: 'SYS_FLAG',
  })
  sysFlag: string;

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

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'ROLE_ID', referencedColumnName: 'id' })
  role: Role;

  @ManyToOne(() => Province, (province) => province.users)
  @JoinColumn({ name: 'PROVINCE_ID', referencedColumnName: 'id' })
  province: Province;

  @ManyToOne(() => District, (district) => district.users)
  @JoinColumn({ name: 'DISTRICT_ID', referencedColumnName: 'id' })
  district: District;

  @ManyToOne(() => Ward, (ward) => ward.users)
  @JoinColumn({ name: 'WARD_ID', referencedColumnName: 'id' })
  ward: Ward;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(
    () => PostRegistration,
    (postRegistration) => postRegistration.user,
  )
  postRegistrations: PostRegistration[];

  @OneToMany(
    () => UserConnection,
    (userConnectionFollower) => userConnectionFollower.follower,
  )
  followerConnections: UserConnection[];

  @OneToMany(
    () => UserConnection,
    (userConnectionFollowed) => userConnectionFollowed.followed,
  )
  followedConnections: UserConnection[];

  @OneToMany(() => SavedPost, (savedPost) => savedPost.user)
  savedPosts: SavedPost[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @OneToMany(() => ReportResponse, (reportResponse) => reportResponse.user)
  reportResponses: ReportResponse[];
}
