import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1701828260723 implements MigrationInterface {
  name = 'migration1701828260723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "full_address" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "specific_address" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phone_number" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phone_number" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "specific_address" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "full_address" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL`,
    );
  }
}
