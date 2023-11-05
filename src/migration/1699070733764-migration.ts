import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1699070733764 implements MigrationInterface {
  name = 'migration1699070733764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "deleted_at"`);
  }
}
