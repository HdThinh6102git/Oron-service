import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1698815961727 implements MigrationInterface {
  name = 'migration1698815961727';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" ALTER COLUMN "updated_at" DROP DEFAULT`,
    );
  }
}
