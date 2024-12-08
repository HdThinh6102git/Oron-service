import { MigrationInterface, QueryRunner } from "typeorm"

export class AddGetActiveAdvertisementBannersFunction1733630780168 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION public.get_active_advertisement_banners(
                p_position_id character varying
            )
            RETURNS TABLE(
                "bannerName" character varying, 
                "redirectUrl" text,  -- Matches the REDIRECT_URL column type in ADVERTISEMENT_BANNER
                "total" bigint       -- Total count as a bigint
            )
            LANGUAGE plpgsql
            AS $function$
            BEGIN
                RETURN QUERY
                SELECT
                    ab."banner_name",
                    ab."redirect_url",
                    COUNT(*) OVER () AS "total" -- Uses a window function to calculate the total number of rows
                FROM
                    "advertisement_banner" ab
                INNER JOIN "rental_contract" rc ON ab."id"::TEXT = rc."banner_rid" AND rc."sys_flag" = '1'
                WHERE
                    (p_position_id IS NULL OR rc."position_rid" = p_position_id);
            END;
            $function$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP FUNCTION IF EXISTS public.get_active_advertisement_banners(character varying);
        `);
    }

}
