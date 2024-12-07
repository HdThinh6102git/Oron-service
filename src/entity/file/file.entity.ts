import {
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
  } from 'typeorm';
  
  @Entity({ name: 'file' })
  export class File {
    @PrimaryColumn({
      name: 'id',
      type: 'varchar',
      length: 36,
    })
    id: string;
  
    @Column('text', {
      nullable: true,
      name: 'name',
    })
    name: string;
  
    @Column('varchar', {
      length: 255,
      nullable: true,
      name: 'alternative_text',
    })
    alternativeText: string;
  
    @Column('text', {
      nullable: true,
      name: 'url',
    })
    url: string;
  
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
  