import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableFileChangeIdDataType1733066442932 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."FILE"
            ALTER COLUMN "ID" TYPE varchar(36) USING "ID"::varchar(36)
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."FILE"
            ALTER COLUMN "ID" TYPE uuid USING "ID"::uuid
          `);
    }

}
