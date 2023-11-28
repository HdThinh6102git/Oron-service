import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1701152736095 implements MigrationInterface {
  name = 'migration1701152736095';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_connection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "follower_id" uuid, "followed_id" uuid, CONSTRAINT "PK_90c4161e28ad49adb32fcc076ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_connection" ADD CONSTRAINT "FK_7e549f53b61cb94e417cf78663d" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_connection" ADD CONSTRAINT "FK_4848cc9855cdd664163e581f6e5" FOREIGN KEY ("followed_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_connection" DROP CONSTRAINT "FK_4848cc9855cdd664163e581f6e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_connection" DROP CONSTRAINT "FK_7e549f53b61cb94e417cf78663d"`,
    );
    await queryRunner.query(`DROP TABLE "user_connection"`);
  }
}
