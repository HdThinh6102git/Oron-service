import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableCommentAddSysFlagField1732423599897 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."comment"
            ADD COLUMN sys_flag CHAR(1) NULL
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."comment"
            DROP COLUMN sys_flag
          `);
    }

}
