import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableRentalContract1730766872636 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "RENTAL_CONTRACT" (
                "ID" VARCHAR(36) NOT NULL PRIMARY KEY,
                "CLIENT_RID" VARCHAR(36) NOT NULL,
                "POSITION_RID" VARCHAR(36) NOT NULL,
                "BANNER_RID" VARCHAR(36) NOT NULL,
                "START_DATE" DATE,
                "END_DATE" DATE,
                "TOTAL_COST" DOUBLE PRECISION,
                "STATUS_CD" VARCHAR(20),
                "PAYMENT_STATUS_CD" VARCHAR(20),
                "CREATE_BY" VARCHAR(36),
                "MODIFY_BY" VARCHAR(36),
                "CREATE_DATE" TIMESTAMP,
                "MODIFY_DATE" TIMESTAMP,
                "SYS_FLAG" CHAR(1)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "RENTAL_CONTRACT"`);
    }

}
