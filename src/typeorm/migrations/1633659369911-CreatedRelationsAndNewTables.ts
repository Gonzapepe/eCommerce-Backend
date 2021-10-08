import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatedRelationsAndNewTables1633659369911 implements MigrationInterface {
    name = 'CreatedRelationsAndNewTables1633659369911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "public"."product" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "public"."cart" DROP CONSTRAINT "REL_756f53ab9466eb52a52619ee01"`);
        await queryRunner.query(`ALTER TABLE "public"."cart" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "public"."product" ADD "stock" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."product" ADD "cartItemId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."product" ADD CONSTRAINT "UQ_f41130d01d11187a2aedefdca27" UNIQUE ("cartItemId")`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "cartId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "UQ_342497b574edb2309ec8c6b62aa" UNIQUE ("cartId")`);
        await queryRunner.query(`ALTER TABLE "public"."product" ADD CONSTRAINT "FK_f41130d01d11187a2aedefdca27" FOREIGN KEY ("cartItemId") REFERENCES "cart_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "FK_342497b574edb2309ec8c6b62aa" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "FK_342497b574edb2309ec8c6b62aa"`);
        await queryRunner.query(`ALTER TABLE "public"."product" DROP CONSTRAINT "FK_f41130d01d11187a2aedefdca27"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "UQ_342497b574edb2309ec8c6b62aa"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "cartId"`);
        await queryRunner.query(`ALTER TABLE "public"."product" DROP CONSTRAINT "UQ_f41130d01d11187a2aedefdca27"`);
        await queryRunner.query(`ALTER TABLE "public"."product" DROP COLUMN "cartItemId"`);
        await queryRunner.query(`ALTER TABLE "public"."product" DROP COLUMN "stock"`);
        await queryRunner.query(`ALTER TABLE "public"."cart" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."cart" ADD CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "public"."product" ADD "quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
