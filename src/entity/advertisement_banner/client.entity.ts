import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'CLIENT' })
  export class Client {
    @PrimaryGeneratedColumn('uuid', { name: 'ID' })
    id: string;

    @Column('varchar', {
      length: 36,
      nullable: false,
      name: 'USER_RID',
    })
    userRid: string;
  
    @Column('varchar', {
      length: 255,
      nullable: false,
      name: 'NAME',
    })
    name: string;
  
    @Column('varchar', {
      length: 50,
      nullable: false,
      name: 'CONTACT_NUM',
    })
    contactNum: string;
  
    @Column('varchar', {
      length: 255,
      nullable: false,
      name: 'EMAIL_ADDRESS',
    })
    emailAddress: string;
  
    @Column('varchar', {
      length: 50,
      nullable: false,
      name: 'PAYMENT_METHOD',
    })
    paymentMethod: string;
  
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
  