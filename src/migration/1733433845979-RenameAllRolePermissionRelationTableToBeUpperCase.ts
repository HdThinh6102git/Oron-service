// import { MigrationInterface, QueryRunner } from "typeorm"

// export class RenameAllRolePermissionRelationTableToBeUpperCase1733433845979 implements MigrationInterface {

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         // Rename the table to uppercase
//         await queryRunner.renameTable('role_permissions_permission', 'ROLE_PERMISSIONS_PERMISSION');

//         // Rename columns to uppercase
//         await queryRunner.renameColumn('ROLE_PERMISSIONS_PERMISSION', 'rOLEID', 'ROLEID');
//         await queryRunner.renameColumn('ROLE_PERMISSIONS_PERMISSION', 'pERMISSIONID', 'PERMISSIONID');
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         // Revert the table name to lowercase
//         await queryRunner.renameTable('ROLE_PERMISSIONS_PERMISSION', 'role_permissions_permission');

//         // Revert columns to lowercase
//         await queryRunner.renameColumn('role_permissions_permission', 'ROLEID', 'roleid');
//         await queryRunner.renameColumn('role_permissions_permission', 'PERMISSIONID', 'permissionid');
        
//     }

// }
