import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1698912840146 implements MigrationInterface {
  name = 'migration1698912840146';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "status" numeric NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "status" character varying NOT NULL DEFAULT 'ACTIVE'`,
    );
  }
}
