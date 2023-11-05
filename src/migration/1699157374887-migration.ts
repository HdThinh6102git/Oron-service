import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1699157374887 implements MigrationInterface {
  name = 'migration1699157374887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "post" ADD "deleted_at" TIMESTAMP`);
  }
}
