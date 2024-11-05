import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableADPerformance1730766661016 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "AD_PERFORMANCE" (
                "ID" VARCHAR(36) NOT NULL PRIMARY KEY,
                "BANNER_RID" VARCHAR(36) NOT NULL,
                "CONTRACT_RID" VARCHAR(36) NOT NULL,
                "DAY_OF_RECORDED" DATE,
                "IMPRESSIONS" INT,
                "CLICKS" INT,
                "ACTIONS" INT,
                "CREATE_BY" VARCHAR(36),
                "MODIFY_BY" VARCHAR(36),
                "CREATE_DATE" TIMESTAMP,
                "MODIFY_DATE" TIMESTAMP,
                "SYS_FLAG" CHAR(1)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "AD_PERFORMANCE"`);
    }

}
