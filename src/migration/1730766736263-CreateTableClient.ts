import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableClient1730766736263 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "CLIENT" (
                "ID" VARCHAR(36) NOT NULL PRIMARY KEY,
                "NAME" VARCHAR(255) NOT NULL,
                "CONTACT_NUM" VARCHAR(50) NOT NULL,
                "EMAIL_ADDRESS" VARCHAR(255) NOT NULL,
                "PAYMENT_METHOD" VARCHAR(50) NOT NULL,
                "CREATE_BY" VARCHAR(36),
                "MODIFY_BY" VARCHAR(36),
                "CREATE_DATE" TIMESTAMP,
                "MODIFY_DATE" TIMESTAMP,
                "SYS_FLAG" CHAR(1)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "CLIENT"`);
    }

}
