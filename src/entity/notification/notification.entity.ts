import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'NOTIFICATION' })
export class Notification {
    @PrimaryGeneratedColumn('uuid', { name: 'ID' })
    id: string;

    @Column('varchar', {
        length: 36,
        nullable: false,
        name: 'ITEM_RID',
    })
    itemRid: string;

    @Column('text', {
        nullable: false,
        name: 'CONTENT',
    })
    content: string;

    @Column('char', {
        length: 1,
        nullable: false,
        name: 'TYPE_CD',
    })
    typeCd: string;

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