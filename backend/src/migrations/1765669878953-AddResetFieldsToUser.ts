import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResetFieldsToUser1765669878953 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`user\` ADD \`resetPasswordToken\` varchar(255) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`user\` ADD \`resetPasswordExpires\` datetime NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`user\` DROP COLUMN \`resetPasswordExpires\``
        );
        await queryRunner.query(
            `ALTER TABLE \`user\` DROP COLUMN \`resetPasswordToken\``
        );
    }

}
