import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'ad_performance' })
  export class AdPerformance {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar', {
      length: 36,
      nullable: false,
      name: 'banner_rid',
    })
    bannerRid: string;
  
    @Column('varchar', {
      length: 36,
      nullable: false,
      name: 'contract_rid',
    })
    contractRid: string;
  
    @Column('date', {
      nullable: true,
      name: 'day_of_recorded',
    })
    dayOfRecorded: Date;
  
    @Column('int', {
      nullable: true,
      name: 'impressions',
    })
    impressions: number;
  
    @Column('int', {
      nullable: true,
      name: 'clicks',
    })
    clicks: number;
  
    @Column('int', {
      nullable: true,
      name: 'actions',
    })
    actions: number;
  
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
  