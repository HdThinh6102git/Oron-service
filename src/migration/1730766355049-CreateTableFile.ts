import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableFile1730766355049 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "FILE" (
                "ID" VARCHAR(36) NOT NULL PRIMARY KEY,
                "NAME" VARCHAR(255),
                "ALTERNATIVE_TEXT" VARCHAR(255),
                "URL" VARCHAR(255),
                "CREATE_BY" VARCHAR(36),
                "MODIFY_BY" VARCHAR(36),
                "CREATE_DATE" TIMESTAMP,
                "MODIFY_DATE" TIMESTAMP,
                "SYS_FLAG" CHAR(1)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "FILE"`);
    }

}
