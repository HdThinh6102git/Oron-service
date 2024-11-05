import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'RENTAL_CONTRACT' })
  export class RentalContract {
    @PrimaryGeneratedColumn('uuid')
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
      length: 20,
      nullable: true,
      name: 'PAYMENT_STATUS_CD',
    })
    paymentStatusCd: string;
  
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
  