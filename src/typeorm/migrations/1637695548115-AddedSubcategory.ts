import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedSubcategory1637695548115 implements MigrationInterface {
    name = 'AddedSubcategory1637695548115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subcategory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_5ad0b82340b411f9463c8e9554d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subcategory_products_product" ("subcategoryId" uuid NOT NULL, "productId" uuid NOT NULL, CONSTRAINT "PK_dbd9d27537997d06c950b69ca22" PRIMARY KEY ("subcategoryId", "productId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_37a94aae29beb2d3bd422faab9" ON "subcategory_products_product" ("subcategoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ac530d194a2e01edc29e00bbe2" ON "subcategory_products_product" ("productId") `);
        await queryRunner.query(`ALTER TABLE "subcategory_products_product" ADD CONSTRAINT "FK_37a94aae29beb2d3bd422faab95" FOREIGN KEY ("subcategoryId") REFERENCES "subcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "subcategory_products_product" ADD CONSTRAINT "FK_ac530d194a2e01edc29e00bbe24" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcategory_products_product" DROP CONSTRAINT "FK_ac530d194a2e01edc29e00bbe24"`);
        await queryRunner.query(`ALTER TABLE "subcategory_products_product" DROP CONSTRAINT "FK_37a94aae29beb2d3bd422faab95"`);
        await queryRunner.query(`DROP INDEX "IDX_ac530d194a2e01edc29e00bbe2"`);
        await queryRunner.query(`DROP INDEX "IDX_37a94aae29beb2d3bd422faab9"`);
        await queryRunner.query(`DROP TABLE "subcategory_products_product"`);
        await queryRunner.query(`DROP TABLE "subcategory"`);
    }

}
