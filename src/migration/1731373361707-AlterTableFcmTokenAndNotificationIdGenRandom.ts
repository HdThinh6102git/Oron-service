import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableFcmTokenAndNotificationIdGenRandom1731373361707 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

        // Drop the existing ID column
        await queryRunner.query(`
            ALTER TABLE "NOTIFICATION"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with UUID type and set default value
        await queryRunner.query(`
            ALTER TABLE "NOTIFICATION"
            ADD COLUMN "ID" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY
        `);

        // Drop the existing ID column
        await queryRunner.query(`
            ALTER TABLE "FCM_TOKEN"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with UUID type and set default value
        await queryRunner.query(`
            ALTER TABLE "FCM_TOKEN"
            ADD COLUMN "ID" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "NOTIFICATION"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with VARCHAR(36)
        await queryRunner.query(`
            ALTER TABLE "NOTIFICATION"
            ADD COLUMN "ID" UUID PRIMARY KEY
        `);

        // Drop the UUID ID column
        await queryRunner.query(`
            ALTER TABLE "FCM_TOKEN"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with VARCHAR(36)
        await queryRunner.query(`
            ALTER TABLE "FCM_TOKEN"
            ADD COLUMN "ID" UUID PRIMARY KEY
        `);
    }

}
