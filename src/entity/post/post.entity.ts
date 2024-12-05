import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Category } from './category.entity';
import { Comment } from '../comment.entity';
import { Review } from '../review.entity';
import { Reaction } from '../reaction.entity';
import { PostRegistration } from '../post-registration.entity';
import { SavedPost } from './saved-post.entity';
import { Report } from '../report.entity';
export enum POST_STATUS {
  PRIVATE = 0,
  PUBLIC = 1,
  FRIEND = 2,
  DEACTIVATE_BY_ADMIN = 3
}
export enum FINAL_POST_REGISTRATION_STATUS {
  AVAILABLE = 1,
  WAITING_RECEIPT = 3,
  RECEIVED = 4,
}

@Entity({ name: 'POST', schema: process.env.DB_SCHEMA })
export class Post {
  @PrimaryGeneratedColumn('uuid',{ name: 'ID' })
  id: string;

  @Column('text', {
    nullable: false,
    name: 'DESCRIPTION',
  })
  description: string;

  @Column('varchar', {
    nullable: true,
    name: 'IMAGE_URL',
  })
  imageURL: string;

  @Column('varchar', {
    nullable: true,
    name: 'VIDEO_URL',
  })
  videoURL: string;

  @Column('numeric', {
    nullable: false,
    name: 'STATUS',
    default: POST_STATUS.PUBLIC,
  })
  status: number;

  @Column('numeric', {
    nullable: false,
    name: 'FINAL_REGISTRATION_STATUS',
    default: FINAL_POST_REGISTRATION_STATUS.AVAILABLE,
  })
  finalRegistrationStatus: number;

  @Column('varchar', {
    nullable: true,
    name: 'PROVINCE_ID',
  })
  provinceId: string;

  @Column('varchar', {
    nullable: true,
    name: 'DISTRICT_ID',
  })
  districtId: string;

  @Column('varchar', {
    nullable: true,
    name: 'WARD_ID',
  })
  wardId: string;

  @Column('text', { nullable: true, name: 'FULL_ADDRESS' })
  fullAddress: string;

  @Column('text', { nullable: true, name: 'SPECIFIC_ADDRESS' })
  specificAddress: string;

  @Column('varchar', {
    nullable: true,
    name: 'RECEIVER_ID',
  })
  receiverId: string;

  @Column('varchar', { length: 36, nullable: true, name: 'CREATE_BY' })
  createBy: string;

  @Column('varchar', { length: 36, nullable: true, name: 'MODIFY_BY' })
  modifyBy: string;

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

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'USER_ID', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.posts)
  @JoinColumn({ name: 'CATEGORY_ID', referencedColumnName: 'id' })
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Review, (review) => review.post)
  reviews: Review[];

  @OneToMany(() => Reaction, (reaction) => reaction.post)
  reactions: Reaction[];

  @OneToMany(
    () => PostRegistration,
    (postRegistration) => postRegistration.post,
  )
  postRegistrations: PostRegistration[];

  @OneToMany(() => SavedPost, (savedPost) => savedPost.post)
  savedPosts: SavedPost[];

  @OneToMany(() => Report, (report) => report.post)
  reports: Report[];
}
