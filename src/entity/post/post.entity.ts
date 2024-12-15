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
import { 
  User, 
  Category,
  Comment,
  Review,
  Reaction,
  PostRegistration,
  SavedPost,
  Report
 } 
  from '@modules/entity';

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

@Entity({ name: 'post', schema: process.env.DB_SCHEMA })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
    name: 'description',
  })
  description: string;

  @Column('varchar', {
    nullable: true,
    name: 'image_url',
  })
  imageURL: string;

  @Column('varchar', {
    nullable: true,
    name: 'video_url',
  })
  videoURL: string;

  @Column('numeric', {
    nullable: false,
    name: 'status',
    default: POST_STATUS.PUBLIC,
  })
  status: number;

  @Column('numeric', {
    nullable: false,
    name: 'final_registration_status',
    default: FINAL_POST_REGISTRATION_STATUS.AVAILABLE,
  })
  finalRegistrationStatus: number;

  @Column('varchar', {
    nullable: true,
    name: 'province_id',
  })
  provinceId: string;

  @Column('varchar', {
    nullable: true,
    name: 'district_id',
  })
  districtId: string;

  @Column('varchar', {
    nullable: true,
    name: 'ward_id',
  })
  wardId: string;

  @Column('text', { nullable: true, name: 'full_address' })
  fullAddress: string;

  @Column('text', { nullable: true, name: 'specific_address' })
  specificAddress: string;

  @Column('varchar', {
    nullable: true,
    name: 'receiver_id',
  })
  receiverId: string;

  @Column('varchar', { length: 36, nullable: true, name: 'create_by' })
  createBy: string;

  @Column('varchar', { length: 36, nullable: true, name: 'modify_by' })
  modifyBy: string;

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

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.posts)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
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
