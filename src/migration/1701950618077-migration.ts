import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1701950618077 implements MigrationInterface {
  name = 'migration1701950618077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ADD "final_registration_status" numeric NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP COLUMN "final_registration_status"`,
    );
  }
}
