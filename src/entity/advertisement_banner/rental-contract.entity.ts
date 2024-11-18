import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export enum CONTRACT_STATUS_CD {
    PENDING_FOR_APPROVAL = 1,
    PENDING_FOR_PAYMENT = 2,
    REJECTED = 3,
    APPROVED = 4,
    USER_CANCELLED_REQUEST = 5,
    USER_CANCELLED_APPROVED_BANNER = 6
  }

  @Entity({ name: 'RENTAL_CONTRACT' })
  export class RentalContract {
    @PrimaryGeneratedColumn('uuid', { name: 'ID' })
    id: string;
  
    @Column('varchar', {
      length: 36,
      nullable: false,
      name: 'CLIENT_RID',
    })
    clientRid: string;
  
    @Column('varchar', {
      length: 36,
      nullable: false,
      name: 'POSITION_RID',
    })
    positionRid: string;
  
    @Column('varchar', {
      length: 36,
      nullable: false,
      name: 'BANNER_RID',
    })
    bannerRid: string;
  
    @Column('date', {
      nullable: true,
      name: 'START_DATE',
    })
    startDate: Date;
  
    @Column('date', {
      nullable: true,
      name: 'END_DATE',
    })
    endDate: Date;
  
    @Column('double precision', {
      nullable: true,
      name: 'TOTAL_COST',
    })
    totalCost: number;
  
    @Column('varchar', {
      length: 20,
      nullable: true,
      name: 'STATUS_CD',
    })
    statusCd: string;

    @Column('varchar', {
      length: 255,
      nullable: true,
      name: 'REJECT_REASON',
    })
    rejectReason: string;
  
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
  