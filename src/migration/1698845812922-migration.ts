import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1698845812922 implements MigrationInterface {
  name = 'migration1698845812922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "category" ADD "status" numeric NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "category" ADD "status" character varying NOT NULL DEFAULT 'ACTIVE'`,
    );
  }
}
