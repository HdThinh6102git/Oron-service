import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableUserAddUserProfileColumn1731728809581 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add 'BIRTH_DATE' column
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD COLUMN IF NOT EXISTS "BIRTH_DATE" TIMESTAMP NULL
        `);

        // Add 'GENDER_CD' column
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD COLUMN IF NOT EXISTS "GENDER_CD" CHAR(1) NULL
        `);

        // Add 'RELATED_URL' column
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD COLUMN IF NOT EXISTS "RELATED_URL" TEXT NULL
        `);

        // Add 'SYS_FLAG' column
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD COLUMN IF NOT EXISTS "SYS_FLAG" CHAR(1) DEFAULT '1'
        `);

        // Drop 'deleted_at' column
        await queryRunner.query(`
            ALTER TABLE "user"
            DROP COLUMN IF EXISTS "deleted_at"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert by adding 'deleted_at' column
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP NULL
        `);

        // Drop 'BIRTH_DATE' column
        await queryRunner.query(`
            ALTER TABLE "user"
            DROP COLUMN IF EXISTS "BIRTH_DATE"
        `);

        // Drop 'GENDER_CD' column
        await queryRunner.query(`
            ALTER TABLE "user"
            DROP COLUMN IF EXISTS "GENDER_CD"
        `);

        // Drop 'RELATED_URL' column
        await queryRunner.query(`
            ALTER TABLE "user"
            DROP COLUMN IF EXISTS "RELATED_URL"
        `);

        // Drop 'SYS_FLAG' column
        await queryRunner.query(`
            ALTER TABLE "user"
            DROP COLUMN IF EXISTS "SYS_FLAG"
        `);
    }

}
