import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableAdvertisementPositionID1730855093447 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable the pgcrypto extension if not already enabled (required for gen_random_uuid)
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

        // Drop the existing ID column
        await queryRunner.query(`
            ALTER TABLE "ADVERTISMENT_POSITION"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with UUID type and set default value
        await queryRunner.query(`
            ALTER TABLE "ADVERTISMENT_POSITION"
            ADD COLUMN "ID" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the UUID ID column
        await queryRunner.query(`
            ALTER TABLE "ADVERTISMENT_POSITION"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with VARCHAR(36)
        await queryRunner.query(`
            ALTER TABLE "ADVERTISMENT_POSITION"
            ADD COLUMN "ID" VARCHAR(36) NOT NULL PRIMARY KEY
        `);
    }

}
