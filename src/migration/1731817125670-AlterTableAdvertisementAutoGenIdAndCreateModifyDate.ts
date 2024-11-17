import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableAdvertisementAutoGenIdAndCreateModifyDate1731817125670 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // Set default value create and modify date
        //advertisement banner
        await queryRunner.query(`
            ALTER TABLE "ADVERTISEMENT_BANNER"
            ALTER COLUMN "CREATE_DATE" SET DEFAULT CURRENT_TIMESTAMP,
            ALTER COLUMN "MODIFY_DATE" SET DEFAULT CURRENT_TIMESTAMP;
        `);
        //ad-perfomance
        await queryRunner.query(`
            ALTER TABLE "AD_PERFORMANCE"
            ALTER COLUMN "CREATE_DATE" SET DEFAULT CURRENT_TIMESTAMP,
            ALTER COLUMN "MODIFY_DATE" SET DEFAULT CURRENT_TIMESTAMP;
        `);
        await queryRunner.query(`
            ALTER TABLE "CLIENT"
            ALTER COLUMN "CREATE_DATE" SET DEFAULT CURRENT_TIMESTAMP,
            ALTER COLUMN "MODIFY_DATE" SET DEFAULT CURRENT_TIMESTAMP;
        `);
        await queryRunner.query(`
            ALTER TABLE "RENTAL_CONTRACT"
            ALTER COLUMN "CREATE_DATE" SET DEFAULT CURRENT_TIMESTAMP,
            ALTER COLUMN "MODIFY_DATE" SET DEFAULT CURRENT_TIMESTAMP;
        `);
// Auto gen ID

        // Enable the pgcrypto extension if not already enabled (required for gen_random_uuid)
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
//Advertisement Banner
        // Drop the existing ID column
        await queryRunner.query(`
            ALTER TABLE "ADVERTISEMENT_BANNER"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with UUID type and set default value
        await queryRunner.query(`
            ALTER TABLE "ADVERTISEMENT_BANNER"
            ADD COLUMN "ID" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY
        `);
//ad-performance
        // Drop the existing ID column
        await queryRunner.query(`
            ALTER TABLE "AD_PERFORMANCE"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with UUID type and set default value
        await queryRunner.query(`
            ALTER TABLE "AD_PERFORMANCE"
            ADD COLUMN "ID" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY
        `);
//Client
        // Drop the existing ID column
        await queryRunner.query(`
            ALTER TABLE "CLIENT"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with UUID type and set default value
        await queryRunner.query(`
            ALTER TABLE "CLIENT"
            ADD COLUMN "ID" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY
        `);
//Rental Contract
        // Drop the existing ID column
        await queryRunner.query(`
            ALTER TABLE "RENTAL_CONTRACT"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with UUID type and set default value
        await queryRunner.query(`
            ALTER TABLE "RENTAL_CONTRACT"
            ADD COLUMN "ID" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
// Set default value create and modify date
        await queryRunner.query(`
            ALTER TABLE "ADVERTISEMENT_BANNER"
            ALTER COLUMN "CREATE_DATE" DROP DEFAULT,
            ALTER COLUMN "MODIFY_DATE" DROP DEFAULT;
        `);
        await queryRunner.query(`
            ALTER TABLE "AD_PERFORMANCE"
            ALTER COLUMN "CREATE_DATE" DROP DEFAULT,
            ALTER COLUMN "MODIFY_DATE" DROP DEFAULT;
        `);
        await queryRunner.query(`
            ALTER TABLE "CLIENT"
            ALTER COLUMN "CREATE_DATE" DROP DEFAULT,
            ALTER COLUMN "MODIFY_DATE" DROP DEFAULT;
        `);
        await queryRunner.query(`
            ALTER TABLE "RENTAL_CONTRACT"
            ALTER COLUMN "CREATE_DATE" DROP DEFAULT,
            ALTER COLUMN "MODIFY_DATE" DROP DEFAULT;
        `);

//Advertisement Banner
        // Drop the UUID ID column
        await queryRunner.query(`
            ALTER TABLE "ADVERTISEMENT_BANNER"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with VARCHAR(36)
        await queryRunner.query(`
            ALTER TABLE "ADVERTISEMENT_BANNER"
            ADD COLUMN "ID" VARCHAR(36) NOT NULL PRIMARY KEY
        `);
//Ad-Performance
        // Drop the UUID ID column
        await queryRunner.query(`
            ALTER TABLE "AD_PERFORMANCE"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with VARCHAR(36)
        await queryRunner.query(`
            ALTER TABLE "AD_PERFORMANCE"
            ADD COLUMN "ID" VARCHAR(36) NOT NULL PRIMARY KEY
        `);

//Client
        // Drop the UUID ID column
        await queryRunner.query(`
            ALTER TABLE "CLIENT"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with VARCHAR(36)
        await queryRunner.query(`
            ALTER TABLE "CLIENT"
            ADD COLUMN "ID" VARCHAR(36) NOT NULL PRIMARY KEY
        `);
//Rental Contract
        // Drop the UUID ID column
        await queryRunner.query(`
            ALTER TABLE "RENTAL_CONTRACT"
            DROP COLUMN "ID"
        `);

        // Recreate the ID column with VARCHAR(36)
        await queryRunner.query(`
            ALTER TABLE "RENTAL_CONTRACT"
            ADD COLUMN "ID" VARCHAR(36) NOT NULL PRIMARY KEY
        `);
    }

}
