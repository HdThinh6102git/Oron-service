import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'FILE_RELATED_MORPH' })
  export class FileRelatedMorph {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('varchar', {
      length: 36,
      nullable: true,
      name: 'RELATED_RID',
    })
    relatedRid: string;
  
    @Column('varchar', {
      length: 255,
      nullable: true,
      name: 'RELATED_TYPE',
    })
    relatedType: string;
  
    @Column('varchar', {
      length: 36,
      nullable: true,
      name: 'FILE_RID',
    })
    fileRid: string;
  
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
  