import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableFIleRelatedMorph1730765730105 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "FILE_RELATED_MORPH" (
                "ID" VARCHAR(36) NOT NULL PRIMARY KEY,
                "RELATED_RID" VARCHAR(36),
                "RELATED_TYPE" VARCHAR(255),
                "FILE_RID" VARCHAR(36),
                "CREATE_BY" VARCHAR(36),
                "MODIFY_BY" VARCHAR(36),
                "CREATE_DATE" TIMESTAMP,
                "MODIFY_DATE" TIMESTAMP,
                "SYS_FLAG" CHAR(1)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "FILE_RELATED_MORPH"`);
    }

}
