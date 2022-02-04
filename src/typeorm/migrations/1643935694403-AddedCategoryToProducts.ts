import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedCategoryToProducts1643935694403 implements MigrationInterface {
    name = 'AddedCategoryToProducts1643935694403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."product" RENAME COLUMN "cartItemId" TO "category"`);
        await queryRunner.query(`ALTER TABLE "public"."product" ALTER COLUMN "category" SET DEFAULT 'pinturas'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."product" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."product" RENAME COLUMN "category" TO "cartItemId"`);
    }

}
