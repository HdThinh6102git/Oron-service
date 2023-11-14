import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1699933772819 implements MigrationInterface {
  name = 'migration1699933772819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "review" ADD "status" numeric NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "review" ADD "status" character varying NOT NULL DEFAULT 'ACTIVE'`,
    );
  }
}
