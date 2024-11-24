import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableCommentChangeParentIdDataType1732416852228 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."comment"
            ALTER COLUMN parent_id TYPE varchar
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."comment"
            ALTER COLUMN parent_id TYPE uuid
            USING parent_id::uuid
        `);
    }

}
