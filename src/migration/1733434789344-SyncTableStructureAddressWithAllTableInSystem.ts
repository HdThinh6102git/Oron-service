import { MigrationInterface, QueryRunner } from "typeorm"

export class SyncTableStructureAddressWithAllTableInSystem1733434789344 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Remove old fields
     await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        DROP COLUMN "CREATED_AT"
      `);
  
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        DROP COLUMN "UPDATED_AT"
      `);
  
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        DROP COLUMN "DELETED_AT"
      `);
  
      // Add new fields
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        ADD COLUMN "CREATE_BY" VARCHAR(36) NULL
      `);
  
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        ADD COLUMN "MODIFY_BY" VARCHAR(36) NULL
      `);
  
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        ADD COLUMN "CREATE_DATE" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
  
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        ADD COLUMN "MODIFY_DATE" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
  
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        ADD COLUMN "SYS_FLAG" CHAR(1) DEFAULT 1
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert added fields
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        DROP COLUMN "CREATE_BY"
      `);
  
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        DROP COLUMN "MODIFY_BY"
      `);
  
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        DROP COLUMN "CREATE_DATE"
      `);
  
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        DROP COLUMN "MODIFY_DATE"
      `);
  
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        DROP COLUMN "SYS_FLAG"
      `);
  
      // Re-add removed fields
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        ADD COLUMN "CREATED_AT" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      `);
  
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        ADD COLUMN "UPDATED_AT" TIMESTAMP NULL
      `);
  
      await queryRunner.query(`
        ALTER TABLE public."PROVINCE"
        ADD COLUMN "DELETED_AT" TIMESTAMP NULL
      `);
    }

}
