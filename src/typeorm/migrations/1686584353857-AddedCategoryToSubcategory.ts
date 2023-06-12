import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedCategoryToSubcategory1686584353857 implements MigrationInterface {
    name = 'AddedCategoryToSubcategory1686584353857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."subcategory" ADD "category" character varying DEFAULT 'pinturas'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."subcategory" DROP COLUMN "category"`);
    }

}
