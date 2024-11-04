import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateUserStatusDefault1730639149207 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT '1'`
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" ALTER COLUMN "status" DROP DEFAULT`
          );
    }

}
