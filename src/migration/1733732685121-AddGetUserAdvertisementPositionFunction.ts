import { MigrationInterface, QueryRunner } from "typeorm"

export class AddGetUserAdvertisementPositionFunction1733732685121 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION get_advertisement_positions(
                in_selected_start_date DATE,
                in_selected_end_date DATE
            )
            RETURNS TABLE (
                "id" UUID,
                "positionName" VARCHAR(255),
                "dimention" VARCHAR(50),
                "pricePerDay" FLOAT8,
                "dateStatusCd" TEXT
            ) AS $$
            BEGIN
                RETURN QUERY
                SELECT  
                    ap."id",
                    ap."position_name",
                    ap."dimention",
                    ap."price_per_day",
                    CASE
                        WHEN EXISTS (
                            SELECT 1
                            FROM "rental_contract" rc
                            WHERE rc."position_rid" = ap."id"::TEXT
                            AND rc."sys_flag" = '1'
                            AND rc."start_date" <= in_selected_end_date
                            AND rc."end_date" >= in_selected_start_date
                        ) THEN 'Unavailable'
                        ELSE 'Available'
                    END AS status
                FROM "advertisement_position" ap
                WHERE ap."sys_flag" = '1'
                AND ap."status_cd" = '1';
            END;
            $$ LANGUAGE plpgsql;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION IF EXISTS get_advertisement_positions(DATE, DATE);`);
    }

}




