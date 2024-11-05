import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableAdvertisementBanner1730766495615 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ADVERTISEMENT_BANNER" (
                "ID" VARCHAR(36) NOT NULL PRIMARY KEY,
                "BANNER_NAME" VARCHAR(255) NOT NULL,
                "REDIRECT_URL" TEXT,
                "STATUS_CD" VARCHAR(20),
                "CREATE_BY" VARCHAR(36),
                "MODIFY_BY" VARCHAR(36),
                "CREATE_DATE" TIMESTAMP,
                "MODIFY_DATE" TIMESTAMP,
                "SYS_FLAG" CHAR(1)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ADVERTISEMENT_BANNER"`);
    }

}
