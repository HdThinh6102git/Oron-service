import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableFcmTokenDefaultLatestActive1731365243619 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "FCM_TOKEN"
            ALTER COLUMN "LATEST_ACTIVE_DATE" SET DEFAULT CURRENT_TIMESTAMP;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "FCM_TOKEN"
            ALTER COLUMN "LATEST_ACTIVE_DATE" DROP DEFAULT;
        `);
    }

}
