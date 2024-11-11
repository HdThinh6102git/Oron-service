import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableNotification1731335375011 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "NOTIFICATION" (
                "ID" UUID PRIMARY KEY,
                "ITEM_RID" VARCHAR(36) NOT NULL,
                "CONTENT" TEXT NOT NULL,
                "TYPE_CD" CHAR(1) NOT NULL,
                "CREATE_BY" VARCHAR(36),
                "MODIFY_BY" VARCHAR(36),
                "CREATE_DATE" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "MODIFY_DATE" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "SYS_FLAG" CHAR(1)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "NOTIFICATION"`);
    }

}
