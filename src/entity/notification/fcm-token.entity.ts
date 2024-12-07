import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'fcm_token' })
export class FcmToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {
        length: 255,
        nullable: false,
        name: 'device_token',
    })
    deviceToken: string;

    @Column('varchar', {
        length: 36,
        nullable: false,
        name: 'usr_rid',
    })
    userRid: string;

    @Column({
        type: 'timestamp',
        nullable: false,
        name: 'latest_active_date',
    })
    latestActiveDate: Date;

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