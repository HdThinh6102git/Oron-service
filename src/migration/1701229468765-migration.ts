import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1701229468765 implements MigrationInterface {
  name = 'migration1701229468765';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "saved_post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "post_id" uuid, CONSTRAINT "PK_9db498bd687bbeb13faf83ac98d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_post" ADD CONSTRAINT "FK_7157d9273d704ecb2671bfb0720" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_post" ADD CONSTRAINT "FK_667736eef71e667998427203476" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "saved_post" DROP CONSTRAINT "FK_667736eef71e667998427203476"`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_post" DROP CONSTRAINT "FK_7157d9273d704ecb2671bfb0720"`,
    );
    await queryRunner.query(`DROP TABLE "saved_post"`);
  }
}
