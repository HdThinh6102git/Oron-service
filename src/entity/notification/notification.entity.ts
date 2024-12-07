import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'notification' })
export class Notification {
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
        name: 'title',
    })
    title: string;

    @Column('varchar', {
        length: 36,
        nullable: false,
        name: 'item_rid',
    })
    itemRid: string;

    @Column('text', {
        nullable: false,
        name: 'content',
    })
    content: string;

    @Column('char', {
        length: 1,
        nullable: false,
        name: 'type_cd',
    })
    typeCd: string;

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