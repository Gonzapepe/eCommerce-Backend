import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedToOneToMany1635549426654 implements MigrationInterface {
    name = 'ChangedToOneToMany1635549426654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."product" DROP CONSTRAINT "FK_f41130d01d11187a2aedefdca27"`);
        await queryRunner.query(`ALTER TABLE "public"."cart_item" ADD "productId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."product" DROP CONSTRAINT "REL_f41130d01d11187a2aedefdca2"`);
        await queryRunner.query(`ALTER TABLE "public"."product" DROP COLUMN "cartItemId"`);
        await queryRunner.query(`ALTER TABLE "public"."product" ADD "cartItemId" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."cart_item" ADD CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."cart_item" DROP CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf"`);
        await queryRunner.query(`ALTER TABLE "public"."product" DROP COLUMN "cartItemId"`);
        await queryRunner.query(`ALTER TABLE "public"."product" ADD "cartItemId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."product" ADD CONSTRAINT "REL_f41130d01d11187a2aedefdca2" UNIQUE ("cartItemId")`);
        await queryRunner.query(`ALTER TABLE "public"."cart_item" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "public"."product" ADD CONSTRAINT "FK_f41130d01d11187a2aedefdca27" FOREIGN KEY ("cartItemId") REFERENCES "cart_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
