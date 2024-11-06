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

  @Entity({ name: 'ADVERTISMENT_POSITION' })
  export class AdvertismentPosition {
    @PrimaryGeneratedColumn('uuid', { name: 'ID' })
    id: string;
  
    @Column('varchar', {
      length: 255,
      nullable: false,
      name: 'POSITION_NAME',
    })
    positionName: string;
  
    @Column('varchar', {
      length: 50,
      nullable: false,
      name: 'DIMENTION',
    })
    dimention: string;
  
    @Column('double precision', {
      nullable: true,
      name: 'PRICE_PER_DAY',
    })
    pricePerDay: number;
  
    @Column('varchar', {
      length: 20,
      nullable: true,
      name: 'STATUS_CD',
    })
    statusCd: string;
  
    @Column('int', {
      nullable: true,
      name: 'MAX_DURATION',
    })
    maxDuration: number;
  
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
  