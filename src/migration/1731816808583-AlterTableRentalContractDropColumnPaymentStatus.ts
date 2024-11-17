import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableRentalContractDropColumnPaymentStatus1731816808583 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop 'deleted_at' column
        await queryRunner.query(`
            ALTER TABLE "RENTAL_CONTRACT"
            DROP COLUMN IF EXISTS "PAYMENT_STATUS_CD"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert by adding 'deleted_at' column
        await queryRunner.query(`
            ALTER TABLE "RENTAL_CONTRACT"
            ADD COLUMN IF NOT EXISTS "PAYMENT_STATUS_CD" VARCHAR(20)
        `);
    }

}
