import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableFcmToken1731335331932 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "FCM_TOKEN" (
                "ID" UUID PRIMARY KEY,
                "DEVICE_TOKEN" VARCHAR(255) NOT NULL,
                "USR_RID" VARCHAR(36) NOT NULL,
                "LATEST_ACTIVE_DATE" TIMESTAMP NOT NULL,
                "CREATE_BY" VARCHAR(36),
                "MODIFY_BY" VARCHAR(36),
                "CREATE_DATE" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "MODIFY_DATE" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "SYS_FLAG" CHAR(1)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "FCM_TOKEN"`);
    }

}
