import { MigrationInterface, QueryRunner } from "typeorm"

export class AddGetAdvertisementBannerFunction1733733116989 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION public.get_advertisement_banners(p_position_name character varying DEFAULT NULL::character varying, p_start_date date DEFAULT NULL::date, p_end_date date DEFAULT NULL::date, p_contract_status_cd integer DEFAULT NULL::integer, p_banner_name character varying DEFAULT NULL::character varying, p_client_name character varying DEFAULT NULL::character varying, p_client_contact_number character varying DEFAULT NULL::character varying, p_user_id uuid DEFAULT NULL::uuid)
            RETURNS TABLE("contractId" uuid, "bannerName" character varying, "positionName" character varying, "positionDimention" character varying, "startDate" timestamp, "endDate" timestamp, "totalCost" double precision, "clientName" character varying, "clientContactNumber" character varying, "clientEmail" character varying, "contractStatus" character varying, "contractRejectReason" character varying, "createDate" timestamp, "modifyDate" timestamp)
            LANGUAGE plpgsql
            AS $function$
            BEGIN
                RETURN QUERY
                SELECT
                    rc."id" AS "contractId",
                    ab."banner_name" AS "bannerName",
                    ap."position_name" AS "positionName",
                    ap."dimention" AS "positionDimention",
                    rc."start_date" AS "startDate",
                    rc."end_date" AS "endDate",
                    rc."total_cost" AS "totalCost",
                    c."name" AS "clientName",
                    c."contact_num" AS "clientContactNumber",
                    c."email_address" AS "clientEmail",
                    rc."status_cd" AS "contractStatus",
                    rc."reject_reason" AS "contractRejectReason",
                    rc."create_date" AS "createDate",
                    rc."modify_date" AS "modifyDate"
                FROM
                    "rental_contract" rc
                INNER JOIN "advertisement_position" ap ON ap."id"::TEXT = rc."position_rid"
                INNER JOIN "client" c ON c."id"::TEXT = rc."client_rid"
                INNER JOIN "advertisement_banner" ab ON ab."id"::TEXT = rc."banner_rid"
                WHERE
                    (p_position_name IS NULL OR ap."position_name" ILIKE '%' || p_position_name || '%')
                    AND (p_start_date IS NULL OR rc."start_date" >= p_start_date)
                    AND (p_end_date IS NULL OR rc."end_date" <= p_end_date)
                    AND (p_contract_status_cd IS NULL OR rc."status_cd" = CAST(p_contract_status_cd AS VARCHAR))
                    AND (p_banner_name IS NULL OR ab."banner_name" ILIKE '%' || p_banner_name || '%')
                    AND (p_client_name IS NULL OR c."name" ILIKE '%' || p_client_name || '%')
                    AND (p_client_contact_number IS NULL OR c."contact_num" ILIKE '%' || p_client_contact_number || '%')
                    AND (p_user_id IS NULL OR c."user_rid"::UUID = p_user_id);
            END;
            $function$
            ;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION public.get_advertisement_banners(varchar, date, date, int4, varchar, varchar, varchar, uuid);`);
    }

}
