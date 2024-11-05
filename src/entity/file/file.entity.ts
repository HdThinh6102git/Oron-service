import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'FILE' })
  export class File {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar', {
      length: 255,
      nullable: true,
      name: 'NAME',
    })
    name: string;
  
    @Column('varchar', {
      length: 255,
      nullable: true,
      name: 'ALTERNATIVE_TEXT',
    })
    alternativeText: string;
  
    @Column('varchar', {
      length: 255,
      nullable: true,
      name: 'URL',
    })
    url: string;
  
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
  