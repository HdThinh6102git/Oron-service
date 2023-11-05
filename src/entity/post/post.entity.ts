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
export enum POST_STATUS {
  IN_ACTIVE = 0,
  ACTIVE = 1,
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
    default: POST_STATUS.ACTIVE,
  })
  status: number;

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
}
