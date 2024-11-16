import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableNotificationAddTitleField1731568137524 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "NOTIFICATION"
            ADD COLUMN IF NOT EXISTS "TITLE" VARCHAR(255) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "NOTIFICATION"
            DROP COLUMN IF EXISTS "TITLE"
        `);
    }

}
