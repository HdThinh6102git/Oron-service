import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableAdvertisementPositionDate1730856215965 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ADVERTISMENT_POSITION"
            ALTER COLUMN "CREATE_DATE" SET DEFAULT CURRENT_TIMESTAMP,
            ALTER COLUMN "MODIFY_DATE" SET DEFAULT CURRENT_TIMESTAMP;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ADVERTISMENT_POSITION"
            ALTER COLUMN "CREATE_DATE" DROP DEFAULT,
            ALTER COLUMN "MODIFY_DATE" DROP DEFAULT;
        `);
    }

}
