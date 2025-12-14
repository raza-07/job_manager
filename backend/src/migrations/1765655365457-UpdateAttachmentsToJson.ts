import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAttachmentsToJson1765655365457 implements MigrationInterface {
    name = 'UpdateAttachmentsToJson1765655365457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` DROP COLUMN \`attachments\``);
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`attachments\` json NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job\` DROP COLUMN \`attachments\``);
        await queryRunner.query(`ALTER TABLE \`job\` ADD \`attachments\` text NULL`);
    }

}
