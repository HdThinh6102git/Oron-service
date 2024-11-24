import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableCommentAddParentFields1732415918024 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."comment"
            ADD COLUMN parent_id uuid NULL,
            ADD COLUMN parent_level numeric NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."comment"
            DROP COLUMN parent_id,
            DROP COLUMN parent_level
        `);
    }

}
