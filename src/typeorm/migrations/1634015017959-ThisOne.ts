import {MigrationInterface, QueryRunner} from "typeorm";

export class ThisOne1634015017959 implements MigrationInterface {
    name = 'ThisOne1634015017959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "stock" integer NOT NULL DEFAULT '0', "price" numeric(5,2) NOT NULL, "features" integer NOT NULL DEFAULT '0', "description" character varying NOT NULL DEFAULT 'Este producto no tiene descripción.', "cartItemId" uuid, CONSTRAINT "REL_f41130d01d11187a2aedefdca2" UNIQUE ("cartItemId"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cartId" uuid, "quantity" integer DEFAULT '0', CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total" numeric(5,2) NOT NULL, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "cartId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "UQ_342497b574edb2309ec8c6b62aa" UNIQUE ("cartId")`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_f41130d01d11187a2aedefdca27" FOREIGN KEY ("cartItemId") REFERENCES "cart_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "FK_342497b574edb2309ec8c6b62aa" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "FK_342497b574edb2309ec8c6b62aa"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_f41130d01d11187a2aedefdca27"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "UQ_342497b574edb2309ec8c6b62aa"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "cartId"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "cart_item"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
