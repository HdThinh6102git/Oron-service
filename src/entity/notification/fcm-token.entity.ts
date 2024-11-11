import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'FCM_TOKEN' })
export class FcmToken {
    @PrimaryGeneratedColumn('uuid', { name: 'ID' })
    id: string;

    @Column('varchar', {
        length: 255,
        nullable: false,
        name: 'DEVICE_TOKEN',
    })
    deviceToken: string;

    @Column('varchar', {
        length: 36,
        nullable: false,
        name: 'USR_RID',
    })
    userRid: string;

    @Column({
        type: 'timestamp',
        nullable: false,
        name: 'LATEST_ACTIVE_DATE',
    })
    latestActiveDate: Date;

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