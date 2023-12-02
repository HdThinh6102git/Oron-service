import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1701502497335 implements MigrationInterface {
  name = 'migration1701502497335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "report_response" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, "report_id" uuid, CONSTRAINT "PK_3da69f750dbc1abf50fdbbebc01" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, "post_id" uuid, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_response" ADD CONSTRAINT "FK_7c16e5f8cb0c497898cf25f9626" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_response" ADD CONSTRAINT "FK_bf4dbe672cd2085a07ae645772a" FOREIGN KEY ("report_id") REFERENCES "report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD CONSTRAINT "FK_c6686efa4cd49fa9a429f01bac8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD CONSTRAINT "FK_265b3dc7c7f692f016115d46a29" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "report" DROP CONSTRAINT "FK_265b3dc7c7f692f016115d46a29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" DROP CONSTRAINT "FK_c6686efa4cd49fa9a429f01bac8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_response" DROP CONSTRAINT "FK_bf4dbe672cd2085a07ae645772a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_response" DROP CONSTRAINT "FK_7c16e5f8cb0c497898cf25f9626"`,
    );
    await queryRunner.query(`DROP TABLE "report"`);
    await queryRunner.query(`DROP TABLE "report_response"`);
  }
}
