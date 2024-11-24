import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableCommentAddCreateByAndModifyBy1732424180234 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."comment"
            ADD COLUMN create_by VARCHAR(36) NULL,
            ADD COLUMN modify_by VARCHAR(36) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."comment"
            DROP COLUMN create_by,
            DROP COLUMN modify_by
        `);
    }

}
