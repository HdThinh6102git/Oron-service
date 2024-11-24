import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableCommentRenameParentLevelToBeLevelField1732418810063 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."comment"
            RENAME COLUMN parent_level TO level
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."comment"
            RENAME COLUMN level TO parent_level
        `);
    }

}
