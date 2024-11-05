import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'AD_PERFORMANCE' })
  export class AdPerformance {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar', {
      length: 36,
      nullable: false,
      name: 'BANNER_RID',
    })
    bannerRid: string;
  
    @Column('varchar', {
      length: 36,
      nullable: false,
      name: 'CONTRACT_RID',
    })
    contractRid: string;
  
    @Column('date', {
      nullable: true,
      name: 'DAY_OF_RECORDED',
    })
    dayOfRecorded: Date;
  
    @Column('int', {
      nullable: true,
      name: 'IMPRESSIONS',
    })
    impressions: number;
  
    @Column('int', {
      nullable: true,
      name: 'CLICKS',
    })
    clicks: number;
  
    @Column('int', {
      nullable: true,
      name: 'ACTIONS',
    })
    actions: number;
  
    @Column('varchar', {
      length: 36,
      nullable: true,
      name: 'CREATE_BY',
    })
    createBy: string;
  
    @Column('varchar', {
      length: 36,
      nullable: true,
      name: 'MODIFY_BY',
    })
    modifyBy: string;
  
    @CreateDateColumn({
      type: 'timestamp',
      nullable: true,
      name: 'CREATE_DATE',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createDate: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      nullable: true,
      name: 'MODIFY_DATE',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    modifyDate: Date;
  
    @Column('char', {
      length: 1,
      nullable: true,
      name: 'SYS_FLAG',
    })
    sysFlag: string;
  }
  