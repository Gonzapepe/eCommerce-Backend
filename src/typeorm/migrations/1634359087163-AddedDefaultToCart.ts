import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedDefaultToCart1634359087163 implements MigrationInterface {
    name = 'AddedDefaultToCart1634359087163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."cart" ALTER COLUMN "total" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."cart" ALTER COLUMN "total" DROP DEFAULT`);
    }

}
