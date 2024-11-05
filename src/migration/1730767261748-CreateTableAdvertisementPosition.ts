import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableAdvertisementPosition1730767261748 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ADVERTISMENT_POSITION" (
                "ID" VARCHAR(36) NOT NULL PRIMARY KEY,
                "POSITION_NAME" VARCHAR(255) NOT NULL,
                "DIMENTION" VARCHAR(50) NOT NULL,
                "PRICE_PER_DAY" DOUBLE PRECISION,
                "STATUS_CD" VARCHAR(20),
                "MAX_DURATION" INT,
                "CREATE_BY" VARCHAR(36),
                "MODIFY_BY" VARCHAR(36),
                "CREATE_DATE" TIMESTAMP,
                "MODIFY_DATE" TIMESTAMP,
                "SYS_FLAG" CHAR(1)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ADVERTISMENT_POSITION"`);
    }

}
