import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'ADVERTISEMENT_BANNER' })
  export class AdvertisementBanner {
    @PrimaryGeneratedColumn('uuid', { name: 'ID' })
    id: string;
  
    @Column('varchar', {
      length: 255,
      nullable: false,
      name: 'BANNER_NAME',
    })
    bannerName: string;
  
    @Column('text', {
      nullable: true,
      name: 'REDIRECT_URL',
    })
    redirectUrl: string;
  
    @Column('varchar', {
      length: 20,
      nullable: true,
      name: 'STATUS_CD',
    })
    statusCd: string;
  
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
  