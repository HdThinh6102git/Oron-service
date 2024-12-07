import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'advertisement_banner' })
  export class AdvertisementBanner {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar', {
      length: 255,
      nullable: false,
      name: 'banner_name',
    })
    bannerName: string;
  
    @Column('text', {
      nullable: true,
      name: 'redirect_url',
    })
    redirectUrl: string;
  
    @Column('varchar', {
      length: 20,
      nullable: true,
      name: 'status_cd',
    })
    statusCd: string;
  
    @Column('varchar', {
      length: 36,
      nullable: true,
      name: 'create_by',
    })
    createBy: string;
  
    @Column('varchar', {
      length: 36,
      nullable: true,
      name: 'modify_by',
    })
    modifyBy: string;
  
    @CreateDateColumn({
      type: 'timestamp',
      nullable: true,
      name: 'create_date',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createDate: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      nullable: true,
      name: 'modify_date',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    modifyDate: Date;
  
    @Column('char', {
      length: 1,
      nullable: true,
      name: 'sys_flag',
    })
    sysFlag: string;
  }
  