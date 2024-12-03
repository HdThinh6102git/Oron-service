import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableFileChangeDataTypeNameAndUrl1733063077338 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."FILE"
            ALTER COLUMN "NAME" TYPE text,
            ALTER COLUMN "URL" TYPE text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public."FILE"
            ALTER COLUMN "NAME" TYPE varchar(255),
            ALTER COLUMN "URL" TYPE varchar(255)
        `);
    }

}
