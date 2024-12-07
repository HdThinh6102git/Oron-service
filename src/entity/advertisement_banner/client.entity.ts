import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'client' })
  export class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {
      length: 36,
      nullable: false,
      name: 'user_rid',
    })
    userRid: string;
  
    @Column('varchar', {
      length: 255,
      nullable: false,
      name: 'name',
    })
    name: string;
  
    @Column('varchar', {
      length: 50,
      nullable: false,
      name: 'contact_num',
    })
    contactNum: string;
  
    @Column('varchar', {
      length: 255,
      nullable: false,
      name: 'email_address',
    })
    emailAddress: string;
  
    @Column('varchar', {
      length: 50,
      nullable: false,
      name: 'payment_method',
    })
    paymentMethod: string;
  
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
  