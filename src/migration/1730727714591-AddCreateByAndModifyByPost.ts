import { MigrationInterface, QueryRunner } from "typeorm"

export class AddCreateByAndModifyByPost1730727439928 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD COLUMN IF NOT EXISTS "create_by" VARCHAR(36),
            ADD COLUMN IF NOT EXISTS "modify_by" VARCHAR(36)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post"
            DROP COLUMN IF EXISTS "create_by",
            DROP COLUMN IF EXISTS "modify_by"
        `);
    }

}
