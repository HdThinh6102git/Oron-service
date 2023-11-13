import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1699867061205 implements MigrationInterface {
  name = 'migration1699867061205';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_registration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" text NOT NULL, "status" numeric NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "post_id" uuid, "user_id" uuid, CONSTRAINT "PK_a3a34e9fa1821377ee540664c6a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_registration" ADD CONSTRAINT "FK_8c214d89c9f72bb8624c991bf2e" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_registration" ADD CONSTRAINT "FK_5824fa26581405e521095778096" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_registration" DROP CONSTRAINT "FK_5824fa26581405e521095778096"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_registration" DROP CONSTRAINT "FK_8c214d89c9f72bb8624c991bf2e"`,
    );
    await queryRunner.query(`DROP TABLE "post_registration"`);
  }
}
