import { MigrationInterface, QueryRunner } from "typeorm"

export class RenameAllExistingTablesToBeUpperCase1733305410054 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        // Rename the table to uppercase
        await queryRunner.renameTable('province', 'PROVINCE');

        // Rename columns to uppercase
        await queryRunner.renameColumn('PROVINCE', 'id', 'ID');
        await queryRunner.renameColumn('PROVINCE', 'name', 'NAME');
        await queryRunner.renameColumn('PROVINCE', 'level', 'LEVEL');
        await queryRunner.renameColumn('PROVINCE', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('PROVINCE', 'updated_at', 'UPDATED_AT');
        await queryRunner.renameColumn('PROVINCE', 'deleted_at', 'DELETED_AT');

        // Rename the table to uppercase
        await queryRunner.renameTable('district', 'DISTRICT');

        // Rename columns in the DISTRICT table
        await queryRunner.renameColumn('DISTRICT', 'id', 'ID');
        await queryRunner.renameColumn('DISTRICT', 'name', 'NAME');
        await queryRunner.renameColumn('DISTRICT', 'level', 'LEVEL');
        await queryRunner.renameColumn('DISTRICT', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('DISTRICT', 'updated_at', 'UPDATED_AT');
        await queryRunner.renameColumn('DISTRICT', 'deleted_at', 'DELETED_AT');
        await queryRunner.renameColumn('DISTRICT', 'province_id', 'PROVINCE_ID');

        // Rename the table to uppercase
        await queryRunner.renameTable('ward', 'WARD');

        // Rename columns to uppercase
        await queryRunner.renameColumn('WARD', 'id', 'ID');
        await queryRunner.renameColumn('WARD', 'name', 'NAME');
        await queryRunner.renameColumn('WARD', 'level', 'LEVEL');
        await queryRunner.renameColumn('WARD', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('WARD', 'updated_at', 'UPDATED_AT');
        await queryRunner.renameColumn('WARD', 'deleted_at', 'DELETED_AT');
        await queryRunner.renameColumn('WARD', 'district_id', 'DISTRICT_ID');

        // Rename the table to uppercase
        await queryRunner.renameTable('permission', 'PERMISSION');

        // Rename columns in the PERMISSION table
        await queryRunner.renameColumn('PERMISSION', 'id', 'ID');
        await queryRunner.renameColumn('PERMISSION', 'permission_name', 'PERMISSION_NAME');
        await queryRunner.renameColumn('PERMISSION', 'status', 'STATUS');
        await queryRunner.renameColumn('PERMISSION', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('PERMISSION', 'updated_at', 'UPDATED_AT');

        // Rename the table to uppercase
        await queryRunner.renameTable('role', 'ROLE');

        // Rename columns to uppercase
        await queryRunner.renameColumn('ROLE', 'id', 'ID');
        await queryRunner.renameColumn('ROLE', 'role_name', 'ROLE_NAME');
        await queryRunner.renameColumn('ROLE', 'status', 'STATUS');
        await queryRunner.renameColumn('ROLE', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('ROLE', 'updated_at', 'UPDATED_AT');

        // Rename the table to uppercase
        await queryRunner.renameTable('verification', 'VERIFICATION');

        // Rename columns to uppercase
        await queryRunner.renameColumn('VERIFICATION', 'id', 'ID');
        await queryRunner.renameColumn('VERIFICATION', 'verification_code', 'VERIFICATION_CODE');
        await queryRunner.renameColumn('VERIFICATION', 'user_id', 'USER_ID');
        await queryRunner.renameColumn('VERIFICATION', 'type', 'TYPE');
        await queryRunner.renameColumn('VERIFICATION', 'verification_time', 'VERIFICATION_TIME');
        await queryRunner.renameColumn('VERIFICATION', 'created_at', 'CREATED_AT');

        // Rename the table to uppercase
        await queryRunner.renameTable('user', 'USER');

        // Rename columns to uppercase
        await queryRunner.renameColumn('USER', 'id', 'ID');
        await queryRunner.renameColumn('USER', 'username', 'USERNAME');
        await queryRunner.renameColumn('USER', 'password', 'PASSWORD');
        await queryRunner.renameColumn('USER', 'name', 'NAME');
        await queryRunner.renameColumn('USER', 'full_address', 'FULL_ADDRESS');
        await queryRunner.renameColumn('USER', 'specific_address', 'SPECIFIC_ADDRESS');
        await queryRunner.renameColumn('USER', 'phone_number', 'PHONE_NUMBER');
        await queryRunner.renameColumn('USER', 'email', 'EMAIL');
        await queryRunner.renameColumn('USER', 'profile_pic', 'PROFILE_PIC');
        await queryRunner.renameColumn('USER', 'background_pic', 'BACKGROUND_PIC');
        await queryRunner.renameColumn('USER', 'is_verify_phone', 'IS_VERIFY_PHONE');
        await queryRunner.renameColumn('USER', 'is_verify_email', 'IS_VERIFY_EMAIL');
        await queryRunner.renameColumn('USER', 'status', 'STATUS');
        await queryRunner.renameColumn('USER', 'refresh_token', 'REFRESH_TOKEN');
        await queryRunner.renameColumn('USER', 'last_login', 'LAST_LOGIN');
        await queryRunner.renameColumn('USER', 'email_verify_code', 'EMAIL_VERIFY_CODE');
        await queryRunner.renameColumn('USER', 'verification_time', 'VERIFICATION_TIME');
        await queryRunner.renameColumn('USER', 'phone_verify_code', 'PHONE_VERIFY_CODE');
        await queryRunner.renameColumn('USER', 'create_by', 'CREATE_BY');
        await queryRunner.renameColumn('USER', 'modify_by', 'MODIFY_BY');
        await queryRunner.renameColumn('USER', 'sys_flag', 'SYS_FLAG');
        await queryRunner.renameColumn('USER', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('USER', 'updated_at', 'UPDATED_AT');
        await queryRunner.renameColumn('USER', 'role_id', 'ROLE_ID');
        await queryRunner.renameColumn('USER', 'province_id', 'PROVINCE_ID');
        await queryRunner.renameColumn('USER', 'district_id', 'DISTRICT_ID');
        await queryRunner.renameColumn('USER', 'ward_id', 'WARD_ID');

        // Rename the table from 'category' to 'CATEGORY'
        await queryRunner.renameTable('category', 'CATEGORY');

        // Rename columns in the 'CATEGORY' table
        await queryRunner.renameColumn('CATEGORY', 'id', 'ID');
        await queryRunner.renameColumn('CATEGORY', 'name', 'NAME');
        await queryRunner.renameColumn('CATEGORY', 'description', 'DESCRIPTION');
        await queryRunner.renameColumn('CATEGORY', 'status', 'STATUS');
        await queryRunner.renameColumn('CATEGORY', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('CATEGORY', 'updated_at', 'UPDATED_AT');
        await queryRunner.renameColumn('CATEGORY', 'deleted_at', 'DELETED_AT');

        // Rename the table to uppercase
        await queryRunner.renameTable('post', 'POST');

        // Rename columns in the POST table
        await queryRunner.renameColumn('POST', 'id', 'ID');
        await queryRunner.renameColumn('POST', 'description', 'DESCRIPTION');
        await queryRunner.renameColumn('POST', 'image_url', 'IMAGE_URL');
        await queryRunner.renameColumn('POST', 'video_url', 'VIDEO_URL');
        await queryRunner.renameColumn('POST', 'status', 'STATUS');
        await queryRunner.renameColumn('POST', 'final_registration_status', 'FINAL_REGISTRATION_STATUS');
        await queryRunner.renameColumn('POST', 'province_id', 'PROVINCE_ID');
        await queryRunner.renameColumn('POST', 'district_id', 'DISTRICT_ID');
        await queryRunner.renameColumn('POST', 'ward_id', 'WARD_ID');
        await queryRunner.renameColumn('POST', 'full_address', 'FULL_ADDRESS');
        await queryRunner.renameColumn('POST', 'specific_address', 'SPECIFIC_ADDRESS');
        await queryRunner.renameColumn('POST', 'receiver_id', 'RECEIVER_ID');
        await queryRunner.renameColumn('POST', 'create_by', 'CREATE_BY');
        await queryRunner.renameColumn('POST', 'modify_by', 'MODIFY_BY');
        await queryRunner.renameColumn('POST', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('POST', 'updated_at', 'UPDATED_AT');
        await queryRunner.renameColumn('POST', 'deleted_at', 'DELETED_AT');
        await queryRunner.renameColumn('POST', 'user_id', 'USER_ID');
        await queryRunner.renameColumn('POST', 'category_id', 'CATEGORY_ID');

        // Rename the table to uppercase
        await queryRunner.renameTable('post_registration', 'POST_REGISTRATION');

        // Rename the columns to uppercase
        await queryRunner.renameColumn('POST_REGISTRATION', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('POST_REGISTRATION', 'updated_at', 'UPDATED_AT');
        await queryRunner.renameColumn('POST_REGISTRATION', 'message', 'MESSAGE');
        await queryRunner.renameColumn('POST_REGISTRATION', 'status', 'STATUS');
        await queryRunner.renameColumn('POST_REGISTRATION', 'post_id', 'POST_ID');
        await queryRunner.renameColumn('POST_REGISTRATION', 'user_id', 'USER_ID');

        // Rename the table
        await queryRunner.renameTable('comment', 'COMMENT');

        // Rename columns in the COMMENT table
        await queryRunner.renameColumn('COMMENT', 'id', 'ID');
        await queryRunner.renameColumn('COMMENT', 'description', 'DESCRIPTION');
        await queryRunner.renameColumn('COMMENT', 'status', 'STATUS');
        await queryRunner.renameColumn('COMMENT', 'user_id', 'USER_ID');
        await queryRunner.renameColumn('COMMENT', 'post_id', 'POST_ID');
        await queryRunner.renameColumn('COMMENT', 'parent_id', 'PARENT_ID');
        await queryRunner.renameColumn('COMMENT', 'level', 'LEVEL');
        await queryRunner.renameColumn('COMMENT', 'create_by', 'CREATE_BY');
        await queryRunner.renameColumn('COMMENT', 'modify_by', 'MODIFY_BY');
        await queryRunner.renameColumn('COMMENT', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('COMMENT', 'updated_at', 'UPDATED_AT');
        await queryRunner.renameColumn('COMMENT', 'sys_flag', 'SYS_FLAG');

        // Rename the table to uppercase
        await queryRunner.renameTable('review', 'REVIEW');

        // Rename columns to uppercase
        await queryRunner.renameColumn('REVIEW', 'id', 'ID');
        await queryRunner.renameColumn('REVIEW', 'description', 'DESCRIPTION');
        await queryRunner.renameColumn('REVIEW', 'status', 'STATUS');
        await queryRunner.renameColumn('REVIEW', 'number_star', 'NUMBER_STAR');
        await queryRunner.renameColumn('REVIEW', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('REVIEW', 'updated_at', 'UPDATED_AT');
        await queryRunner.renameColumn('REVIEW', 'post_id', 'POST_ID');
        await queryRunner.renameColumn('REVIEW', 'user_id', 'USER_ID');

         // Rename the table to uppercase
         await queryRunner.renameTable('saved_post', 'SAVED_POST');

         // Rename columns to uppercase
         await queryRunner.renameColumn('SAVED_POST', 'id', 'ID');
         await queryRunner.renameColumn('SAVED_POST', 'created_at', 'CREATED_AT');
         await queryRunner.renameColumn('SAVED_POST', 'user_id', 'USER_ID');
         await queryRunner.renameColumn('SAVED_POST', 'post_id', 'POST_ID');

        // Rename the table to uppercase
        await queryRunner.renameTable('reaction', 'REACTION');

        // Rename columns to uppercase
        await queryRunner.renameColumn('REACTION', 'id', 'ID');
        await queryRunner.renameColumn('REACTION', 'type', 'TYPE');
        await queryRunner.renameColumn('REACTION', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('REACTION', 'user_id', 'USER_ID');
        await queryRunner.renameColumn('REACTION', 'post_id', 'POST_ID');

        // Rename the table to uppercase
        await queryRunner.renameTable('user_connection', 'USER_CONNECTION');

        // Rename columns to uppercase
        await queryRunner.renameColumn('USER_CONNECTION', 'id', 'ID');
        await queryRunner.renameColumn('USER_CONNECTION', 'type', 'TYPE');
        await queryRunner.renameColumn('USER_CONNECTION', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('USER_CONNECTION', 'updated_at', 'UPDATED_AT');
        await queryRunner.renameColumn('USER_CONNECTION', 'follower_id', 'FOLLOWER_ID');
        await queryRunner.renameColumn('USER_CONNECTION', 'followed_id', 'FOLLOWED_ID');

        // Rename the table to uppercase
        await queryRunner.renameTable('report', 'REPORT');

        // Rename columns to uppercase
        await queryRunner.renameColumn('REPORT', 'id', 'ID');
        await queryRunner.renameColumn('REPORT', 'title', 'TITLE');
        await queryRunner.renameColumn('REPORT', 'description', 'DESCRIPTION');
        await queryRunner.renameColumn('REPORT', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('REPORT', 'deleted_at', 'DELETED_AT');
        await queryRunner.renameColumn('REPORT', 'user_id', 'USER_ID');
        await queryRunner.renameColumn('REPORT', 'post_id', 'POST_ID');

        // Rename the table to uppercase
        await queryRunner.renameTable('report_response', 'REPORT_RESPONSE');

        // Rename columns to uppercase
        await queryRunner.renameColumn('REPORT_RESPONSE', 'id', 'ID');
        await queryRunner.renameColumn('REPORT_RESPONSE', 'title', 'TITLE');
        await queryRunner.renameColumn('REPORT_RESPONSE', 'description', 'DESCRIPTION');
        await queryRunner.renameColumn('REPORT_RESPONSE', 'created_at', 'CREATED_AT');
        await queryRunner.renameColumn('REPORT_RESPONSE', 'updated_at', 'UPDATED_AT');
        await queryRunner.renameColumn('REPORT_RESPONSE', 'deleted_at', 'DELETED_AT');
        await queryRunner.renameColumn('REPORT_RESPONSE', 'user_id', 'USER_ID');
        await queryRunner.renameColumn('REPORT_RESPONSE', 'report_id', 'REPORT_ID');    

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // Revert the table name to lowercase
        await queryRunner.renameTable('PROVINCE', 'province');

        // Revert columns to lowercase
        await queryRunner.renameColumn('province', 'ID', 'id');
        await queryRunner.renameColumn('province', 'NAME', 'name');
        await queryRunner.renameColumn('province', 'LEVEL', 'level');
        await queryRunner.renameColumn('province', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('province', 'UPDATED_AT', 'updated_at');
        await queryRunner.renameColumn('province', 'DELETED_AT', 'deleted_at');

        // Revert table name to lowercase
        await queryRunner.renameTable('DISTRICT', 'district');

        // Revert column names in the district table
        await queryRunner.renameColumn('district', 'ID', 'id');
        await queryRunner.renameColumn('district', 'NAME', 'name');
        await queryRunner.renameColumn('district', 'LEVEL', 'level');
        await queryRunner.renameColumn('district', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('district', 'UPDATED_AT', 'updated_at');
        await queryRunner.renameColumn('district', 'DELETED_AT', 'deleted_at');
        await queryRunner.renameColumn('district', 'PROVINCE_ID', 'province_id');

        // Revert the table name to lowercase
        await queryRunner.renameTable('WARD', 'ward');

        // Revert columns to lowercase
        await queryRunner.renameColumn('ward', 'ID', 'id');
        await queryRunner.renameColumn('ward', 'NAME', 'name');
        await queryRunner.renameColumn('ward', 'LEVEL', 'level');
        await queryRunner.renameColumn('ward', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('ward', 'UPDATED_AT', 'updated_at');
        await queryRunner.renameColumn('ward', 'DELETED_AT', 'deleted_at');
        await queryRunner.renameColumn('ward', 'DISTRICT_ID', 'district_id');

        // Revert the table name to lowercase
        await queryRunner.renameTable('ROLE', 'role');

        // Revert columns to lowercase
        await queryRunner.renameColumn('role', 'ID', 'id');
        await queryRunner.renameColumn('role', 'ROLE_NAME', 'role_name');
        await queryRunner.renameColumn('role', 'STATUS', 'status');
        await queryRunner.renameColumn('role', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('role', 'UPDATED_AT', 'updated_at');

        // Revert table name to lowercase
        await queryRunner.renameTable('PERMISSION', 'permission');

        // Revert column names in the permission table
        await queryRunner.renameColumn('permission', 'ID', 'id');
        await queryRunner.renameColumn('permission', 'PERMISSION_NAME', 'permission_name');
        await queryRunner.renameColumn('permission', 'STATUS', 'status');
        await queryRunner.renameColumn('permission', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('permission', 'UPDATED_AT', 'updated_at');

        // Revert the table name to lowercase
        await queryRunner.renameTable('VERIFICATION', 'verification');

        // Revert columns to lowercase
        await queryRunner.renameColumn('verification', 'ID', 'id');
        await queryRunner.renameColumn('verification', 'VERIFICATION_CODE', 'verification_code');
        await queryRunner.renameColumn('verification', 'USER_ID', 'user_id');
        await queryRunner.renameColumn('verification', 'TYPE', 'type');
        await queryRunner.renameColumn('verification', 'VERIFICATION_TIME', 'verification_time');
        await queryRunner.renameColumn('verification', 'CREATED_AT', 'created_at');

        // Revert the table name to lowercase
        await queryRunner.renameTable('USER', 'user');

        // Revert columns to lowercase
        await queryRunner.renameColumn('user', 'ID', 'id');
        await queryRunner.renameColumn('user', 'USERNAME', 'username');
        await queryRunner.renameColumn('user', 'PASSWORD', 'password');
        await queryRunner.renameColumn('user', 'NAME', 'name');
        await queryRunner.renameColumn('user', 'FULL_ADDRESS', 'full_address');
        await queryRunner.renameColumn('user', 'SPECIFIC_ADDRESS', 'specific_address');
        await queryRunner.renameColumn('user', 'PHONE_NUMBER', 'phone_number');
        await queryRunner.renameColumn('user', 'EMAIL', 'email');
        await queryRunner.renameColumn('user', 'PROFILE_PIC', 'profile_pic');
        await queryRunner.renameColumn('user', 'BACKGROUND_PIC', 'background_pic');
        await queryRunner.renameColumn('user', 'IS_VERIFY_PHONE', 'is_verify_phone');
        await queryRunner.renameColumn('user', 'IS_VERIFY_EMAIL', 'is_verify_email');
        await queryRunner.renameColumn('user', 'STATUS', 'status');
        await queryRunner.renameColumn('user', 'REFRESH_TOKEN', 'refresh_token');
        await queryRunner.renameColumn('user', 'LAST_LOGIN', 'last_login');
        await queryRunner.renameColumn('user', 'EMAIL_VERIFY_CODE', 'email_verify_code');
        await queryRunner.renameColumn('user', 'VERIFICATION_TIME', 'verification_time');
        await queryRunner.renameColumn('user', 'PHONE_VERIFY_CODE', 'phone_verify_code');
        await queryRunner.renameColumn('user', 'BIRTH_DATE', 'birth_date');
        await queryRunner.renameColumn('user', 'GENDER_CD', 'gender_cd');
        await queryRunner.renameColumn('user', 'RELATED_URL', 'related_url');
        await queryRunner.renameColumn('user', 'CREATE_BY', 'create_by');
        await queryRunner.renameColumn('user', 'MODIFY_BY', 'modify_by');
        await queryRunner.renameColumn('user', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('user', 'UPDATED_AT', 'updated_at');
        await queryRunner.renameColumn('user', 'ROLE_ID', 'role_id');
        await queryRunner.renameColumn('user', 'PROVINCE_ID', 'province_id');
        await queryRunner.renameColumn('user', 'DISTRICT_ID', 'district_id');
        await queryRunner.renameColumn('user', 'WARD_ID', 'ward_id');

        // Rollback table name from 'CATEGORY' to 'category'
        await queryRunner.renameTable('CATEGORY', 'category');

        // Rollback column names in the 'category' table
        await queryRunner.renameColumn('category', 'ID', 'id');
        await queryRunner.renameColumn('category', 'NAME', 'name');
        await queryRunner.renameColumn('category', 'DESCRIPTION', 'description');
        await queryRunner.renameColumn('category', 'STATUS', 'status');
        await queryRunner.renameColumn('category', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('category', 'UPDATED_AT', 'updated_at');
        await queryRunner.renameColumn('category', 'DELETED_AT', 'deleted_at');

        // Revert table name to lowercase
        await queryRunner.renameTable('POST', 'post');

        // Revert column names in the post table
        await queryRunner.renameColumn('post', 'ID', 'id');
        await queryRunner.renameColumn('post', 'DESCRIPTION', 'description');
        await queryRunner.renameColumn('post', 'IMAGE_URL', 'image_url');
        await queryRunner.renameColumn('post', 'VIDEO_URL', 'video_url');
        await queryRunner.renameColumn('post', 'STATUS', 'status');
        await queryRunner.renameColumn('post', 'FINAL_REGISTRATION_STATUS', 'final_registration_status');
        await queryRunner.renameColumn('post', 'PROVINCE_ID', 'province_id');
        await queryRunner.renameColumn('post', 'DISTRICT_ID', 'district_id');
        await queryRunner.renameColumn('post', 'WARD_ID', 'ward_id');
        await queryRunner.renameColumn('post', 'FULL_ADDRESS', 'full_address');
        await queryRunner.renameColumn('post', 'SPECIFIC_ADDRESS', 'specific_address');
        await queryRunner.renameColumn('post', 'RECEIVER_ID', 'receiver_id');
        await queryRunner.renameColumn('post', 'CREATE_BY', 'create_by');
        await queryRunner.renameColumn('post', 'MODIFY_BY', 'modify_by');
        await queryRunner.renameColumn('post', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('post', 'UPDATED_AT', 'updated_at');
        await queryRunner.renameColumn('post', 'DELETED_AT', 'deleted_at');
        await queryRunner.renameColumn('post', 'USER_ID', 'user_id');
        await queryRunner.renameColumn('post', 'CATEGORY_ID', 'category_id');

        // Revert the table name to lowercase
        await queryRunner.renameTable('POST_REGISTRATION', 'post_registration');

        // Revert the column names to lowercase
        await queryRunner.renameColumn('post_registration', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('post_registration', 'UPDATED_AT', 'updated_at');
        await queryRunner.renameColumn('post_registration', 'MESSAGE', 'message');
        await queryRunner.renameColumn('post_registration', 'STATUS', 'status');
        await queryRunner.renameColumn('post_registration', 'POST_ID', 'post_id');
        await queryRunner.renameColumn('post_registration', 'USER_ID', 'user_id');

        // Revert table name
        await queryRunner.renameTable('COMMENT', 'comment');

        // Revert column names in the COMMENT table
        await queryRunner.renameColumn('comment', 'ID', 'id');
        await queryRunner.renameColumn('comment', 'DESCRIPTION', 'description');
        await queryRunner.renameColumn('comment', 'STATUS', 'status');
        await queryRunner.renameColumn('comment', 'USER_ID', 'user_id');
        await queryRunner.renameColumn('comment', 'POST_ID', 'post_id');
        await queryRunner.renameColumn('comment', 'PARENT_ID', 'parent_id');
        await queryRunner.renameColumn('comment', 'LEVEL', 'level');
        await queryRunner.renameColumn('comment', 'CREATE_BY', 'create_by');
        await queryRunner.renameColumn('comment', 'MODIFY_BY', 'modify_by');
        await queryRunner.renameColumn('comment', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('comment', 'UPDATED_AT', 'updated_at');
        await queryRunner.renameColumn('comment', 'SYS_FLAG', 'sys_flag');

        // Revert the table name to lowercase
        await queryRunner.renameTable('REACTION', 'reaction');

        // Revert columns to lowercase
        await queryRunner.renameColumn('reaction', 'ID', 'id');
        await queryRunner.renameColumn('reaction', 'TYPE', 'type');
        await queryRunner.renameColumn('reaction', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('reaction', 'USER_ID', 'user_id');
        await queryRunner.renameColumn('reaction', 'POST_ID', 'post_id');

        

        // Revert the table name to lowercase
        await queryRunner.renameTable('REVIEW', 'review');

        // Revert columns to lowercase
        await queryRunner.renameColumn('review', 'ID', 'id');
        await queryRunner.renameColumn('review', 'DESCRIPTION', 'description');
        await queryRunner.renameColumn('review', 'STATUS', 'status');
        await queryRunner.renameColumn('review', 'NUMBER_STAR', 'number_star');
        await queryRunner.renameColumn('review', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('review', 'UPDATED_AT', 'updated_at');
        await queryRunner.renameColumn('review', 'POST_ID', 'post_id');
        await queryRunner.renameColumn('review', 'USER_ID', 'user_id');

        

        // Revert the table name to lowercase
        await queryRunner.renameTable('SAVED_POST', 'saved_post');

        // Revert columns to lowercase
        await queryRunner.renameColumn('saved_post', 'ID', 'id');
        await queryRunner.renameColumn('saved_post', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('saved_post', 'USER_ID', 'user_id');
        await queryRunner.renameColumn('saved_post', 'POST_ID', 'post_id');

        

        // Revert the table name to lowercase
        await queryRunner.renameTable('USER_CONNECTION', 'user_connection');

        // Revert columns to lowercase
        await queryRunner.renameColumn('user_connection', 'ID', 'id');
        await queryRunner.renameColumn('user_connection', 'TYPE', 'type');
        await queryRunner.renameColumn('user_connection', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('user_connection', 'UPDATED_AT', 'updated_at');
        await queryRunner.renameColumn('user_connection', 'FOLLOWER_ID', 'follower_id');
        await queryRunner.renameColumn('user_connection', 'FOLLOWED_ID', 'followed_id');

        // Revert the table name to lowercase
        await queryRunner.renameTable('REPORT', 'report');

        // Revert columns to lowercase
        await queryRunner.renameColumn('report', 'ID', 'id');
        await queryRunner.renameColumn('report', 'TITLE', 'title');
        await queryRunner.renameColumn('report', 'DESCRIPTION', 'description');
        await queryRunner.renameColumn('report', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('report', 'DELETED_AT', 'deleted_at');
        await queryRunner.renameColumn('report', 'USER_ID', 'user_id');
        await queryRunner.renameColumn('report', 'POST_ID', 'post_id');

        // Revert the table name to lowercase
        await queryRunner.renameTable('REPORT_RESPONSE', 'report_response');

        // Revert columns to lowercase
        await queryRunner.renameColumn('report_response', 'ID', 'id');
        await queryRunner.renameColumn('report_response', 'TITLE', 'title');
        await queryRunner.renameColumn('report_response', 'DESCRIPTION', 'description');
        await queryRunner.renameColumn('report_response', 'CREATED_AT', 'created_at');
        await queryRunner.renameColumn('report_response', 'UPDATED_AT', 'updated_at');
        await queryRunner.renameColumn('report_response', 'DELETED_AT', 'deleted_at');
        await queryRunner.renameColumn('report_response', 'USER_ID', 'user_id');
        await queryRunner.renameColumn('report_response', 'REPORT_ID', 'report_id');

        

        
    }

}
