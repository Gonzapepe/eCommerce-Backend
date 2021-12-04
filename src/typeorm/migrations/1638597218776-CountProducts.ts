import {MigrationInterface, QueryRunner} from "typeorm";

export class CountProducts1638597218776 implements MigrationInterface {
    name = 'CountProducts1638597218776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."subcategory" ADD "count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."subcategory" DROP COLUMN "count"`);
    }

}
