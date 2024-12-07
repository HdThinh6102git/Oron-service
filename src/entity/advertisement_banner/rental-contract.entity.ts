import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export enum CONTRACT_STATUS_CD {
    PENDING_FOR_APPROVAL = '1',
    PENDING_FOR_PAYMENT = '2',
    REJECTED = '3',
    APPROVED = '4',
    USER_CANCELLED_REQUEST = '5',
    USER_CANCELLED_APPROVED_BANNER = '6'
  }

  @Entity({ name: 'rental_contract' })
  export class RentalContract {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar', {
      length: 36,
      nullable: false,
      name: 'client_rid',
    })
    clientRid: string;
  
    @Column('varchar', {
      length: 36,
      nullable: false,
      name: 'position_rid',
    })
    positionRid: string;
  
    @Column('varchar', {
      length: 36,
      nullable: false,
      name: 'banner_rid',
    })
    bannerRid: string;
  
    @Column('date', {
      nullable: true,
      name: 'start_date',
    })
    startDate: Date;
  
    @Column('date', {
      nullable: true,
      name: 'end_date',
    })
    endDate: Date;
  
    @Column('double precision', {
      nullable: true,
      name: 'total_cost',
    })
    totalCost: number;
  
    @Column('varchar', {
      length: 20,
      nullable: true,
      name: 'status_cd',
    })
    statusCd: string;

    @Column('varchar', {
      length: 255,
      nullable: true,
      name: 'reject_reason',
    })
    rejectReason: string;
  
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
  