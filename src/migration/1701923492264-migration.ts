import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1701923492264 implements MigrationInterface {
  name = 'migration1701923492264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ADD "receiver_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "receiver_id"`);
  }
}
