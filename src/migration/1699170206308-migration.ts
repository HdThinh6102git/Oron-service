import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1699170206308 implements MigrationInterface {
  name = 'migration1699170206308';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "category" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "status" numeric NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "status" character varying NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "category" ADD "deleted_at" TIMESTAMP`,
    );
  }
}
