import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  

  export enum POSITION_STATUS_CD {
    AVAILABLE = 1,
    RESERVED = 2,
    RENTED = 3,
    INACTIVE = 4
  }

  @Entity({ name: 'advertisement_position' })
  export class AdvertismentPosition {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar', {
      length: 255,
      nullable: false,
      name: 'position_name',
    })
    positionName: string;
  
    @Column('varchar', {
      length: 50,
      nullable: false,
      name: 'dimention',
    })
    dimention: string;
  
    @Column('double precision', {
      nullable: true,
      name: 'price_per_day',
    })
    pricePerDay: number;
  
    @Column('varchar', {
      length: 20,
      nullable: true,
      name: 'status_cd',
    })
    statusCd: string;
  
    @Column('int', {
      nullable: true,
      name: 'max_duration',
    })
    maxDuration: number;
  
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
  