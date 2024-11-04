import { MigrationInterface, QueryRunner } from "typeorm"

export class AddCreateByModifyByToUserTable1730642919769 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD COLUMN "create_by" varchar(36) NULL,
            ADD COLUMN "modify_by" varchar(36) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            DROP COLUMN "create_by",
            DROP COLUMN "modify_by"
        `);
    }

}
