import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableClientAddUserRidColumn1731806808333 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add 'GENDER_CD' column
        await queryRunner.query(`
            ALTER TABLE "CLIENT"
            ADD COLUMN IF NOT EXISTS "USER_RID" VARCHAR(36) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop 'GENDER_CD' column
        await queryRunner.query(`
            ALTER TABLE "CLIENT"
            DROP COLUMN IF EXISTS "USER_RID"
        `);
    }

}
