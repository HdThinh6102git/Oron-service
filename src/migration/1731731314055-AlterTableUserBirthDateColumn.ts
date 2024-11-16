import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableUserBirthDateColumn1731731314055 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Thay đổi kiểu dữ liệu của cột 'BIRTH_DATE' thành 'DATE'
        await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "BIRTH_DATE" TYPE DATE USING "BIRTH_DATE"::DATE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
         // Phục hồi kiểu dữ liệu của cột 'BIRTH_DATE' về 'TIMESTAMP'
         await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "BIRTH_DATE" TYPE TIMESTAMP USING "BIRTH_DATE"::TIMESTAMP
        `);
    }

}
