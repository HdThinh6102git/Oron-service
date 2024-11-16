import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableNotificationAddUserRid1731448529745 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "NOTIFICATION"
            ADD COLUMN IF NOT EXISTS "USER_RID" VARCHAR(36) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "NOTIFICATION"
            DROP COLUMN IF EXISTS "USER_RID"
        `);
    }

}
