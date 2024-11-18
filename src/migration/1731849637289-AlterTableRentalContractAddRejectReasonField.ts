import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableRentalContractAddRejectReasonField1731849637289 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add 'REJECT_REASON' column
        await queryRunner.query(`
            ALTER TABLE "RENTAL_CONTRACT"
            ADD COLUMN IF NOT EXISTS "REJECT_REASON" VARCHAR(255)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop 'GENDER_CD' column
        await queryRunner.query(`
            ALTER TABLE "RENTAL_CONTRACT"
            DROP COLUMN IF EXISTS "REJECT_REASON"
        `);
    }

}
